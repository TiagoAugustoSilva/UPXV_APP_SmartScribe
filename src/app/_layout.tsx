import '../styles/global.css';
import { Slot, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Slot />
      <Stack.Screen name="index" options={{headerShown: false}} />

    
      <Stack.Screen name="(auth)/signup/page" options={{headerShown: false}} />
    </Stack>
  );
}
