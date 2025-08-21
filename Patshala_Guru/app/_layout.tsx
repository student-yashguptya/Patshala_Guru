import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { UserDetailProvider } from "./../context/UserDetailContext"; // <- change this import

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Outfit': require("./../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Bold": require("./../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-Black": require("./../assets/fonts/Outfit-Black.ttf"),  
    "Outfit-ExtraBold": require("./../assets/fonts/Outfit-ExtraBold.ttf"),
    "Outfit-ExtraLight": require("./../assets/fonts/Outfit-ExtraLight.ttf"),
    "Outfit-Light": require("./../assets/fonts/Outfit-Light.ttf"),
    "Outfit-Medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-SemiBold": require("./../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Thin": require("./../assets/fonts/Outfit-Thin.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <UserDetailProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </UserDetailProvider>
  );
}
