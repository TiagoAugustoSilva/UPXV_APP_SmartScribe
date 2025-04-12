import { View, Pressable, Text, StyleSheet, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

export function Header() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleMenuPress = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        setIsMenuOpen(false);
        router.push(`/${option}`);
    };

    return (
        <View style={styles.header}>
            <View style={styles.menuContainer}>
                <Pressable style={styles.menuButton} onPress={handleMenuPress}>
                    <Ionicons name="menu" size={20} color="#121212" />
                </Pressable>

                {isMenuOpen && (
                    <View style={styles.menuDropdown}>
                        {['historico', 'configuracoes', 'transcricoes'].map(option => (
                            <Pressable
                                key={option}
                                style={[styles.menuOption, selectedOption === option && styles.selectedOption]}
                                onPress={() => handleOptionSelect(option)}
                            >
                                <Text style={styles.optionText}>
                                    {option === "historico" ? "Histórico de Gravações" : 
                                     option === "configuracoes" ? "Configurações" : "Transcrições"}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.locationContainer}>
                <Text style={styles.locationText}>Localização</Text>
                <View style={styles.locationRow}>
                    <Feather name="map-pin" size={14} color="#FF0000" />
                    <Text style={styles.location}>Sorocaba - SP</Text>
                </View>
            </View>

            <Pressable style={styles.notificationButton}>
                <Feather name="bell" size={20} color="#121212" />
            </Pressable>

            <Pressable style={styles.exitButton} onPress={() => router.replace("/")}> 
                <Ionicons name="exit" size={24} color="#121212" />
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
        borderColor: "#fffff",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    menuContainer: {
        position: "relative",
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    menuDropdown: {
        position: "absolute",
        top: 50,
        left: 0,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        width: 200,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    menuOption: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    selectedOption: {
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
    },
    optionText: {
        fontSize: 16,
        color: "#121212",
    },
    locationContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    locationText: {
        fontSize: 12,
        color: "#121212",
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    location: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#121212",
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
    additionalImage: {
        width: 40, // Ajuste conforme necessário
        height: 40, // Ajuste conforme necessário
        marginTop: 10, // Ajuste a distância da imagem do ícone
    },
});
