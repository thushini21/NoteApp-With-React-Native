import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "./AuthContext";

type Note = { id: string; text: string; uid: string };
interface NotesContextType {
  notes: Note[];
  addNote: (text: string) => Promise<void>;
  updateNote: (id: string, text: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  fetchNotes: () => Promise<void>;
}

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  addNote: async () => {},
  updateNote: async () => {},
  deleteNote: async () => {},
  fetchNotes: async () => {},
});

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<any[]>([]);
  const { user } = useContext(AuthContext);

  const fetchNotes = async () => {
    if (!user) return;
    const { query, where } = await import("firebase/firestore");
    const q = query(collection(db, "notes"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addNote = async (text: string) => {
    if (!user) return;
    const docRef = await addDoc(collection(db, "notes"), { text, uid: user.uid });
    fetchNotes();
  };

  const updateNote = async (id: string, text: string) => {
    await updateDoc(doc(db, "notes", id), { text });
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, fetchNotes }}>
      {children}
    </NotesContext.Provider>
  );
};