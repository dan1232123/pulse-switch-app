import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WorkoutScreen = () => {
    const navigation = useNavigation();
    const [showInfo, setShowInfo] = useState(false); // State for dropdown info
    const [animation] = useState(new Animated.Value(0)); // Animation for smooth collapse/expand

    const toggleInfo = () => {
        if (showInfo) {
            Animated.timing(animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
        setShowInfo(!showInfo);
    };

    const infoHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 150], // Adjust height based on content
    });

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Treadmill Workout Button with Image */}
            <View style={styles.centerContainer}>
                <TouchableOpacity
                    style={[styles.widget, styles.treadmillWidgetSmall]}
                    onPress={() => navigation.navigate('TreadmillWorkout')}
                >
                    <Image
                        source={require('../assets/logonew.png')} // Add your image here
                        style={styles.buttonImage}
                    />
                    <Text style={styles.widgetText}>Treadmill Workout</Text>
                    <Text style={styles.widgetText2}>Set your calorie goal, randomise, and run away..</Text>
                </TouchableOpacity>
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
    featuredWorkoutContainer: {
        width: '90%',
        marginTop: 20,
        alignItems: 'center',
    },
    featuredWorkoutText: {
        fontSize: 22,
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
        height: 250, // Adjusted height to accommodate image
        backgroundColor: '#2ecc71', // Light Green
    },
    buttonImage: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    widgetText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    widgetText2: {
        color: 'white',
        fontSize: 10,

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
        overflow: 'hidden',
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
        padding: 15,
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




