import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { NotesContext } from '../context/NotesContext';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const { user, logout } = useContext(AuthContext) as AuthContextType;
  const { deletedNotes, restoreNote, fetchDeletedNotes, archivedNotes, unarchiveNote, fetchArchivedNotes } = useContext(NotesContext);
  const { theme, fontSize, themeColors, setTheme, setFontSize } = useTheme();
  const router = useRouter();
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  
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
    router.push('/dashboard/recycleBin');
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

  const handleShowArchive = async () => {
    router.push('/dashboard/archivedNotes');
  };

  const handleHideArchive = () => {
    setShowArchive(false);
  };

  const handleUnarchiveNote = async (id: string) => {
    await unarchiveNote(id);
    await fetchArchivedNotes();
    setShowArchive(true);
  };

  return (
    <ImageBackground
      source={require("../app/pics/logo.jpg")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: theme === 'dark' ? 0.15 : 0.25 }}
    >
      <View style={[styles.rootOverlay, { backgroundColor: themeColors.background }]}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          
          {/* Main Action Buttons - Archive & Recycle Bin */}
          <View style={styles.mainActionsContainer}>
            <TouchableOpacity style={[styles.mainActionCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]} onPress={handleShowArchive}>
              <Text style={styles.mainActionIcon}>📦</Text>
              <Text style={[styles.mainActionTitle, { color: themeColors.textPrimary }]}>Archive</Text>
              <View style={styles.mainCountBadge}>
                <Text style={styles.mainCountText}>{archivedNotes.length}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.mainActionCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]} onPress={handleShowRecycleBin}>
              <Text style={styles.mainActionIcon}>🗑️</Text>
              <Text style={[styles.mainActionTitle, { color: themeColors.textPrimary }]}>Recycle Bin</Text>
              <View style={styles.mainCountBadge}>
                <Text style={styles.mainCountText}>{deletedNotes.length}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Settings Button */}
          <TouchableOpacity style={styles.menuBtn} onPress={() => {
            setShowSettings(!showSettings);
            setShowPersonalInfo(false);
            setShowRecycleBin(false);
            setShowArchive(false);
          }}>
            <Text style={styles.menuBtnText}>⚙️ Settings</Text>
          </TouchableOpacity>
          
          {/* Personal Information Button */}
          <TouchableOpacity style={styles.menuBtn} onPress={() => {
            setShowPersonalInfo(!showPersonalInfo);
            setShowSettings(false);
            setShowRecycleBin(false);
            setShowArchive(false);
          }}>
            <Text style={styles.menuBtnText}>👤 Personal Information</Text>
          </TouchableOpacity>

          <View style={{ height: 16 }} />
          {showRecycleBin ? (
            <View style={[styles.deletedBox, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <Text style={[styles.deletedTitle, { color: themeColors.textPrimary }]}>Deleted Notes</Text>
              {deletedNotes.length === 0 ? (
                <Text style={[styles.deletedEmpty, { color: themeColors.textMuted }]}>No deleted notes.</Text>
              ) : (
                [...deletedNotes].reverse().map(note => (
                  <View key={note.id} style={[styles.deletedNote, { backgroundColor: theme === 'dark' ? '#333' : '#f8f9fa', borderColor: themeColors.border }]}>
                    <Text style={[styles.deletedNoteTitle, { color: themeColors.textPrimary }]}>{note.title || 'Untitled'}</Text>
                    <Text style={[styles.deletedNoteText, { color: themeColors.textSecondary }]}>{note.text || '[No text]'}</Text>
                    {note.file && (
                      <Text style={[styles.deletedNoteFile, { color: themeColors.textMuted }]}>File: {note.file.name}</Text>
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
          ) : showArchive ? (
            <View style={[styles.deletedBox, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <Text style={[styles.deletedTitle, { color: themeColors.textPrimary }]}>📦 Archived Notes</Text>
              {archivedNotes.length === 0 ? (
                <Text style={[styles.deletedEmpty, { color: themeColors.textMuted }]}>No archived notes.</Text>
              ) : (
                [...archivedNotes].reverse().map(note => (
                  <View key={note.id} style={[styles.deletedNote, { backgroundColor: theme === 'dark' ? '#333' : '#f8f9fa', borderColor: themeColors.border }]}>
                    <Text style={[styles.deletedNoteTitle, { color: themeColors.textPrimary }]}>{note.title || 'Untitled'}</Text>
                    <Text style={[styles.deletedNoteText, { color: themeColors.textSecondary }]}>{note.text || '[No text]'}</Text>
                    {note.file && (
                      <Text style={[styles.deletedNoteFile, { color: themeColors.textMuted }]}>File: {note.file.name}</Text>
                    )}
                    <TouchableOpacity style={styles.restoreBtn} onPress={() => handleUnarchiveNote(note.id)}>
                      <Text style={styles.restoreText}>Unarchive</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
              <TouchableOpacity style={styles.backBtn} onPress={handleHideArchive}>
                <Text style={styles.backText}>Back to Profile</Text>
              </TouchableOpacity>
            </View>
          ) : showSettings ? (
            <View style={[styles.settingsBox, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <Text style={[styles.settingsTitle, { color: themeColors.textPrimary }]}>General</Text>
              
              {/* Theme Selection */}
              <View style={styles.settingSection}>
                <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>Theme:</Text>
                <View style={styles.optionButtons}>
                  <TouchableOpacity 
                    style={[styles.optionBtn, { backgroundColor: theme === 'light' ? '#2196f3' : themeColors.cardBackground, borderColor: themeColors.border }, theme === 'light' && styles.optionBtnActive]}
                    onPress={() => setTheme('light')}
                  >
                    <Text style={[{ color: theme === 'light' ? '#fff' : themeColors.textMuted }, theme === 'light' && styles.optionTextActive]}>☀️ Light</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.optionBtn, { backgroundColor: theme === 'dark' ? '#2196f3' : themeColors.cardBackground, borderColor: themeColors.border }, theme === 'dark' && styles.optionBtnActive]}
                    onPress={() => setTheme('dark')}
                  >
                    <Text style={[{ color: theme === 'dark' ? '#fff' : themeColors.textMuted }, theme === 'dark' && styles.optionTextActive]}>🌙 Dark</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Font Size Selection */}
              <View style={styles.settingSection}>
                <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>Font Size:</Text>
                <View style={styles.optionButtons}>
                  <TouchableOpacity 
                    style={[styles.optionBtn, { backgroundColor: fontSize === 'small' ? '#2196f3' : themeColors.cardBackground, borderColor: themeColors.border }, fontSize === 'small' && styles.optionBtnActive]}
                    onPress={() => setFontSize('small')}
                  >
                    <Text style={[{ color: fontSize === 'small' ? '#fff' : themeColors.textMuted }, fontSize === 'small' && styles.optionTextActive]}>Small</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.optionBtn, { backgroundColor: fontSize === 'medium' ? '#2196f3' : themeColors.cardBackground, borderColor: themeColors.border }, fontSize === 'medium' && styles.optionBtnActive]}
                    onPress={() => setFontSize('medium')}
                  >
                    <Text style={[{ color: fontSize === 'medium' ? '#fff' : themeColors.textMuted }, fontSize === 'medium' && styles.optionTextActive]}>Medium</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.optionBtn, { backgroundColor: fontSize === 'large' ? '#2196f3' : themeColors.cardBackground, borderColor: themeColors.border }, fontSize === 'large' && styles.optionBtnActive]}
                    onPress={() => setFontSize('large')}
                  >
                    <Text style={[{ color: fontSize === 'large' ? '#fff' : themeColors.textMuted }, fontSize === 'large' && styles.optionTextActive]}>Large</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.backBtn} onPress={() => setShowSettings(false)}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            </View>
          ) : showPersonalInfo ? (
            <View style={[styles.personalInfoBox, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <Text style={[styles.personalInfoTitle, { color: themeColors.textPrimary }]}>Personal Information</Text>
              
              {/* User Information Display */}
              <View style={styles.infoSection}>
                <View style={[styles.infoRow, { backgroundColor: theme === 'dark' ? '#333' : '#f8f9fa' }]}>
                  <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Username:</Text>
                  <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>{username}</Text>
                </View>
                <View style={[styles.infoRow, { backgroundColor: theme === 'dark' ? '#333' : '#f8f9fa' }]}>
                  <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Email:</Text>
                  <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>{user?.email}</Text>
                </View>
              </View>

              {/* Reset Password Button */}
              <TouchableOpacity style={styles.resetPasswordBtn} onPress={() => {
                Alert.alert(
                  "Reset Password",
                  "Password reset functionality will be implemented here",
                  [{ text: "OK" }]
                );
              }}>
                <Text style={styles.resetPasswordText}>🔐 Reset Password</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backBtn} onPress={() => setShowPersonalInfo(false)}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
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
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 12,
  },
  recycleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  archiveBtn: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 12,
  },
  archiveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  countBadge: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#ff5252',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#ff5252',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
  belowLogoBtn: {
    backgroundColor: '#2196f3',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'center',
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  belowLogoBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  compactActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  compactActionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 80,
  },
  compactActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  compactActionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  compactCountBadge: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  settingsBtn: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 10,
    alignSelf: 'center',
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 150,
  },
  settingsBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 150,
  },
  profileBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingsBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    width: '90%',
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    width: '90%',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingSection: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionBtn: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: 4,
  },
  optionBtnActive: {
    backgroundColor: '#2196f3',
    borderColor: '#1976d2',
  },
  optionText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mainActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  mainActionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 70,
  },
  mainActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  mainActionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  mainCountBadge: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  menuBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 12,
    alignSelf: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 250,
  },
  menuBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  personalInfoBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    width: '90%',
  },
  personalInfoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  infoSection: {
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  resetPasswordBtn: {
    backgroundColor: '#ff5722',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  resetPasswordText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

