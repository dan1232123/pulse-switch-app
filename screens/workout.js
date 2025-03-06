import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WorkoutScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* ✅ White Header (Exactly Like Home.js) */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Workout</Text>
            </View>

            {/* ✅ Widgets Below */}
            <TouchableOpacity
                style={[styles.widget, styles.treadmillWidget]}
                onPress={() => navigation.navigate('TreadmillWorkout')}
            >
                <Text style={styles.widgetText}>Treadmill Workout</Text>
            </TouchableOpacity>

            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    header: {
        width: '100%',
        backgroundColor: 'white',
        height: 100, // ✅ Exact same height as home.js
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    widget: {
        width: '90%',
        height: 120, // ✅ Nice-sized widgets
        backgroundColor: '#2ecc71', // ✅ Light Green
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    treadmillWidget: {
        height: 180, // ✅ Make Treadmill Widget Taller
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 20,
    },
    widgetText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default WorkoutScreen;





