import '../styles/global.css';
import { Slot, Stack } from "expo-router";
import { ThemeProvider } from "../components/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons"; // ou Feather, MaterialIcons etc.

import { Buffer } from 'buffer';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Slot />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup/page" options={{ headerShown: false }} />

        {/* Tela de Transcrições com ícone */}
        <Stack.Screen
          name="transcricoes"
          options={{
            headerTitle: () => (
              <Ionicons name="document-text-outline" size={24} color="black" />
            ),
          }}
        />

        {/* Tela de Configurações com ícone */}
        <Stack.Screen
          name="configuracoes"
          options={{
            headerTitle: () => (
              <Ionicons name="settings-outline" size={24} color="black" />
            ),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
