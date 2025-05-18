import { View, TouchableOpacity, StyleSheet, Image, Alert, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function Search() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // Solicita permissão para microfone
  const requestRecordingPermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'O app precisa de permissão para usar o microfone.');
      return false;
    }
    return true;
  };

  // Salva transcrição em arquivo .txt dentro da pasta 'transcricoes'
  const saveTranscriptionToFile = async (text: string): Promise<string> => {
    try {
      const dirUri = FileSystem.documentDirectory + 'transcricoes/';
      const dirInfo = await FileSystem.getInfoAsync(dirUri);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
      }

      const fileName = `transcription_${Date.now()}.txt`;
      const fileUri = dirUri + fileName;

      await FileSystem.writeAsStringAsync(fileUri, text, { encoding: FileSystem.EncodingType.UTF8 });
      console.log('Arquivo de transcrição salvo em:', fileUri);

      return fileUri;
    } catch (error) {
      console.error('Erro ao salvar arquivo de transcrição:', error);
      Alert.alert('Erro', 'Falha ao salvar arquivo de transcrição.');
      return '';
    }
  };

  // Transcreve o áudio usando AssemblyAI
  const transcribeAudio = async (uri: string) => {
    try {
      setIsLoading(true);

      // Lê áudio em base64 para upload
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Upload do áudio para AssemblyAI
      const uploadResponse = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        Buffer.from(base64, 'base64'),
        {
          headers: {
            authorization: '3f145aee8ecc43578ea1357281d5888d',
            'content-type': 'application/octet-stream',
          },
        }
      );

      const uploadUrl = uploadResponse.data.upload_url;

      // Solicita transcrição
      const transcriptResponse = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        {
          audio_url: uploadUrl,
          language_code: 'pt',
        },
        {
          headers: {
            authorization: '3f145aee8ecc43578ea1357281d5888d',
            'content-type': 'application/json',
          },
        }
      );

      const transcriptId = transcriptResponse.data.id;

      // Polling até transcrição estar pronta
      let transcriptStatus = '';
      do {
        await sleep(3000);
        const statusResponse = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              authorization: '3f145aee8ecc43578ea1357281d5888d',
            },
          }
        );
        transcriptStatus = statusResponse.data.status;

        if (transcriptStatus === 'completed') {
          setTranscription(statusResponse.data.text);
          setIsLoading(false);
          Alert.alert('Transcrição Completa!', statusResponse.data.text);

          // Salva a transcrição em arquivo
          const fileUri = await saveTranscriptionToFile(statusResponse.data.text);
          if (fileUri) {
            Alert.alert('Arquivo salvo', `Arquivo salvo em:\n${fileUri}`);
          }
          break;
        }

        if (transcriptStatus === 'error') {
          setTranscription('Erro ao transcrever.');
          setIsLoading(false);
          Alert.alert('Erro', 'Falha na transcrição.');
          break;
        }
      } while (transcriptStatus !== 'completed');
    } catch (error) {
      console.error('Erro na transcrição:', error);
      setTranscription('Erro ao transcrever.');
      setIsLoading(false);
      Alert.alert('Erro', 'Falha na transcrição.');
    }
  };

  // Inicia ou para gravação
  const handlePress = async () => {
    if (!isRecording) {
      try {
        const permissionGranted = await requestRecordingPermission();
        if (!permissionGranted) return;

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        recordingRef.current = recording;
        setIsRecording(true);
      } catch (error) {
        console.error('Erro ao iniciar gravação:', error);
        Alert.alert('Erro', 'Não foi possível iniciar gravação.');
      }
    } else {
      try {
        const recording = recordingRef.current;
        if (recording) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          console.log('Áudio gravado em:', uri);

          if (uri) {
            // Move arquivo para pasta 'uploads'
            const fileName = uri.split('/').pop();
            const uploadsDir = FileSystem.documentDirectory + 'uploads/';

            const dirInfo = await FileSystem.getInfoAsync(uploadsDir);
            if (!dirInfo.exists) {
              await FileSystem.makeDirectoryAsync(uploadsDir, { intermediates: true });
            }

            const newUri = uploadsDir + fileName;

            await FileSystem.moveAsync({
              from: uri,
              to: newUri,
            });

            setAudioUri(newUri);
            setIsRecording(false);
            Alert.alert('Gravação concluída', 'Áudio gravado e movido para "uploads".');

            // Inicia transcrição
            await transcribeAudio(newUri);
          }
        }
      } catch (error) {
        console.error('Erro ao parar gravação:', error);
        Alert.alert('Erro', 'Não foi possível parar a gravação.');
      }
    }
  };

  // Reproduz áudio gravado
  const handlePlay = async () => {
    if (audioUri) {
      try {
        setIsLoading(true);
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true }
        );

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            console.log('Reprodução finalizada');
          }
        });

        setSound(newSound);
        await newSound.playAsync();
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao reproduzir o áudio:', error);
        Alert.alert('Erro', 'Falha ao tentar reproduzir o áudio.');
        setIsLoading(false);
      }
    } else {
      Alert.alert('Erro', 'Nenhum áudio gravado para reproduzir.');
    }
  };

  // Pausa reprodução
  const handlePause = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.micButton,
          isRecording ? styles.recordingButtonGreen : styles.recordingButtonRed,
        ]}
        onPress={handlePress}
      >
        <Feather name="mic" size={80} color="#fff" />
      </TouchableOpacity>

      {audioUri && (
        <View style={styles.audioContainer}>
          <Text>Áudio Gravado:</Text>
          {isLoading ? (
            <Text>Carregando transcrição...</Text>
          ) : (
            <>
              <TouchableOpacity onPress={handlePlay}>
                <Text style={styles.audioLink}>Reproduzir áudio</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePause}>
                <Text style={styles.audioLink}>Pausar áudio</Text>
              </TouchableOpacity>
              <Text>Transcrição: {transcription || 'Aguardando transcrição...'}</Text>
            </>
          )}
        </View>
      )}

      <Image
        source={require('../assets/logo-07.png')}
        style={styles.additionalImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingBottom: 20,
  },
  micButton: {
    marginTop: 100,
    borderRadius: 50,
    padding: 16,
    elevation: 4,
  },
  recordingButtonRed: {
    backgroundColor: '#f44336',
  },
  recordingButtonGreen: {
    backgroundColor: '#4CAF50',
  },
  additionalImage: {
    width: '100%',
    height: 200,
    marginTop: 20,
  },
  audioContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  audioLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 4,
  },
});
