import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Animated, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    const { theme, fontSize, themeColors, toggleTheme, setTheme, setFontSize, increaseFontSize, decreaseFontSize } = useTheme();
  const router = useRouter();
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300)); // Start off-screen
  
  // Extract username from email (before @)
  const username = user?.email ? user.email.split('@')[0] : '';

  // Side Menu Animation Functions
  const openSideMenu = () => {
    setSideMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSideMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSideMenuOpen(false));
  };

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
        {/* Hamburger Menu Button */}
        <TouchableOpacity 
          style={styles.hamburgerButton} 
          onPress={openSideMenu}
        >
          <MaterialIcons name="menu" size={28} color={themeColors.textPrimary} />
        </TouchableOpacity>

        {/* Side Menu Overlay */}
        {sideMenuOpen && (
          <TouchableOpacity 
            style={styles.overlay} 
            activeOpacity={1} 
            onPress={closeSideMenu}
          >
            <View />
          </TouchableOpacity>
        )}

        {/* Side Menu */}
        <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.sideMenuHeader}>
            <TouchableOpacity onPress={closeSideMenu} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={themeColors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.sideMenuTitle, { color: themeColors.textPrimary }]}>Menu</Text>
          </View>
          
          <View style={styles.sideMenuContent}>
            <TouchableOpacity 
              style={[styles.sideMenuItem, { backgroundColor: themeColors.cardBackground }]} 
              onPress={() => {
                closeSideMenu();
                router.push('/home');
              }}
            >
              <MaterialIcons name="home" size={24} color="#2196f3" />
              <Text style={[styles.sideMenuItemText, { color: themeColors.textPrimary }]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.sideMenuItem, { backgroundColor: themeColors.cardBackground }]} 
              onPress={() => {
                closeSideMenu();
                router.push('/settings');
              }}
            >
              <MaterialIcons name="settings" size={24} color="#1976d2" />
              <Text style={[styles.sideMenuItemText, { color: themeColors.textPrimary }]}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sideMenuItem, { backgroundColor: themeColors.cardBackground }]} 
              onPress={() => {
                closeSideMenu();
                router.push('/personalInfo');
              }}
            >
              <MaterialIcons name="person" size={24} color="#4caf50" />
              <Text style={[styles.sideMenuItemText, { color: themeColors.textPrimary }]}>Personal Information</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.sideMenuItem, { backgroundColor: themeColors.cardBackground }]} 
              onPress={() => {
                closeSideMenu();
                handleLogout();
              }}
            >
              <MaterialIcons name="logout" size={24} color="#ff5252" />
              <Text style={[styles.sideMenuItemText, { color: themeColors.textPrimary }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView 
          contentContainerStyle={{ 
            alignItems: 'center', 
            justifyContent: 'flex-start', 
            paddingTop: 100, 
            paddingBottom: 50,
            paddingHorizontal: 20 
          }} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* Welcome Section */}
          <View style={[styles.welcomeSection, { backgroundColor: '#ffd700' }]}>
            <Text style={[styles.welcomeText, { color: themeColors.textPrimary, fontSize: fontSize + 2 }]}>
              Welcome back, {username}! 👋
            </Text>
            <Text style={[styles.welcomeSubtext, { color: themeColors.textMuted, fontSize: fontSize - 2 }]}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          {/* Extra spacing */}
          <View style={{ height: 25 }} />
          
          {/* Archive & Recycle Bin Buttons */}
          <View style={styles.topActionsContainer}>
            <TouchableOpacity style={[styles.topActionCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]} onPress={handleShowArchive}>
              <Text style={styles.topActionIcon}>📦</Text>
              <Text style={[styles.topActionTitle, { color: themeColors.textPrimary }]}>Archive</Text>
              <View style={styles.topCountBadge}>
                <Text style={styles.topCountText}>{archivedNotes.length}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.topActionCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]} onPress={handleShowRecycleBin}>
              <Text style={styles.topActionIcon}>🗑️</Text>
              <Text style={[styles.topActionTitle, { color: themeColors.textPrimary }]}>Recycle Bin</Text>
              <View style={styles.topCountBadge}>
                <Text style={styles.topCountText}>{deletedNotes.length}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* App Logo and Name */}
          <View style={styles.logoSection}>
            <Image 
              source={require('../app/pics/logo.jpg')}
              style={[styles.appLogo, { borderColor: themeColors.textPrimary }]}
              resizeMode="contain"
            />
            <Text style={[styles.appName, { color: themeColors.textPrimary, fontSize: fontSize + 4 }]}>QuickNotes</Text>
          </View>

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
                <View style={styles.fontSizeControls}>
                  <TouchableOpacity 
                    style={[styles.fontSizeBtn, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]} 
                    onPress={decreaseFontSize}
                  >
                    <Text style={[styles.fontSizeBtnText, { color: themeColors.textPrimary }]}>-</Text>
                  </TouchableOpacity>
                  <Text style={[styles.fontSizeDisplay, { color: themeColors.textPrimary, fontSize }]}>
                    {fontSize === 12 ? 'Small' : fontSize === 16 ? 'Medium' : 'Large'} ({fontSize}px)
                  </Text>
                  <TouchableOpacity 
                    style={[styles.fontSizeBtn, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]} 
                    onPress={increaseFontSize}
                  >
                    <Text style={[styles.fontSizeBtnText, { color: themeColors.textPrimary }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.backBtn} onPress={() => setShowSettings(false)}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  hamburgerButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    borderWidth: 2,
    borderColor: 'rgba(25, 118, 210, 0.1)',
  },
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1001,
  },
  sideMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  closeButton: {
    padding: 5,
  },
  sideMenuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sideMenuContent: {
    padding: 20,
  },
  sideMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  sideMenuItemText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
    color: '#333',
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  fontSizeBtn: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fontSizeDisplay: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 120,
  },
  topActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
    marginBottom: 35,
    paddingHorizontal: 5,
  },
  topActionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 110,
    transform: [{ scale: 1 }],
  },
  topActionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  topActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  topCountBadge: {
    backgroundColor: '#1976d2',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  appLogo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 5,
    borderColor: '#fff',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginTop: 5,
  },
  welcomeSection: {
    width: '100%',
    backgroundColor: '#ffd700',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});

