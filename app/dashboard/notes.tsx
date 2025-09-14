import { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { getNotes, deleteNote } from "../../services/taskService";
import { Note } from "../../types/note";
import { useRouter } from "expo-router";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  const fetchNotes = async () => {
    const data = await getNotes();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    fetchNotes();
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Add Note" onPress={() => router.push("../addNote")} />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>{item.content}</Text>
            <Button title="Edit" onPress={() => router.push({ pathname: "../editNote", params: { id: item.id } })} />
            <Button title="Delete" onPress={() => handleDelete(item.id!)} />
          </View>
        )}
      />
    </View>
  );
}
