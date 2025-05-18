import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext"; // Importa o contexto de tema

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { theme } = useTheme(); // Usa o tema do contexto

  const handleMenuPress = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsMenuOpen(false);
    router.push(`/${option}`);
  };

  const handleExitPress = () => {
    router.replace("/login"); // Corrigido para usar replace, garantindo que o histórico seja substituído
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <View style={styles.menuContainer}>
        <Pressable style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={20} color={theme.text} />
        </Pressable>

        {isMenuOpen && (
          <View style={[styles.menuDropdown, { backgroundColor: theme.background, borderColor: theme.border }]}>
            {["transcricoes", "configuracoes"].map((option) => (
              <Pressable
                key={option}
                style={[styles.menuOption, selectedOption === option && styles.selectedOption]}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={[styles.optionText, { color: theme.text }]}>
                  {option === "configuracoes" ? "Configurações" : "Transcrições"}
                </Text>
              </Pressable>
            ))}
          </View>

        )}
      </View>

      <View style={styles.locationContainer}>
        <Text style={[styles.locationText, { color: theme.text }]}>Localização</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color="#FF0000" />
          <Text style={[styles.location, { color: theme.text }]}>Sorocaba - SP</Text>
        </View>
      </View>

      <Pressable style={styles.notificationButton}>
        <Feather name="bell" size={20} color= "#cc0000"/>
      </Pressable>

      <Pressable style={styles.exitButton} onPress={() => router.replace("/")}>
        <Ionicons name="exit" size={24} color="#cc0000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: 15,
  },
  menuContainer: {
    position: "relative",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  menuDropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: 200,
    borderWidth: 1,
  },
  menuOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectedOption: {
    backgroundColor: "#009999",
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  exitButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
