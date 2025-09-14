import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "expo-router";


export default function Index() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if(user) router.replace("../dashboard/notes");
    else router.replace("../login");
  }, [user]);

  return null;
}
