import { useState, useContext } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { login } from "../../services/authService";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      setUser(res.user);
      router.replace("../dashboard/notes");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Password</Text>
      <TextInput secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => router.push("../register")} />
    </View>
  );
}
