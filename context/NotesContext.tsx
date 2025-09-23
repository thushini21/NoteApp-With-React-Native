// Notes context for managing all note operations
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "./AuthContext";

// Note type definition
type Note = { id: string; text: string; uid: string; tag?: string; color?: string; title?: string; image?: string; file?: { uri: string; name: string }; category?: string; deleted?: boolean; archived?: boolean };
interface NotesContextType {
  notes: Note[];
  deletedNotes: Note[];
  archivedNotes: Note[];
  addNote: (text: string, tag?: string, color?: string, title?: string, image?: string, file?: { uri: string; name: string }, category?: string) => Promise<void>;
  updateNote: (id: string, text: string, tag?: string, color?: string, title?: string, category?: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  archiveNote: (id: string) => Promise<void>;
  unarchiveNote: (id: string) => Promise<void>;
  fetchNotes: () => Promise<void>;
  fetchDeletedNotes: () => Promise<void>;
  fetchArchivedNotes: () => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
}

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  deletedNotes: [],
  archivedNotes: [],
  addNote: async () => {},
  updateNote: async () => {},
  deleteNote: async () => {},
  archiveNote: async () => {},
  unarchiveNote: async () => {},
  fetchNotes: async () => {},
  fetchDeletedNotes: async () => {},
  fetchArchivedNotes: async () => {},
  restoreNote: async () => {},
});

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([]);
  const { user } = useContext(AuthContext);

  const fetchNotes = async () => {
    if (!user) return;
    // Fetch notes for user where deleted and archived are not true
    const q = query(collection(db, "notes"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    // Filter out notes where deleted === true or archived === true
    setNotes(snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Note))
      .filter(note => note.deleted !== true && note.archived !== true));
  };

  const fetchDeletedNotes = async () => {
    if (!user) return;
    const q = query(collection(db, "notes"), where("uid", "==", user.uid), where("deleted", "==", true));
    const snapshot = await getDocs(q);
    setDeletedNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
  };

  const addNote = async (text: string, tag?: string, color?: string, title?: string, image?: string, file?: { uri: string; name: string }, category?: string) => {
    if (!user) return;
    const noteData: any = { text, uid: user.uid, tag, color, title };
    
    // Only add category if it's not "All notes" (which means no specific category)
    if (category && category !== "All notes") {
      noteData.category = category;
    }
    
    if (image !== undefined) noteData.image = image;
    if (file !== undefined) noteData.file = file;
    noteData.deleted = false;
    await addDoc(collection(db, "notes"), noteData);
    fetchNotes();
  };

  const updateNote = async (id: string, text: string, tag?: string, color?: string, title?: string, category?: string) => {
    // Remove undefined fields
    const updateData: Record<string, any> = {};
    if (text !== undefined) updateData.text = text;
    if (tag !== undefined) updateData.tag = tag;
    if (color !== undefined) updateData.color = color;
    if (title !== undefined) updateData.title = title;
    
    // Handle category - if "All notes" is selected, remove the category field
    if (category !== undefined) {
      if (category === "All notes") {
        updateData.category = null; // Remove category
      } else {
        updateData.category = category;
      }
    }
    
    await updateDoc(doc(db, "notes", id), updateData);
    fetchNotes();
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await updateDoc(doc(db, "notes", id), { deleted: true });
    fetchNotes();
    fetchDeletedNotes();
  };

  const archiveNote = async (id: string) => {
    await updateDoc(doc(db, "notes", id), { archived: true });
    fetchNotes();
    fetchArchivedNotes();
  };

  const unarchiveNote = async (id: string) => {
    await updateDoc(doc(db, "notes", id), { archived: false });
    fetchNotes();
    fetchArchivedNotes();
  };

  const fetchArchivedNotes = async () => {
    if (!user) return;
    const q = query(collection(db, "notes"), where("uid", "==", user.uid), where("archived", "==", true));
    const snapshot = await getDocs(q);
    setArchivedNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
  };

  const restoreNote = async (id: string) => {
    await updateDoc(doc(db, "notes", id), { deleted: false });
    fetchNotes();
    fetchDeletedNotes();
  };

  useEffect(() => {
    fetchNotes();
    fetchDeletedNotes();
    fetchArchivedNotes();
  }, [user]);

  return (
    <NotesContext.Provider value={{ 
      notes, 
      deletedNotes, 
      archivedNotes, 
      addNote, 
      updateNote, 
      deleteNote, 
      archiveNote, 
      unarchiveNote, 
      fetchNotes, 
      fetchDeletedNotes, 
      fetchArchivedNotes, 
      restoreNote 
    }}>
      {children}
    </NotesContext.Provider>
  );
};