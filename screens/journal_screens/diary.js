// Diary.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { getAuth } from '@firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { format } from 'date-fns';

const auth = getAuth();
const db = getFirestore();

export default function DiaryScreen() {
    const navigation = useNavigation();
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const entriesCollection = collection(db, 'users', user.uid, 'diary');
        const querySnapshot = await getDocs(entriesCollection);

        const fetchedEntries = [];
        querySnapshot.forEach(doc => {
            fetchedEntries.push({ id: doc.id, ...doc.data() });
        });

        setEntries(fetchedEntries);
    };

    const deleteEntry = async (entryId) => {
        const user = auth.currentUser;
        if (!user) return;

        const entryRef = doc(db, 'users', user.uid, 'diary', entryId);
        await deleteDoc(entryRef);
        fetchEntries();
    };

    const renderRightActions = (entryId) => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
                Alert.alert("Delete Entry", "This action is permanent. Are you sure?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", onPress: () => deleteEntry(entryId) },
                ]);
            }}
        >
            <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={entries.sort((a, b) => new Date(b.date) - new Date(a.date))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                        <TouchableOpacity
                            style={styles.entryItem}
                            onPress={() => navigation.navigate('EditDiaryEntry', { entryId: item.id })}
                        >
                            <Text style={styles.entryDate}>{format(new Date(item.date), 'PPP')}</Text>
                            <Text style={styles.entryPreview}>
                                {item.content?.length > 50 ? item.content.substring(0, 50) + '...' : item.content}
                            </Text>
                        </TouchableOpacity>
                    </Swipeable>
                )}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('EditDiaryEntry')}
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
    entryItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    entryDate: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    entryPreview: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});