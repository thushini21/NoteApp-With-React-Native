import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard/notes" options={{ headerShown: true }} />
    </Stack>
  );
}
