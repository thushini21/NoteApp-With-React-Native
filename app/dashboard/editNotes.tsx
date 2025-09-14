import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function EditNotes() {
  const router = useRouter();
  const { noteIndex, noteText } = useLocalSearchParams();
  const [note, setNote] = useState(
    typeof noteText === "string" ? noteText : Array.isArray(noteText) ? noteText[0] : ""
  );

  const handleSave = () => {
    // You would update the note in your notes list here (using context, redux, or navigation params)
    // For now, just go back
    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Edit Note</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}
