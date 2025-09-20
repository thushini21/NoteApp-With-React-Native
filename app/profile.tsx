import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState, useState as useStateReact } from "react";
import { Alert, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { NotesContext } from '../context/NotesContext';

export default function Profile() {
  const [currentTime, setCurrentTime] = useStateReact(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const { user, logout } = useContext(AuthContext) as AuthContextType;
  const { deletedNotes, restoreNote, fetchDeletedNotes } = useContext(NotesContext);
  const router = useRouter();
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  // Extract username from email (before @)
  const username = user?.email ? user.email.split('@')[0] : '';

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleShowRecycleBin = async () => {
    await fetchDeletedNotes();
    setShowRecycleBin(true);
  };

  const handleHideRecycleBin = () => {
    setShowRecycleBin(false);
  };

  const handleRestoreNote = async (id: string) => {
    await restoreNote(id);
    // Ensure recycle bin stays open and button is visible after restore
    await fetchDeletedNotes();
    setShowRecycleBin(true);
  };

  return (
    <ImageBackground
      source={require("../app/pics/logo.jpg")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.25 }}
    >
      <View style={styles.rootOverlay}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <Image
            source={require("../app/pics/logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
          <View style={{ height: 16 }} />
          {showRecycleBin ? (
            <View style={styles.deletedBox}>
              <Text style={styles.deletedTitle}>Deleted Notes</Text>
              {deletedNotes.length === 0 ? (
                <Text style={styles.deletedEmpty}>No deleted notes.</Text>
              ) : (
                [...deletedNotes].reverse().map(note => (
                  <View key={note.id} style={styles.deletedNote}>
                    <Text style={styles.deletedNoteTitle}>{note.title || 'Untitled'}</Text>
                    <Text style={styles.deletedNoteText}>{note.text || '[No text]'}</Text>
                    {note.file && (
                      <Text style={styles.deletedNoteFile}>File: {note.file.name}</Text>
                    )}
                    <TouchableOpacity style={styles.restoreBtn} onPress={() => handleRestoreNote(note.id)}>
                      <Text style={styles.restoreText}>Restore</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
              <TouchableOpacity style={styles.backBtn} onPress={handleHideRecycleBin}>
                <Text style={styles.backText}>Back to Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Username:</Text>
                <Text style={styles.value}>{username}</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user?.email}</Text>
              </View>
              <TouchableOpacity style={styles.recycleBtn} onPress={handleShowRecycleBin}>
                <Text style={styles.recycleText}>Recycle Bin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  logo: {
    width: width > 600 ? 160 : 120,
    height: width > 600 ? 160 : 120,
    marginBottom: 12,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#1976d2',
    backgroundColor: '#fff',
    alignSelf: 'center',
    // Add shadow for iOS
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Add elevation for Android
    elevation: 8,
  },
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rootOverlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width > 600 ? 48 : 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  title: {
    fontSize: width > 600 ? 28 : 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976d2',
    textAlign: 'center',
  },
  time: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: width > 600 ? 24 : 16,
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
  },
  recycleBtn: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 12,
  },
  recycleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#ff5252',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deletedBox: {
    width: '100%',
    alignItems: 'center',
  },
  deletedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1976d2',
    textAlign: 'center',
  },
  deletedEmpty: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  deletedNote: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  deletedNoteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deletedNoteText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  deletedNoteFile: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  restoreBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  restoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backBtn: {
    backgroundColor: '#888',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: 16,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

