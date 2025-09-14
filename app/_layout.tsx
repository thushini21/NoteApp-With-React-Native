import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { NotesProvider } from "../context/NotesContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotesProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </NotesProvider>
    </AuthProvider>
  );
}
