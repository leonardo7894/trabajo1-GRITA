import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";

export default function Grita() {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [fontSize, setFontSize] = useState(30);
  const puedeMostrar = useRef(true);
  const [poema, setPoema] = useState("");
  const poemaCompleto = [
    "Grito y el mundo responde en silencio.",
    "La voz rompe el aire, nace la palabra.",
    "En el ruido encuentro sentido.",
    "El grito escribe lo que el alma calla.",
  ];

  useEffect(() => {
    iniciar();
    
  }, []);

  const iniciar = async () => {
    if (recordingRef.current) return;

    let permiso = await Audio.requestPermissionsAsync();

    if (!permiso.granted) {
      permiso = await Audio.requestPermissionsAsync();
      if (!permiso.granted) return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();// esto es para que no tire error ya que al ejecutar todo comienza otra vez y tira error porque no puede hacer dos grabaciones al mismo tiempo
    recordingRef.current = recording;

    try{
    await recording.prepareToRecordAsync({
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      isMeteringEnabled: true, 
    })
  }  catch (error) {
    console.log("Error al preparar grabación:", error);
  }

    recording.setProgressUpdateInterval(100); // te dice cada cuantos milisegundos mide el valor del microfono
    recording.setOnRecordingStatusUpdate((status) => {
      if (status.metering !== undefined) {
        const volumen = status.metering; //mtering te dice el valor que tiene el microfono en numeros
        const nuevoTamano = Math.max(20, volumen + 160);
        setFontSize(nuevoTamano);
        if (volumen > -50 && puedeMostrar.current) {
          puedeMostrar.current = false;
          mostrarPoema();
        
          setTimeout(() => {
            puedeMostrar.current = true;
          }, 2000);
        }
      }
      
    });

    await recording.startAsync();
  };
  const mostrarPoema = () => {
    const random = Math.floor(Math.random() * poemaCompleto.length);
    setPoema(poemaCompleto[random]);
  };


  return (
    <View style={styles.container}>
    <View style={styles.titulo}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.titulo, { fontSize }]}>Grita</Text>
    </View>
    <View style={styles.poemaContainer}>
      <Text numberOfLines={2} style={styles.poema}>{poema}</Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    backgroundColor: "rgb(2,3,10)",
  },
  titulo: {
    paddingTop: 80,
    color: "white",
    textAlign: "center",
  },
  poemaContainer: {
    position: "absolute",
    bottom: 350,
    width: "100%",
    alignItems: "center",
  },
  
  poema: {
    fontSize: 26,
    color: "green",
    textAlign: "center",
  },
});
