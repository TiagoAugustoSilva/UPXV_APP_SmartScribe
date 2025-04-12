import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Header } from "../components/header";
import Constants from "expo-constants";
import { Banner } from "../components/banner";
import { Search } from "../components";
import { Link } from "expo-router";
import { StatusBar } from "react-native";
import * as Animatable from "react-native-animatable";

const statusBarHeight = Constants.statusBarHeight;

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Usuário ou senha inválidos!");
    }
  }

  function handleRegister() {
    alert("Redirecionando para tela de cadastro...");
    // Aqui você pode implementar a navegação para a tela de cadastro
  }

  if (!isLoggedIn) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar backgroundColor="#6699ff" barStyle="light-content" />

        {/* Logo do app */}
        <Animatable.Image
          animation="flipInY"
          source={require("../assets/logo-03.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
          {/* Label para Email */}
          <Text style={styles.inputLabel}></Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
          />

          {/* Label para Senha */}
          <Text style={styles.inputLabel}></Text>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </Animatable.View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>

        {/* Link para cadastro abaixo do botão "Entrar" */}
        <Link href="/(auth)/signup/page" style={styles.signupLink}>
          <Text style={styles.signupText}>Ainda não possui uma conta? Cadastre-se aqui</Text>
        </Link>

        {/* Adicionando outra imagem abaixo do link */}
        <Image
          source={require("../assets/audio-01.png")}
          style={styles.additionalImage}
          resizeMode="contain"
        />
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
    <View style={{ flex: 1, marginTop: 0 }}>
      <Banner />
      <Header />
      <Search />
    </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
  },
  logo: {
    width: 230,
    height: 220,
    marginTop: -100,
  },
  slogan: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3B82F6",
    marginTop: 24,
    fontStyle: "italic",
  },
  inputLabel: {
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 4,
    marginLeft: 0,
    textAlign: "right",
  },
  input: {
    width: 356,
    padding: 8,
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 0,
  },
  passwordInput: {
    marginBottom: 16,
  },
  containerForm: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  loginButton: {
    width: 356,
    padding: 10,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  signupLink: {
    marginTop: 16,
  },
  signupText: {
    color: "#3B82F6",
    marginBottom: 32,
  },
  additionalImage: {
    width: 240,
    height: 160,
    marginBottom: 32,
  },
});
