import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AboutPulseSwitch = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>About Pulse Switch</Text>
            <Text style={styles.description}>
                Pulse Switch is designed to help users optimize their treadmill workouts, track progress,
                and stay motivated with structured interval training. Whether you're a beginner or an
                advanced athlete, Pulse Switch provides data-driven treadmill workouts tailored to your
                fitness level and goals.
            </Text>
            <Text style={styles.sectionTitle}>🔹 Features:</Text>
            <Text style={styles.listItem}>✅ Personalized treadmill interval workouts</Text>
            <Text style={styles.listItem}>✅ Real-time workout execution and tracking</Text>
            <Text style={styles.listItem}>✅ Progress tracking with daily calorie goals</Text>
            <Text style={styles.listItem}>✅ Motivational quotes from top athletes</Text>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AboutPulseSwitch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    listItem: {
        fontSize: 16,
        color: '#555',
        textAlign: 'left',
        width: '100%',
    },
    backButton: {
        marginTop: 20,
        backgroundColor: '#2ecc71',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
