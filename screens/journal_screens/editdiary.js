// editdiary.js
import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from '@firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection } from '@firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const auth = getAuth();
const db = getFirestore();

export default function EditDiaryEntryScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const entryId = route.params?.entryId || null;
    const [date, setDate] = useState(new Date());
    const [content, setContent] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        if (entryId) fetchEntry();
    }, [entryId]);

    const fetchEntry = async () => {
        const user = getAuth().currentUser;
        if (!user) return;

        const entryRef = doc(getFirestore(), `users/${user.uid}/diary/${entryId}`);
        const entrySnap = await getDoc(entryRef);

        if (entrySnap.exists()) {
            const data = entrySnap.data();
            setDate(new Date(data.date));
            setContent(data.content);
        }
    };

    const saveEntry = async () => {
        try {
            Keyboard.dismiss();
            const user = getAuth().currentUser;
            if (!user) return;
    
            const diaryCollection = collection(getFirestore(), `users/${user.uid}/diary`);
    
            if (entryId) {
                const entryRef = doc(diaryCollection, entryId);
                await setDoc(entryRef, { date: date.toISOString(), content });
            } else {
                const newEntryRef = doc(diaryCollection);
                await setDoc(newEntryRef, { date: date.toISOString(), content });
            }
    
            // Navigate back to Journal
            navigation.navigate('JournalMain', { refresh: true });
        } catch (error) {
            console.error("Error saving diary entry:", error);
        }
    };
    

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePicker}>
                    <Text style={styles.dateText}>{date.toDateString()}</Text>
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowPicker(Platform.OS === 'ios');
                            if (selectedDate) setDate(selectedDate);
                        }}
                    />
                )}

                <TextInput
                    style={styles.input}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Write your diary entry here..."
                    multiline
                />

                <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
                    <Text style={styles.saveButtonText}>Save Entry</Text>
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
    datePicker: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
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
