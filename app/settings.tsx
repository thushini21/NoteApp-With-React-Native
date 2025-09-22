import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { theme, toggleTheme, fontSize, increaseFontSize, decreaseFontSize, themeColors } = useTheme();
  const router = useRouter();

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
        <Text style={[styles.title, { color: themeColors.textPrimary, fontSize: fontSize + 6 }]}>Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Theme Section */}
        <View style={[styles.settingsSection, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="palette" size={24} color={themeColors.textPrimary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary, fontSize }]}>Theme</Text>
                <Text style={[styles.settingSubtitle, { color: themeColors.textSecondary, fontSize: fontSize - 2 }]}>
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.themeToggle, { 
                backgroundColor: theme === 'dark' ? '#4caf50' : '#ddd',
                borderColor: themeColors.border 
              }]}
              onPress={toggleTheme}
            >
              <View style={[styles.toggleCircle, {
                backgroundColor: '#fff',
                transform: [{ translateX: theme === 'dark' ? 22 : 2 }]
              }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Font Size Section */}
        <View style={[styles.settingsSection, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="text-fields" size={24} color={themeColors.textPrimary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary, fontSize }]}>Font Size</Text>
                <Text style={[styles.settingSubtitle, { color: themeColors.textSecondary, fontSize: fontSize - 2 }]}>
                  Current: {fontSize === 12 ? 'Small' : fontSize === 16 ? 'Medium' : 'Large'}
                </Text>
              </View>
            </View>
            <View style={styles.fontControls}>
              <TouchableOpacity 
                style={[styles.fontButton, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
                onPress={decreaseFontSize}
              >
                <MaterialIcons name="remove" size={20} color={themeColors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.fontSizeDisplay, { color: themeColors.textPrimary, fontSize }]}>
                {fontSize}
              </Text>
              <TouchableOpacity 
                style={[styles.fontButton, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
                onPress={increaseFontSize}
              >
                <MaterialIcons name="add" size={20} color={themeColors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Preview Section */}
        <View style={[styles.settingsSection, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <View style={styles.previewHeader}>
            <MaterialIcons name="visibility" size={24} color={themeColors.textPrimary} />
            <Text style={[styles.settingTitle, { color: themeColors.textPrimary, fontSize, marginLeft: 12 }]}>Preview</Text>
          </View>
          <View style={[styles.previewContent, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.previewTitle, { color: themeColors.textPrimary, fontSize: fontSize + 2 }]}>
              Sample Note Title
            </Text>
            <Text style={[styles.previewText, { color: themeColors.textSecondary, fontSize }]}>
              This is how your notes will look with the current theme and font size settings.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: width > 600 ? 48 : 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  themeToggle: {
    width: 50,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeDisplay: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewContent: {
    padding: 16,
    borderRadius: 8,
  },
  previewTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewText: {
    lineHeight: 22,
  },
});