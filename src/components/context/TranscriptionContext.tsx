import { View, TouchableOpacity, StyleSheet, Image, Alert, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

export function Search() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);

    const transcribeAudio = async (uri: string) => {
        try {
            setIsLoading(true);

            const file = {
                uri: uri,
                type: "audio/m4a",
                name: "audio.m4a"
            };

            const formData = new FormData();
            formData.append("file", file as any);
            formData.append("model", "whisper-1");
            formData.append("language", "pt");

            const response = await axios.post(
                "https://api.openai.com/v1/audio/transcriptions",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": "Bearer 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"
                    }
                }
            );

            setTranscription(response.data.text);
            setIsLoading(false);
            Alert.alert("Transcrição Completa!", response.data.text);

        } catch (error) {
            console.error("Erro na transcrição:", error);
            setTranscription("Erro ao transcrever.");
            setIsLoading(false);
        }
    };
}
