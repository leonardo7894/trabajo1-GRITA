import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const GrabadoraDeAudio = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const EstadoDeGrabadora = useAudioRecorderState(GrabadoraDeAudio);

  const IniciarGrabacion = async () => {
    await GrabadoraDeAudio.prepareToRecordAsync();
    GrabadoraDeAudio.record();
  };

  useEffect(() => {
    (async () => {
      const estado = await AudioModule.requestRecordingPermissionsAsync();
      if (!estado.granted) {
        alert("Permiso de acceso de audio denegado");
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <TituloPagina></TituloPagina>
    </View>
  );
}

const TituloPagina = () => {
  return <Text style={styles.titulo}>Grita</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    color: "green",
  },
  titulo: {
    color: "pink",
    fontSize: 150,
    fontWeight: "bold",
    marginTop: 12,
  },
});
