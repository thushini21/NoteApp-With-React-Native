import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Note</Text>
          <View style={styles.placeholder} />
        </LinearGradient>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Title Input */}
          <LinearGradient
            colors={theme === 'dark' ? ['#3a3a3a', '#2a2a2a'] : ['#ffffff', '#f8f9fa']}
            style={styles.inputContainer}
          >
            <Text style={[styles.inputLabel, { color: themeColors.textPrimary }]}>📝 Edit Title</Text>
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
            <Text style={[styles.inputLabel, { color: themeColors.textPrimary }]}>✍️ Edit Content</Text>
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

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={['#1976d2', '#0d47a1']}
              style={styles.saveButtonGradient}
            >
              <MaterialIcons name="save" size={24} color="#ffffff" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
  saveButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
