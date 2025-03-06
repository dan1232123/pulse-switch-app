import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DiaryScreen from './journal_screens/diary';
import NotesScreen from './journal_screens/notes';

export default function JournalScreen() {
    const [selectedTab, setSelectedTab] = useState('Diary'); // Default tab is Diary

    return (
        <View style={styles.container}>
            {/* White Banner */}
            <View style={styles.header} />

            {/* Toggle between Diary & Notes */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity 
                    style={[styles.toggleButton, selectedTab === 'Diary' && styles.selectedTab]} 
                    onPress={() => setSelectedTab('Diary')}
                >
                    <Text style={[styles.toggleText, selectedTab === 'Diary' && styles.selectedText]}>Diary</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.toggleButton, selectedTab === 'Notes' && styles.selectedTab]} 
                    onPress={() => setSelectedTab('Notes')}
                >
                    <Text style={[styles.toggleText, selectedTab === 'Notes' && styles.selectedText]}>Notes</Text>
                </TouchableOpacity>
            </View>

            {/* Display selected content */}
            <View style={styles.contentContainer}>
                {selectedTab === 'Diary' ? <DiaryScreen /> : <NotesScreen />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        backgroundColor: 'white',
        height: 100,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#fff',
        paddingVertical: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    toggleButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    selectedTab: {
        borderBottomWidth: 4,
        borderBottomColor: '#2ecc71',
    },
    toggleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
    },
    selectedText: {
        color: '#2ecc71',
    },
    contentContainer: {
        flex: 1,
        padding: 15,
    },
});


