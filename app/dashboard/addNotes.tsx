// note add karanna
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    <LinearGradient
      colors={theme === 'dark' ? ['#2a2a2a', '#1a1a1a'] : ['#e3f2fd', '#ffffff']}
      style={styles.root}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={theme === 'dark' ? ['#3a3a3a', '#2a2a2a'] : ['#1976d2', '#0d47a1']}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.push('/home')}
          >
            <MaterialIcons name="arrow-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Note</Text>
          <View style={styles.placeholder} />
        </LinearGradient>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Title Input */}
          <LinearGradient
            colors={theme === 'dark' ? ['#3a3a3a', '#2a2a2a'] : ['#ffffff', '#f8f9fa']}
            style={styles.inputContainer}
          >
            <Text style={[styles.inputLabel, { color: themeColors.textPrimary }]}>📝 Title</Text>
            <TextInput
              style={[styles.titleInput, { color: themeColors.textPrimary }]}
              placeholder="Enter note title..."
              placeholderTextColor={themeColors.textMuted}
              value={title}
              onChangeText={setTitle}
            />
          </LinearGradient>

          {/* Note Content */}
          <LinearGradient
            colors={theme === 'dark' ? ['#3a3a3a', '#2a2a2a'] : ['#ffffff', '#f8f9fa']}
            style={styles.inputContainer}
          >
            <Text style={[styles.inputLabel, { color: themeColors.textPrimary }]}>✍️ Content</Text>
            <TextInput
              style={[styles.noteInput, { color: themeColors.textPrimary }]}
              placeholder="Write your note here..."
              placeholderTextColor={themeColors.textMuted}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </LinearGradient>

          {/* Category Selection */}
          <LinearGradient
            colors={theme === 'dark' ? ['#3a3a3a', '#2a2a2a'] : ['#ffffff', '#f8f9fa']}
            style={styles.inputContainer}
          >
            <Text style={[styles.inputLabel, { color: themeColors.textPrimary }]}>📁 Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.selectedCategory
                  ]}
                >
                  <LinearGradient
                    colors={category === cat 
                      ? ['#1976d2', '#0d47a1'] 
                      : [themeColors.cardBackground, themeColors.cardBackground]
                    }
                    style={styles.categoryGradient}
                  >
                    <Text style={[
                      styles.categoryText,
                      { color: category === cat ? '#ffffff' : themeColors.textSecondary }
                    ]}>
                      {cat}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </LinearGradient>

          {/* Attachments */}
          <LinearGradient
            colors={theme === 'dark' ? ['#3a3a3a', '#2a2a2a'] : ['#ffffff', '#f8f9fa']}
            style={styles.inputContainer}
          >
            <Text style={[styles.inputLabel, { color: themeColors.textPrimary }]}>📎 Attachments</Text>
            
            <View style={styles.attachmentButtons}>
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={async () => {
                  const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf'], multiple: false });
                  if (!result.canceled && result.assets && result.assets.length > 0) {
                    const asset = result.assets[0];
                    if (asset.mimeType === 'application/pdf') {
                      setFile({ uri: asset.uri, name: asset.name ?? 'file' });
                    } else {
                      Alert.alert('Unsupported file', 'Only PDF files are allowed.');
                    }
                  }
                }}
              >
                <LinearGradient
                  colors={['#ff9800', '#f57c00']}
                  style={styles.buttonGradient}
                >
                  <MaterialIcons name="picture-as-pdf" size={24} color="#ffffff" />
                  <Text style={styles.buttonText}>PDF File</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({ 
                    mediaTypes: ImagePicker.MediaTypeOptions.Images, 
                    quality: 0.7 
                  });
                  if (!result.canceled && result.assets && result.assets.length > 0) {
                    const asset = result.assets[0];
                    setImage({ uri: asset.uri, name: asset.fileName ?? 'image' });
                  }
                }}
              >
                <LinearGradient
                  colors={['#4caf50', '#388e3c']}
                  style={styles.buttonGradient}
                >
                  <MaterialIcons name="image" size={24} color="#ffffff" />
                  <Text style={styles.buttonText}>Image</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* File Preview */}
            {file && (
              <View style={styles.filePreview}>
                <MaterialIcons name="picture-as-pdf" size={20} color="#ff9800" />
                <Text style={[styles.fileName, { color: themeColors.textSecondary }]}>{file.name}</Text>
                <TouchableOpacity onPress={() => setFile(null)}>
                  <MaterialIcons name="close" size={20} color="#d32f2f" />
                </TouchableOpacity>
              </View>
            )}

            {image && (
              <View style={styles.filePreview}>
                <MaterialIcons name="image" size={20} color="#4caf50" />
                <Text style={[styles.fileName, { color: themeColors.textSecondary }]}>{image.name}</Text>
                <TouchableOpacity onPress={() => setImage(null)}>
                  <MaterialIcons name="close" size={20} color="#d32f2f" />
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>

          {/* Add Note Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
            <LinearGradient
              colors={['#1976d2', '#0d47a1']}
              style={styles.addButtonGradient}
            >
              <MaterialIcons name="add" size={24} color="#ffffff" />
              <Text style={styles.addButtonText}>Create Note</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );



}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 10,
    borderRadius: 0,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(25,118,210,0.2)',
  },
  noteInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(25,118,210,0.2)',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryChip: {
    marginRight: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedCategory: {
    // Used for conditional styling
  },
  categoryGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  attachmentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  attachmentButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(25,118,210,0.2)',
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  addButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Legacy styles (keeping for compatibility)
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
