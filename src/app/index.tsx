import { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Header } from "../components/header";
import Constants from "expo-constants";
import { Banner } from "../components/banner";
import { Search } from "../components";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "react-native";
import * as Animatable from "react-native-animatable";

const statusBarHeight = Constants.statusBarHeight;

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);
  const router = useRouter();

  function handleLogin() {
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Usuário ou senha inválidos!");
    }
  }

  // Função do botão Sair, levando para a tela inicial de login
  function handleExit() {
    setIsLoggedIn(false);  // Aqui você pode resetar o login, se necessário
    router.push("/"); // Navega de volta para a tela de login
  }

  if (!isLoggedIn) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <StatusBar backgroundColor="#6699ff" barStyle="light-content" />

        <Animatable.Image
          animation="flipInY"
          source={require("../assets/logo-03.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.inputLabel}></Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
          />

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

        <Link href="/(auth)/signup/page" style={styles.signupLink}>
          <Text style={styles.signupText}>Ainda não possui uma conta? Cadastre-se aqui</Text>
        </Link>

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
        <TouchableOpacity
          style={[styles.exitButton, buttonPressed && styles.exitButtonPressed]}
          onPress={() => {
            setButtonPressed(true);
            setTimeout(() => setButtonPressed(false), 200);
            router.push("/transcricoes"); // Aqui você leva para a tela de transcrições
          }}
        >
          <Text style={styles.buttonText}>Ver transcrições salvas</Text>
        </TouchableOpacity>
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
  exitButton: {
    padding: 10,
    backgroundColor: "#cccccc",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  exitButtonPressed: {
    backgroundColor: "#33cc00",
  },
});
