import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert, Easing } from 'react-native';

const ExecuteTreadmillWorkout = ({ route, navigation }) => {
    const { intervals } = route.params;
    const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(
        Math.round(parseFloat(intervals[0].timeForInterval) * 60) // ✅ Fixed the missing closing parenthesis
    );
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const progress = useRef(new Animated.Value(0)).current; // For circular progress bar

    // Timer logic
    useEffect(() => {
        let interval;
        if (isRunning && !isPaused && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prevTime) => {
                    if (prevTime <= 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (timeRemaining === 0) {
            if (currentIntervalIndex < intervals.length - 1) {
                // Move to the next interval
                setCurrentIntervalIndex((prevIndex) => prevIndex + 1);
                setTimeRemaining(
                    Math.round(parseFloat(intervals[currentIntervalIndex + 1].timeForInterval) * 60)
                );
                progress.setValue(0);
            } else {
                // Workout is finished
                setIsRunning(false);
                Alert.alert('Workout Completed', 'Great job! You’ve finished your workout.', [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, isPaused, timeRemaining, currentIntervalIndex, intervals, navigation, progress]);

    // Animate the circular progress bar
    useEffect(() => {
        if (isRunning && !isPaused) {
            Animated.timing(progress, {
                toValue: 1,
                duration: timeRemaining * 1000,
                easing: Easing.linear, // ✅ FIXED EASING IMPORT
                useNativeDriver: false,
            }).start();
        }
    }, [isRunning, isPaused, timeRemaining, progress]);

    const startWorkout = () => {
        setIsRunning(true);
        setIsPaused(false);
    };

    const pauseWorkout = () => {
        setIsPaused(true);
    };

    const resumeWorkout = () => {
        setIsPaused(false);
    };

    const skipInterval = () => {
        if (currentIntervalIndex < intervals.length - 1) {
            setCurrentIntervalIndex((prevIndex) => prevIndex + 1);
            setTimeRemaining(
                Math.round(parseFloat(intervals[currentIntervalIndex + 1].timeForInterval) * 60)
            );
            progress.setValue(0);
        } else {
            // Workout is finished
            setIsRunning(false);
            Alert.alert('Workout Completed', 'Great job! You’ve finished your workout.', [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
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
            <Text style={styles.intervalTitle}>Interval {currentInterval.interval}</Text>

            {/* Timer Display */}
            <View style={styles.circleContainer}>
                <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
            </View>

            {/* Interval Details */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Speed</Text>
                    <Text style={styles.detailValue}>{currentInterval.speed} mph</Text>
                </View>
                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Incline</Text>
                    <Text style={styles.detailValue}>{currentInterval.incline}%</Text>
                </View>
                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Calories</Text>
                    <Text style={styles.detailValue}>{currentInterval.caloriesBurned} kcal</Text>
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                {!isRunning && (
                    <TouchableOpacity style={styles.button} onPress={startWorkout}>
                        <Text style={styles.buttonText}>Start</Text>
                    </TouchableOpacity>
                )}

                {isRunning && !isPaused && (
                    <TouchableOpacity style={styles.button} onPress={pauseWorkout}>
                        <Text style={styles.buttonText}>Pause</Text>
                    </TouchableOpacity>
                )}

                {isRunning && isPaused && (
                    <TouchableOpacity style={styles.button} onPress={resumeWorkout}>
                        <Text style={styles.buttonText}>Resume</Text>
                    </TouchableOpacity>
                )}

                {isRunning && (
                    <TouchableOpacity style={styles.button} onPress={skipInterval}>
                        <Text style={styles.buttonText}>Skip Interval</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// ✅ Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    intervalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    circleContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        borderWidth: 10,
        borderColor: '#28a745',
        marginBottom: 20,
    },
    timer: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        width: '100%',
    },
    detailCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '30%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
    },
    detailValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 30,
        width: '100%',
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ExecuteTreadmillWorkout;
