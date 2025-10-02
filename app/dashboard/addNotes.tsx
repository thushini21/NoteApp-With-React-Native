// note add karanna
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Button, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NotesContext } from "../../context/NotesContext";
import { useTheme } from "../../context/ThemeContext";
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
  const [category, setCategory] = useState("All notes");
  const [file, setFile] = useState<{ uri: string, name: string }|null>(null);
  const [image, setImage] = useState<{ uri: string, name: string }|null>(null);
  const { addNote } = useContext(NotesContext);
  const { theme, themeColors } = useTheme();
  const router = useRouter();

  const defaultColor = "#f0e68c"; // Khaki color

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
      await addNote(note, "", defaultColor, title, imageToStore, fileToStore, category);
      setTitle("");
      setNote("");
      setCategory("All notes");
      setFile(null);
      setImage(null);
      router.replace("/home"); // Redirect to home page after adding note
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add note";
      Alert.alert("Error", message);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/home')}
        >
          <MaterialIcons name="arrow-back" size={28} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Add Note</Text>
      </View>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: themeColors.cardBackground, 
          borderColor: themeColors.border, 
          color: themeColors.textPrimary 
        }]}
        placeholder="Title"
        placeholderTextColor={themeColors.textMuted}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { 
          backgroundColor: themeColors.cardBackground, 
          borderColor: themeColors.border, 
          color: themeColors.textPrimary 
        }]}
        placeholder="Enter your note"
        placeholderTextColor={themeColors.textMuted}
        value={note}
        onChangeText={setNote}
      />
      
      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        <Text style={[styles.categoryLabel, { color: themeColors.textSecondary }]}>Category:</Text>
        <View style={styles.categoryButtons}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
                category === cat && styles.selectedCategoryButton
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[
                styles.categoryButtonText,
                { color: themeColors.textSecondary },
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: width > 600 ? 28 : 22,
    fontWeight: 'bold',
    color: '#1976d2',
    flex: 1,
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
});
