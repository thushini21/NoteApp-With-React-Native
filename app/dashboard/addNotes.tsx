import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";

export default function AddNotes() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);

  const handleAddNote = () => {
    if (note.trim()) {
      setNotes([...notes, note]);
      setNote("");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Add Note</Text>
      <TextInput
        placeholder="Enter your note"
        value={note}
        onChangeText={setNote}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }}
      />
      <Button title="Add Note" onPress={handleAddNote} />
      <Text style={{ fontSize: 20, marginTop: 24 }}>Your Notes:</Text>
      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}
