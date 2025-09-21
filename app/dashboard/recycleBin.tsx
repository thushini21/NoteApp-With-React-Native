import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Alert, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NotesContext } from "../../context/NotesContext";
import { useTheme } from "../../context/ThemeContext";

export default function RecycleBin() {
  const { deletedNotes, restoreNote, fetchDeletedNotes } = useContext(NotesContext);
  const { theme, themeColors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    fetchDeletedNotes();
  }, []);

  const handleRestoreNote = (id: string) => {
    Alert.alert(
      "Restore Note",
      "Are you sure you want to restore this note?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Restore", onPress: async () => await restoreNote(id) }
      ]
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: themeColors.background }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/profile')}
        >
          <MaterialIcons name="arrow-back" size={28} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Recycle Bin</Text>
      </View>
      
      <FlatList
        data={deletedNotes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.noteBox, { 
            backgroundColor: theme === 'dark' ? '#333' : (item.color || '#f0e68c'),
            borderColor: themeColors.border 
          }]}>
            <View style={styles.noteHeader}>
              <View style={styles.noteTitleSection}>
                <Text style={[styles.noteTitle, { color: themeColors.textPrimary }]}>{item.title}</Text>
                {item.category && (
                  <Text style={[styles.noteCategory, { color: themeColors.textSecondary }]}>📁 {item.category}</Text>
                )}
              </View>
              {/* Restore Button */}
              <TouchableOpacity 
                style={styles.restoreButton} 
                onPress={() => handleRestoreNote(item.id)}
              >
                <MaterialIcons name="restore" size={24} color="#4caf50" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/dashboard/noteDetails', params: { noteTitle: item.title, noteText: item.text, noteColor: item.color, noteFileUri: item.file && item.file.uri ? item.file.uri : '', noteFileName: item.file && item.file.name ? item.file.name : '' } })}>
              {item.file ? (
                <Text style={[styles.fileLink, { color: themeColors.textSecondary }]}>PDF: {item.file && item.file.name ? item.file.name : 'Open file'}</Text>
              ) : null}
              {item.text ? (
                <Text style={[styles.noteText, { color: themeColors.textSecondary }]}>{item.text}</Text>
              ) : item.file ? (
                <Text style={[styles.noteText, { color: themeColors.textSecondary }]}>[File note]</Text>
              ) : null}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="delete" size={64} color={themeColors.textMuted} />
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>No deleted notes</Text>
            <Text style={[styles.emptySubText, { color: themeColors.textMuted }]}>
              Deleted notes will appear here
            </Text>
          </View>
        }
      />
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
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    width: '100%',
  },
  noteCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
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
  restoreButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
