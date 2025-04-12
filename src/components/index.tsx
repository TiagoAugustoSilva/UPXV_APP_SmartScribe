import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';

export function Search() {
    const [isRecording, setIsRecording] = useState(false);

    const handlePress = () => {
        setIsRecording(!isRecording);
        // Lógica adicional para iniciar/parar a gravação pode ser adicionada aqui
    };

    return (
        <View style={styles.container}>
            {/* Ícone de Microfone para Gravar Áudio */}
            <TouchableOpacity
                style={[styles.micButton, isRecording ? styles.recordingButtonGreen : styles.recordingButtonRed]} // Alteração da cor de fundo
                onPress={handlePress}
            >
                <Feather name="mic" size={80} color="#fff" /> {/* Ícone sempre branco */}
            </TouchableOpacity>

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
        flex: 1,  // Faz o contêiner ocupar toda a tela
        justifyContent: 'center',  // Centraliza o conteúdo verticalmente
        alignItems: 'center',  // Centraliza o conteúdo horizontalmente
        width: '100%',
        height: '100%',
    },
    micButton: {
        marginTop: 100,  // Adiciona um espaço entre o banner e o botão de microfone
        borderRadius: 50,  // Botão arredondado
        padding: 16,  // Espaçamento ao redor do ícone
        elevation: 4,  // Sombra no botão (para dar um destaque)
    },
    recordingButtonRed: {
        backgroundColor: '#f44336',  // Cor de fundo vermelha quando não estiver gravando
    },
    recordingButtonGreen: {
        backgroundColor: '#4CAF50',  // Cor de fundo verde quando estiver gravando
    },
    additionalImage: {
        width: '100%',  // Largura da imagem para ocupar toda a largura da tela
        height: 200,  // Altura desejada para a imagem
        marginTop: 150,  // Ajusta o espaço acima da imagem, movendo-a para baixo
        alignItems: 'center',
        justifyContent: 'center',
    },
});
