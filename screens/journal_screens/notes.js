import React, { useState, useEffect } from 'react';
import { 
    View, Text, TouchableOpacity, FlatList, StyleSheet, Alert 
} from 'react-native';
import { getAuth } from '@firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

// Initialize Firebase
const auth = getAuth();
const db = getFirestore();

export default function NotesScreen() {
    const navigation = useNavigation();
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetchNotes();
    }, []);

    // Fetch all notes from Firestore
    const fetchNotes = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const notesCollection = collection(db, 'users', user.uid, 'notes');
            const querySnapshot = await getDocs(notesCollection);
            
            const fetchedNotes = [];
            querySnapshot.forEach(doc => {
                fetchedNotes.push({ id: doc.id, ...doc.data() });
            });

            setNotes(fetchedNotes);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    // Delete a note
    const deleteNote = async (noteId) => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const noteRef = doc(db, 'users', user.uid, 'notes', noteId);
            await deleteDoc(noteRef);
            fetchNotes(); // Refresh the notes list
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    // Render swipeable delete button
    const renderRightActions = (noteId) => {
        return (
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                    Alert.alert(
                        "Delete Note",
                        "This action is permanent. Are you sure you want to delete this note?",
                        [
                            { text: "Cancel", style: "cancel" },
                            { text: "Delete", onPress: () => deleteNote(noteId) },
                        ]
                    );
                }}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Notes List */}
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                        <TouchableOpacity 
                            style={styles.noteItem} 
                            onPress={() => navigation.navigate('EditNote', { noteId: item.id })}
                        >
                            <Text style={styles.noteTitle}>{item.title || 'Untitled Note'}</Text>
                            <Text style={styles.notePreview}>
                                {item.content.length > 50 ? item.content.substring(0, 50) + '...' : item.content}
                            </Text>
                        </TouchableOpacity>
                    </Swipeable>
                )}
            />

            {/* Floating Add Note Button */}
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => navigation.navigate('EditNote')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#3498db',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    addButtonText: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    noteItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    notePreview: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        borderRadius: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
