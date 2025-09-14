import { useContext, useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if(!loading) {
  if(!user) router.replace("/(auth)/login");
      else router.replace("/dashboard/addNotes");
    }
  }, [user, loading]);

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <ActivityIndicator size="large"/>
      <Text>Loading...</Text>
    </View>
  );
}
