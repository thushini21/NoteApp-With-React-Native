import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, Button, Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NotesContext } from "../../context/NotesContext";
// const styles = StyleSheet.create({
//   navBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingVertical: 12,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderColor: '#eee',
//     marginTop: 16,
//   },
//   navButton: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   navText: {
//     fontSize: 14,
//     color: '#007bff',
//     marginTop: 4,
//   },
// });


export default function AddNotes() {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("All notes");
  const [file, setFile] = useState<{ uri: string, name: string }|null>(null);
  const [image, setImage] = useState<{ uri: string, name: string }|null>(null);
  const { notes, addNote, deleteNote } = useContext(NotesContext);
  const router = useRouter();

  const categories = ["All notes", "Personal", "Work", "Others"];

  const handleAddNote = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Note title cannot be empty");
      return;
    }
    if (!note.trim() && !file && !image) {
      Alert.alert("Error", "Note must contain text, file, or image.");
      return;
    }
    try {
      let fileToStore = file ? { name: file.name, uri: file.uri } : undefined;
      let imageToStore = image ? image.uri : undefined;
      if (fileToStore) {
        Alert.alert('Note', 'Files are only available on this device. They will not sync across devices.');
      }
      if (imageToStore) {
        Alert.alert('Note', 'Images are only available on this device. They will not sync across devices.');
      }
      await addNote(note, "", color, title, imageToStore, fileToStore, category);
      setTitle("");
      setNote("");
      setColor("");
      setCategory("All notes");
      setFile(null);
      setImage(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add note";
      Alert.alert("Error", message);
    }
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: async () => await deleteNote(id), style: "destructive" }
      ]
    );
  };

  const handleEditNote = (id: string, text: string) => {
    const noteObj = notes.find(n => n.id === id);
    router.push({ pathname: "/dashboard/editNotes", params: {
      noteIndex: id,
      noteText: noteObj?.text ?? "",
      noteTitle: noteObj?.title ?? "",
      noteColor: noteObj?.color ?? ""
    }});
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Add Note</Text>
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
      
      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Category:</Text>
        <View style={styles.categoryButtons}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.selectedCategoryButton
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[
                styles.categoryButtonText,
                category === cat && styles.selectedCategoryButtonText
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.fileRow}>
        <Button title="Pick File" onPress={async () => {
          const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf'], multiple: false });
          if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            if (asset.mimeType === 'application/pdf') {
              setFile({ uri: asset.uri, name: asset.name ?? 'file' });
            } else {
              Alert.alert('Unsupported file', 'Only PDF files are allowed.');
            }
          }
        }} />
        <View style={{ width: 12 }} />
        <Button title="Pick Image" onPress={async () => {
          const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
          if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            setImage({ uri: asset.uri, name: asset.fileName ?? 'image' });
          }
        }} />
      </View>
      {file && (
        <View style={styles.fileInfo}>
          <Text>File Selected: {file.name}</Text>
        </View>
      )}
      {image && (
        <View style={styles.fileInfo}>
          <Text>Image Selected: {image.name}</Text>
        </View>
      )}
      <Button title="Add Note" onPress={handleAddNote} />
  <Text style={styles.subtitle}>Your Notes:</Text>
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.noteRow, { backgroundColor: item.color || '#fff' }]}> 
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              {item.file ? (
                <TouchableOpacity onPress={() => router.push({ pathname: '/dashboard/noteDetails', params: { noteTitle: item.title, noteText: item.text, noteColor: item.color, noteFileUri: item.file && item.file.uri ? item.file.uri : '', noteFileName: item.file && item.file.name ? item.file.name : '' } })}>
                  <Text style={styles.fileLink}>PDF Note: {item.file && item.file.name ? item.file.name : 'Open file'}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noteText}>Text Note: {item.text}</Text>
              )}
            </View>
            <View style={styles.noteActions}>
              <TouchableOpacity onPress={() => handleEditNote(item.id, item.text)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/home')}>
          <MaterialIcons name="home" size={28} color="#007bff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/dashboard/addNotes')}>
          <MaterialIcons name="note-add" size={28} color="#007bff" />
          <Text style={styles.navText}>Add Note</Text>
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
  fileRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  fileInfo: {
    marginBottom: 12,
  },
  subtitle: {
    fontSize: width > 600 ? 22 : 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#1976d2',
  },
  noteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 48,
    marginBottom: 4,
    borderRadius: 8,
    gap: 8,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
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
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 12,
  },
  edit: {
    color: '#1976d2',
    marginRight: 16,
    fontWeight: 'bold',
  },
  delete: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#90caf9',
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
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
});
