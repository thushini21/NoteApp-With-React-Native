import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function PersonalInfo() {
  const router = useRouter();
  const { user } = useContext(AuthContext) as AuthContextType;
  const { theme, fontSize, themeColors } = useTheme();

  // Extract username from email (before @)
  const username = user?.email ? user.email.split('@')[0] : '';

  // Function to mask email address
  const maskEmail = (email: string | null | undefined) => {
    if (!email) return '';
    
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    
    // Show first 2 characters and last 1 character of local part
    const maskedLocal = localPart.length > 3 
      ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 3) + localPart.slice(-1)
      : localPart.substring(0, 1) + '*'.repeat(Math.max(0, localPart.length - 1));
    
    return `${maskedLocal}@${domain}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.cardBackground, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary, fontSize: fontSize + 4 }]}>
          Personal Information
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={[styles.section, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person" size={24} color="#1976d2" />
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary, fontSize: fontSize + 2 }]}>
              User Details
            </Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={[styles.infoRow, { backgroundColor: themeColors.background }]}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary, fontSize }]}>Username:</Text>
              <Text style={[styles.infoValue, { color: themeColors.textPrimary, fontSize }]}>{username}</Text>
            </View>

            <View style={[styles.infoRow, { backgroundColor: themeColors.background }]}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary, fontSize }]}>Email:</Text>
              <Text style={[styles.infoValue, { color: themeColors.textPrimary, fontSize }]}>{maskEmail(user?.email)}</Text>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={[styles.section, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="settings" size={24} color="#ff9800" />
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary, fontSize: fontSize + 2 }]}>
              Account Actions
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#ff5722' }]}
            onPress={() => {
              // You can add password reset functionality here
              alert('Password reset functionality can be implemented here');
            }}
          >
            <MaterialIcons name="lock-reset" size={20} color="#fff" />
            <Text style={[styles.actionButtonText, { fontSize }]}>Reset Password</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  infoLabel: {
    fontWeight: '600',
    flex: 1,
  },
  infoValue: {
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});