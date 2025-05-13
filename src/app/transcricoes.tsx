import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../components/context/ThemeContext";

interface RecordingItem {
  uri: string;
  date: string;
  id: string;
  isPlaying: boolean;
  sound: Audio.Sound | null;
}

export default function Gravacoes() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const { theme } = useTheme();

  // Função para carregar gravações salvas (caso você queira persistir gravações)
  useEffect(() => {
    // Aqui você pode adicionar a lógica de carregamento, como carregar gravações de um banco local ou AsyncStorage
  }, []);

  const handleRecord = async () => {
    try {
      if (!isRecording) {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          Alert.alert("Permissão negada para gravar áudio");
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync({
          android: {
            extension: ".m4a",
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".m4a",
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
          },
        });

        recordingRef.current = recording;
        setIsRecording(true);
      } else {
        const recording = recordingRef.current;
        if (recording) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          setIsRecording(false);

          if (uri) {
            const newRecording = {
              uri,
              date: new Date().toISOString(),
              id: `${Date.now()}`,
              isPlaying: false,
              sound: null,
            };
            setRecordings((prev) => [...prev, newRecording]);
            Alert.alert("Gravação salva!", `Arquivo de áudio: ${uri}`);
          }
        }
      }
    } catch (error) {
      console.error("Erro na gravação:", error);
      Alert.alert("Erro", "Falha ao gravar o áudio.");
    }
  };

  const handlePlayPause = async (recording: RecordingItem) => {
    try {
      const currentRecordingIndex = recordings.findIndex((rec) => rec.id === recording.id);
      const updatedRecordings = [...recordings];

      // Se já está tocando, pausar
      if (recording.isPlaying && recording.sound) {
        await recording.sound.pauseAsync();
        updatedRecordings[currentRecordingIndex].isPlaying = false;
        setRecordings(updatedRecordings);
        return;
      }

      // Parar qualquer som ativo antes de tocar o novo
      recordings.forEach(async (rec) => {
        if (rec.isPlaying && rec.sound) {
          await rec.sound.stopAsync();
        }
      });

      let sound = recording.sound;

      // Se o som não foi criado, cria um novo
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recording.uri },
          { shouldPlay: true }
        );
        sound = newSound;

        // Atualiza a gravação com o som criado
        updatedRecordings[currentRecordingIndex].sound = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            updatedRecordings[currentRecordingIndex].isPlaying = false;
            setRecordings([...updatedRecordings]);
          }
        });
      } else {
        await sound.playAsync();
      }

      // Atualiza o estado da reprodução
      updatedRecordings[currentRecordingIndex].isPlaying = true;
      setRecordings(updatedRecordings);
    } catch (error) {
      console.error("Erro ao reproduzir:", error);
      Alert.alert("Erro", "Falha ao reproduzir o áudio.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={[
          styles.button,
          isRecording ? styles.buttonRecording : styles.buttonIdle,
          { backgroundColor: theme.primary },
        ]}
        onPress={handleRecord}
      >
        <Feather name="mic" size={80} color="#fff" />
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.text }]}>
        {isRecording ? "Gravando..." : "Pressione para gravar"}
      </Text>

      <Text style={[styles.subtitle, { color: theme.text }]}>Gravações:</Text>
      {recordings.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.text }]}>
          Nenhuma gravação salva.
        </Text>
      ) : (
        <FlatList
          data={recordings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.recordingItem, { backgroundColor: theme.secondary }]}
              onPress={() => handlePlayPause(item)}
            >
              <Text style={[styles.recordingText, { color: theme.text }]}>
                Gravação: {new Date(item.date).toLocaleString()}
              </Text>
              <Feather
                name={item.isPlaying ? "pause" : "play"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  button: {
    alignSelf: "center",
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  buttonIdle: {
    backgroundColor: "#0066ff",
  },
  buttonRecording: {
    backgroundColor: "#ff3b30",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  emptyText: {
    fontStyle: "italic",
    textAlign: "center",
  },
  recordingItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordingText: {
    fontSize: 16,
  },
});
