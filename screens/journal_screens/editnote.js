import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from '@firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from '@firebase/firestore';

// Initialize Firebase
const auth = getAuth();
const db = getFirestore();

export default function EditNoteScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    
    const noteId = route.params?.noteId || null;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (noteId) {
            fetchNote();
        }
    }, [noteId]);

    // Fetch note from Firestore
    const fetchNote = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const noteRef = doc(db, `users/${user.uid}/notes/${noteId}`);
            const noteSnap = await getDoc(noteRef);

            if (noteSnap.exists()) {
                setTitle(noteSnap.data().title || '');
                setContent(noteSnap.data().content || '');
            }
        } catch (error) {
            console.error("Error fetching note:", error);
        }
    };

    // Save note (create or update)
    const saveNote = async () => {
        try {
            Keyboard.dismiss();
            const user = auth.currentUser;
            if (!user) return;

            const notesCollection = collection(db, `users/${user.uid}/notes`);

            if (noteId) {
                // Update existing note
                const noteRef = doc(notesCollection, noteId);
                await setDoc(noteRef, { title, content });
            } else {
                // Create new note
                await addDoc(notesCollection, { title, content });
            }

            // Navigate back to Journal
            navigation.navigate('JournalMain', { refresh: true });

        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <TextInput
                    style={styles.titleInput}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Title"
                />
                <TextInput
                    style={styles.input}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Write your note here..."
                    multiline
                />

                <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
                    <Text style={styles.saveButtonText}>Save Note</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    titleInput: {
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 18,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        textAlignVertical: 'top',
        elevation: 3,
    },
    saveButton: {
        backgroundColor: '#2ecc71',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
