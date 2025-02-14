import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ExecuteTreadmillWorkout = ({ route, navigation }) => {
    const { intervals } = route.params; // Get the intervals from navigation params
    const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(parseFloat(intervals[currentIntervalIndex].timeForInterval) * 60); // Convert minutes to seconds
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            if (currentIntervalIndex < intervals.length - 1) {
                // Move to the next interval
                setCurrentIntervalIndex((prevIndex) => prevIndex + 1);
                setTimeRemaining(parseFloat(intervals[currentIntervalIndex + 1].timeForInterval) * 60);
            } else {
                // Workout is finished
                setIsRunning(false);
                alert('Workout completed!');
                navigation.goBack(); // Go back to the previous screen
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, timeRemaining, currentIntervalIndex, intervals, navigation]);

    const startWorkout = () => {
        setIsRunning(true);
    };

    const skipInterval = () => {
        if (currentIntervalIndex < intervals.length - 1) {
            setCurrentIntervalIndex((prevIndex) => prevIndex + 1);
            setTimeRemaining(parseFloat(intervals[currentIntervalIndex + 1].timeForInterval) * 60);
        } else {
            // Workout is finished
            setIsRunning(false);
            alert('Workout completed!');
            navigation.goBack(); // Go back to the previous screen
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const currentInterval = intervals[currentIntervalIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Interval {currentInterval.interval}</Text>
            <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.details}>
                Speed: {currentInterval.speed} mph | Incline: {currentInterval.incline}%
            </Text>
            <Text style={styles.details}>
                Calories: {currentInterval.caloriesBurned} kcal
            </Text>

            {!isRunning && (
                <TouchableOpacity style={styles.button} onPress={startWorkout}>
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
            )}

            {isRunning && (
                <TouchableOpacity style={styles.button} onPress={skipInterval}>
                    <Text style={styles.buttonText}>Skip Interval</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    timer: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    details: {
        fontSize: 18,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ExecuteTreadmillWorkout;