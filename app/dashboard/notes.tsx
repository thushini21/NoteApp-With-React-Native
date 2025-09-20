import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { deleteNote, getNotes } from "../../services/taskService";
import { Note } from "../../types/note";

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
    <View style={styles.root}>
      <Button title="Add Note" onPress={() => router.push("../addNote")} />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteContent}>{item.content}</Text>
            <Button title="Edit" onPress={() => router.push({ pathname: "../editNote", params: { id: item.id } })} />
            <Button title="Delete" onPress={() => handleDelete(item.id!)} />
          </View>
        )}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    paddingHorizontal: width > 600 ? 48 : 16,
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
  },
  noteBox: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 15,
    marginBottom: 8,
    color: '#333',
  },
});
