import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = () => {
        // Simula cadastro bem-sucedido no frontend
        console.log("Cadastro realizado:", { name, email, password });

        Alert.alert("Sucesso", "Usuário cadastrado, faça login");

        // Opcional: limpar campos após cadastro
        setName("");
        setEmail("");
        setPassword("");

        // Opcional: navegar para tela de login
        // router.push('/login');
    };

    return (
        <KeyboardAvoidingView
            style={styles.mainContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Botão de voltar no topo */}
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#6666ff"/>
                </Pressable>

                {/* Logo do app */}
                <Image
                    source={require("../../../assets/logo-03.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={styles.container}>
                    <Text style={styles.title}>Bem-vindo(a)</Text>

                    {/* Container para os Inputs */}
                    <View style={styles.containerForm}>
                        {/* Título para o campo de e-mail */}
                        <Text style={styles.inputLabel}>E-mail/Nickname</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite um e-mail, nickname"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        {/* Título para o campo de senha */}
                        <Text style={styles.inputLabel}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Crie uma senha"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>

                {/* Adicionando outra imagem abaixo do link */}
                <Image
                    source={require("../../../assets/audio-01.png")}
                    style={styles.additionalImage}
                    resizeMode="contain"
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#e5e7eb",
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        backgroundColor:'#ffffff',
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        padding: 15,
        width: 68,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    logo: {
        width: 230,
        height: 220,
        marginTop: -100,
    },
    container: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "#3B82F6",
    },
    containerForm: {
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
        alignSelf: 'flex-start',
    },
    input: {
        width: '100%',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#3B82F6',
        borderRadius: 8,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#0056b3',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    additionalImage: {
        width: 240,
        height: 160,
        marginBottom: 32,
    },
});
