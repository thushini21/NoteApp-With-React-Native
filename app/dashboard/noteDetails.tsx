import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NoteDetails() {
  const router = useRouter();
  const { noteTitle, noteText, noteColor, noteFileUri, noteFileName } = useLocalSearchParams();

  // Ensure noteColor is a string
  const bgColor = typeof noteColor === 'string' ? noteColor : Array.isArray(noteColor) ? noteColor[0] : '#fff';
  return (
    <View style={[styles.root, { backgroundColor: bgColor || '#fff' }] }>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/home')}>
        <Text style={styles.backText}>{'<'} Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{noteTitle}</Text>
      <Text style={styles.text}>{noteText}</Text>
      {noteFileUri ? (
        <TouchableOpacity onPress={async () => {
          try {
            const Linking = await import('expo-linking');
            const supported = await Linking.canOpenURL(noteFileUri as string);
            if (supported) {
              Linking.openURL(noteFileUri as string);
            } else {
              alert('Cannot open this file. It may not exist on this device.');
            }
          } catch {
            alert('Error opening file.');
          }
        }}>
          <Text style={styles.fileLink}>Open File: {noteFileName}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}


const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    paddingHorizontal: width > 600 ? 48 : 16,
    paddingVertical: 16,
    justifyContent: 'flex-start',
  },
  backBtn: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: width > 600 ? 24 : 18,
    color: '#1976d2',
  },
  title: {
    fontSize: width > 600 ? 28 : 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    textAlign: 'left',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  fileLink: {
    color: '#1976d2',
    textDecorationLine: 'underline',
    marginTop: 8,
    fontSize: 16,
  },
});
