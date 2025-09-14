import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Note } from "../types/note";

const notesCollection = collection(db, "notes");

export const addNote = async (note: Note) => {
  return await addDoc(notesCollection, { ...note, createdAt: new Date() });
};

export const getNotes = async () => {
  const snapshot = await getDocs(notesCollection);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Note[];
};

export const updateNote = async (id: string, note: Partial<Note>) => {
  const ref = doc(db, "notes", id);
  return await updateDoc(ref, note);
};

export const deleteNote = async (id: string) => {
  const ref = doc(db, "notes", id);
  return await deleteDoc(ref);
}

