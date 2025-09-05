// navigation/MainNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import NotesListScreen from "../screens/NotesListScreen";
import AddNoteScreen from "../screens/AddNoteScreen";

export type RootStackParamList = {
  Login: undefined;
  NotesList: undefined;
  AddNote: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotesList" component={NotesListScreen} options={{ title: "Notes" }} />
        <Stack.Screen name="AddNote" component={AddNoteScreen} options={{ title: "Add Note" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
