import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, Button, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NotesContext } from "../../context/NotesContext";
import { useTheme } from "../../context/ThemeContext";

export default function EditNotes() {
  const router = useRouter();
  const { noteIndex, noteText, noteColor, noteTitle, noteCategory } = useLocalSearchParams();
  const { updateNote } = useContext(NotesContext);
  const { theme, themeColors } = useTheme();
  const [title, setTitle] = useState(
    typeof noteTitle === "string" ? noteTitle : Array.isArray(noteTitle) ? noteTitle[0] : ""
  );
  const [note, setNote] = useState(
    typeof noteText === "string" ? noteText : Array.isArray(noteText) ? noteText[0] : ""
  );
  const [category, setCategory] = useState(
    typeof noteCategory === "string" ? noteCategory : Array.isArray(noteCategory) ? noteCategory[0] : "All notes"
  );

  const defaultColor = "#f0e68c"; // Khaki color

  const categories = ["All notes", "Personal", "Work", "Others"];

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
      await updateNote(noteIndex as string, note, undefined, defaultColor, title, category);
      router.replace("/home");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>Edit Note</Text>
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
      <Text style={styles.categoryTitle}>Category:</Text>
      <View style={styles.categoryContainer}>
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
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1976d2',
    alignSelf: 'flex-start',
    width: '100%',
    maxWidth: 400,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#90caf9',
    backgroundColor: '#f8f9fa',
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
});
