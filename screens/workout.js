import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WorkoutScreen = () => {
    const navigation = useNavigation();
    const [showInfo, setShowInfo] = useState(false); // State for dropdown info

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Treadmill Workout - The Original</Text>
            </View>

            {/* Smaller Treadmill Workout Button */}
            <View style={styles.centerContainer}>
                <TouchableOpacity
                    style={[styles.widget, styles.treadmillWidgetSmall]}
                    onPress={() => navigation.navigate('TreadmillWorkout')}
                >
                    <Text style={styles.widgetText}>Treadmill Workout</Text>
                </TouchableOpacity>
            </View>

            {/* Info Dropdown Section */}
            <View style={styles.centerContainer}>
                <TouchableOpacity
                    style={styles.infoHeader}
                    onPress={() => setShowInfo(!showInfo)}
                >
                    <Text style={styles.infoHeaderText}>What is this workout?</Text>
                    <Text style={styles.arrowIcon}>{showInfo ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {showInfo && (
                    <View style={styles.infoContent}>
                        <Text style={styles.infoText}>
                            This is the original treadmill workout designed to improve your cardiovascular health and endurance. 
                            It includes intervals of running and walking to maximize calorie burn and build stamina. 
                            Perfect for beginners and advanced users alike!
                        </Text>
                    </View>
                )}
            </View>

            {/* Bottom Row */}
            <View style={[styles.bottomRow, styles.centerContainer]}>
                {/* Recent Activity Box */}
                <View style={[styles.box, styles.activityBox]}>
                    <Text style={styles.boxTitle}>Recent Activity</Text>
                    <Text style={styles.boxText}>Your recent workouts will appear here.</Text>
                </View>

                {/* Coming Soon Box */}
                <View style={[styles.box, styles.comingSoonBox]}>
                    <Text style={styles.boxTitle}>Coming Soon</Text>
                    <Text style={styles.boxText}>New workouts and features are on the way!</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingBottom: 20, // Add some padding at the bottom
    },
    header: {
        width: '100%',
        backgroundColor: 'white',
        height: 100,
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
    centerContainer: {
        width: '100%',
        alignItems: 'center', // Ensure everything inside is centered
    },
    widget: {
        width: '90%',
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
    treadmillWidgetSmall: {
        height: 100, // Smaller height
        backgroundColor: '#2ecc71', // Light Green
    },
    widgetText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginTop: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    infoHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    arrowIcon: {
        fontSize: 18,
        color: '#333',
    },
    infoContent: {
        width: '90%',
        marginTop: 10,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    infoText: {
        fontSize: 16,
        color: '#555',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 20,
    },
    box: {
        width: '48%',
        height: 150,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    activityBox: {
        backgroundColor: '#243B55', // Blue
    },
    comingSoonBox: {
        backgroundColor: '#243B55', // Orange
    },
    boxTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    boxText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },
});

export default WorkoutScreen;




