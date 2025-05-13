// components/Configuracoes.tsx
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../components/context/ThemeContext"; // Importa o contexto de tema

export default function Configuracoes() {
  const { theme, toggleTheme } = useTheme(); // Usa o tema do contexto

  const toggleLanguage = () => {
    Alert.alert("Idioma", `Idioma alternado.`);
    // Lógica para alternar o idioma pode ser implementada aqui
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Configurações</Text>

      <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
        <Text style={[styles.settingText, { color: theme.text }]}>Predefinições tema</Text>
        <Switch
          value={theme.name === "light"} // Verifica o tema atual
          onValueChange={toggleTheme} // Alterna o tema
        />
      </View>

      <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]} onPress={toggleLanguage}>
        <Text style={[styles.settingText, { color: theme.text }]}>
          Idioma: {theme.name === "light" ? "Português" : "Português"}
        </Text>
        <Feather name="globe" size={20} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
  },
});
