import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Alert, Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NotesContext } from "../../context/NotesContext";
import { useTheme } from "../../context/ThemeContext";

// NoteCard component to avoid hooks in renderItem
const DeletedNoteCard = ({ item, theme, themeColors, onRestore, onPress }: any) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={theme === 'dark' ? ['#3a2a2a', '#2a1a1a'] : ['#fff5f5', '#ffeaea']}
        style={styles.noteCard}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.noteContent}
        >
          <View style={styles.noteHeader}>
            <View style={styles.noteTitleSection}>
              <Text style={[styles.noteTitle, { color: themeColors.textPrimary }]}>
                🗑️ {item.title}
              </Text>
              {item.category && (
                <LinearGradient
                  colors={['#f44336', '#d32f2f']}
                  style={styles.categoryBadge}
                >
                  <Text style={styles.categoryText}>{item.category}</Text>
                </LinearGradient>
              )}
            </View>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={() => onRestore(item.id)}
            >
              <LinearGradient
                colors={['#4caf50', '#388e3c']}
                style={styles.actionButton}
              >
                <MaterialIcons name="restore" size={20} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {item.text && (
            <Text style={[styles.noteText, { color: themeColors.textSecondary }]} numberOfLines={3}>
              {item.text}
            </Text>
          )}
          
          {item.file && (
            <View style={styles.fileContainer}>
              <MaterialIcons name="picture-as-pdf" size={16} color="#ff9800" />
              <Text style={[styles.fileName, { color: themeColors.textSecondary }]}>
                {item.file.name || 'PDF File'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

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
    <LinearGradient
      colors={theme === 'dark' ? ['#2a2a2a', '#1a1a1a'] : ['#e3f2fd', '#ffffff']}
      style={styles.root}
    >
      {/* Header */}
      <LinearGradient
        colors={theme === 'dark' ? ['#3a3a3a', '#2a2a2a'] : ['#f44336', '#d32f2f']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/profile')}
        >
          <MaterialIcons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🗑️ Recycle Bin</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {deletedNotes.length === 0 ? (
          <LinearGradient
            colors={theme === 'dark' ? ['#3a3a3a', '#2a2a2a'] : ['#ffffff', '#f8f9fa']}
            style={styles.emptyContainer}
          >
            <MaterialIcons name="delete" size={80} color={themeColors.textMuted} />
            <Text style={[styles.emptyText, { color: themeColors.textPrimary }]}>Recycle Bin is Empty</Text>
            <Text style={[styles.emptySubText, { color: themeColors.textMuted }]}>
              Deleted notes will appear here
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.notesContainer}>
            {deletedNotes.map((item: any) => (
              <DeletedNoteCard
                key={item.id}
                item={item}
                theme={theme}
                themeColors={themeColors}
                onRestore={handleRestoreNote}
                onPress={() => router.push({ 
                  pathname: '/dashboard/noteDetails', 
                  params: { 
                    noteTitle: item.title, 
                    noteText: item.text, 
                    noteColor: item.color, 
                    noteFileUri: item.file?.uri || '', 
                    noteFileName: item.file?.name || '' 
                  } 
                })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 10,
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notesContainer: {
    paddingBottom: 30,
  },
  noteCard: {
    marginBottom: 16,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.2)',
  },
  noteContent: {
    padding: 16,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  restoreButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,152,0,0.1)',
    padding: 8,
    borderRadius: 8,
  },
  fileName: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    marginTop: 50,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
