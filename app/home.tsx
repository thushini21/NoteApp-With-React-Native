import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { Alert, Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NotesContext } from "../context/NotesContext";

export default function Home() {
  const { notes, deleteNote } = useContext(NotesContext);
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All notes");

  const categories = ["All notes", "Personal", "Work", "Others"];

  const handleEditNote = (id: string, text: string) => {
    router.push({ pathname: "/dashboard/editNotes", params: { noteIndex: id, noteText: text } });
  };

  const handleAddNote = () => {
    router.push("/dashboard/addNotes");
  };

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${noteTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteNote(noteId)
        }
      ]
    );
  };

  // Filter notes by search text and category
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title?.toLowerCase().includes(search.toLowerCase()) || note.text.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All notes" || note.category === selectedCategory || (!note.category && selectedCategory === "All notes");
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Your Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Search notes..."
        value={search}
        onChangeText={setSearch}
      />
      
      {/* Category Filter Buttons */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Categories:</Text>
        <View style={styles.categoryButtons}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryButtonText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.noteBox, { backgroundColor: item.color || '#fff' }] }>
            <View style={styles.noteHeader}>
              <View style={styles.noteTitleSection}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                {item.category && (
                  <Text style={styles.noteCategory}>📁 {item.category}</Text>
                )}
              </View>
              <View style={styles.noteActions}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => router.push({
                    pathname: '/dashboard/editNotes',
                    params: {
                      noteIndex: item.id || '',
                      noteTitle: item.title || '',
                      noteText: item.text || '',
                      noteColor: item.color || '#fff',
                      noteCategory: item.category || 'All notes'
                    }
                  })}
                >
                  <MaterialIcons name="edit" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteNote(item.id || '', item.title || '')}
                >
                  <MaterialIcons name="delete" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/dashboard/noteDetails', params: { noteTitle: item.title, noteText: item.text, noteColor: item.color, noteFileUri: item.file && item.file.uri ? item.file.uri : '', noteFileName: item.file && item.file.name ? item.file.name : '' } })}>
              {item.file ? (
                <Text style={styles.fileLink}>PDF: {item.file && item.file.name ? item.file.name : 'Open file'}</Text>
              ) : null}
              {item.text ? (
                <Text style={styles.noteText}>{item.text}</Text>
              ) : item.file ? (
                <Text style={styles.noteText}>[File note]</Text>
              ) : null}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notes found.</Text>}
      />
      
      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.floatingAddButton} 
        onPress={handleAddNote}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/home')}>
          <MaterialIcons name="home" size={28} color="#007bff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/profile')}>
          <MaterialIcons name="person" size={28} color="#007bff" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
  },
  noteBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: '100%',
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    width: '100%',
  },
  noteText: {
    fontSize: 15,
    color: '#333',
    flexWrap: 'wrap',
    marginRight: 8,
  },
  fileLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  noteCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  categoryContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategoryButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    marginTop: 16,
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 4,
  },
  floatingAddButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitleSection: {
    flex: 1,
    marginRight: 8,
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 4,
    borderRadius: 6,
    backgroundColor: '#e8f4fd',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#ffebee',
  },
});

// ...existing code...
