import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, Button, Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import { NotesContext } from "../../context/NotesContext";

export default function EditNotes() {
  const router = useRouter();
  const { noteIndex, noteText, noteColor, noteTitle } = useLocalSearchParams();
  const { updateNote } = useContext(NotesContext);
  const [title, setTitle] = useState(
    typeof noteTitle === "string" ? noteTitle : Array.isArray(noteTitle) ? noteTitle[0] : ""
  );
  const [note, setNote] = useState(
    typeof noteText === "string" ? noteText : Array.isArray(noteText) ? noteText[0] : ""
  );
  const [color, setColor] = useState(
    typeof noteColor === "string" ? noteColor : Array.isArray(noteColor) ? noteColor[0] : ""
  );

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Note title cannot be empty");
      return;
    }
    if (!note.trim()) {
      Alert.alert("Error", "Note text cannot be empty");
      return;
    }
    try {
      await updateNote(noteIndex as string, note, undefined, color, title);
      router.replace("/dashboard/addNotes");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Edit Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your note"
        value={note}
        onChangeText={setNote}
      />
      <TextInput
        style={styles.input}
        placeholder="Color (e.g. red)"
        value={color}
        onChangeText={setColor}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    width: '100%',
    paddingHorizontal: width > 600 ? 48 : 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: width > 600 ? 28 : 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1976d2',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#222',
    width: '100%',
    maxWidth: 400,
  },
});
