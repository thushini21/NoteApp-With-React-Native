// mulin app eka idan patan gannawa
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  // Redirect based on authentication status
  useEffect(() => {
    if(!loading) {
      if(!user) router.replace("/(auth)/login");
      else router.replace("/dashboard/addNotes");
    }
  }, [user, loading, router]);

  return (
    <View style={styles.root}>
      <ActivityIndicator size="large"/>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width > 600 ? 48 : 16,
  },
  loadingText: {
    fontSize: width > 600 ? 22 : 16,
    marginTop: 16,
    color: '#1976d2',
    textAlign: 'center',
  },
});
