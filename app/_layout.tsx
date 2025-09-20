import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { NotesProvider } from "../context/NotesContext";
import StatusBarInfo from "./components/StatusBarInfo";

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotesProvider>
        <StatusBarInfo />
        <Stack screenOptions={{ headerShown: false }} />
      </NotesProvider>
    </AuthProvider>
  );
}
