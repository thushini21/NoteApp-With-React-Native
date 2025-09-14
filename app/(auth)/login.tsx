import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { auth } from "../../firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard/notes");
    } catch(err:any) {
      Alert.alert("Login Error", err.message);
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Don't have an account? Register" onPress={() => router.push('/(auth)/register')} />
    </View>
  );
}
