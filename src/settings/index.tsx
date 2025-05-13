import { View, TouchableOpacity, StyleSheet, Image, Alert, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system'; // Importa FileSystem

export function Search() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const recordingRef = useRef<Audio.Recording | null>(null);

    const handlePress = async () => {
        if (!isRecording) {
            try {
                const { granted } = await Audio.requestPermissionsAsync();
                if (!granted) {
                    Alert.alert('Permissão negada para gravar áudio');
                    return;
                }

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
            }
        } else {
            try {
                const recording = recordingRef.current;
                if (recording) {
                    await recording.stopAndUnloadAsync();
                    const uri = recording.getURI();
                    console.log('Áudio gravado em:', uri);

                    // Salva o áudio gravado na pasta "uploads"
                    if (uri) {
                        const fileName = uri.split('/').pop(); // Extrai o nome do arquivo
                        const newUri = FileSystem.documentDirectory + 'uploads/' + fileName;

                        // Cria a pasta 'uploads' caso ela não exista
                        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'uploads', {
                            intermediates: true,
                        });

                        // Move o arquivo para a pasta 'uploads'
                        await FileSystem.moveAsync({
                            from: uri,
                            to: newUri,
                        });

                        console.log('Áudio movido para:', newUri);
                        setAudioUri(newUri);  // Salva a nova URI do arquivo movido
                        setIsRecording(false);
                        Alert.alert('Áudio gravado e movido para "uploads"!');
                    }
                }
            } catch (error) {
                console.error('Erro ao parar gravação:', error);
            }
        }
    };

    const handlePlay = async () => {
        if (audioUri) {
            try {
                setIsLoading(true);
                console.log('Tentando carregar o áudio:', audioUri);

                // Pequeno atraso para garantir que o arquivo foi gravado corretamente
                setTimeout(async () => {
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
                }, 500); // Atraso de 500ms

            } catch (error) {
                console.error('Erro ao tentar reproduzir o áudio:', error);
                Alert.alert('Erro', 'Falha ao tentar reproduzir o áudio.');
                setIsLoading(false);
            }
        } else {
            Alert.alert('Erro', 'Nenhum áudio gravado para reproduzir.');
        }
    };

    const handlePause = async () => {
        if (sound) {
            await sound.pauseAsync();
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.micButton, isRecording ? styles.recordingButtonGreen : styles.recordingButtonRed]}
                onPress={handlePress}
            >
                <Feather name="mic" size={80} color="#fff" />
            </TouchableOpacity>

            {audioUri && (
                <View style={styles.audioContainer}>
                    <Text>Áudio Gravado:</Text>
                    {isLoading ? (
                        <Text>Carregando áudio...</Text>
                    ) : (
                        <>
                            <TouchableOpacity onPress={handlePlay}>
                                <Text style={styles.audioLink}>Reproduzir áudio</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePause}>
                                <Text style={styles.audioLink}>Pausar áudio</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}

            <Image
                source={require("../assets/logo-07.png")}
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    audioContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    audioLink: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});
