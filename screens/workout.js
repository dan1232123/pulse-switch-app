import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WorkoutScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Workout Options</Text>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('TreadmillWorkout')}
            >
                <Text style={styles.buttonText}>Treadmill Workout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    button: { backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginTop: 10 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default WorkoutScreen;
