import { useEffect, useContext } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import { View, Text, ActivityIndicator } from "react-native";

export default function Index() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if(user) router.replace("../notes");
    else router.replace("/login");
  }, [user]);

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <ActivityIndicator size="large"/>
      <Text>Loading...</Text>
    </View>
  );
}
