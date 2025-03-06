import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TreadmillWorkout = () => {
    const navigation = useNavigation();

    const [calorieGoal, setCalorieGoal] = useState('');
    const [minWorkoutDuration, setMinWorkoutDuration] = useState('');
    const [maxWorkoutDuration, setMaxWorkoutDuration] = useState('');
    const [minSpeed, setMinSpeed] = useState('');
    const [maxSpeed, setMaxSpeed] = useState('');
    const [minIncline, setMinIncline] = useState('');
    const [maxIncline, setMaxIncline] = useState('');
    const [numIntervals, setNumIntervals] = useState('');
    const [weight, setWeight] = useState('');

    const calculateCaloriesPerMinute = (speed, incline, weight) => {
        const speed_m_min = speed * 26.8;
        let vo2;
        if (speed <= 3.7) {
            vo2 = (0.1 * speed_m_min) + (1.8 * speed_m_min * (incline / 100)) + 3.5;
        } else {
            vo2 = (0.2 * speed_m_min) + (0.9 * speed_m_min * (incline / 100)) + 3.5;
        }
        const mets = vo2 / 3.5;
        return (mets * 3.5 * weight) / 200;
    };

    const validateInput = () => {
        const calorieTarget = parseFloat(calorieGoal);
        const minDuration = parseFloat(minWorkoutDuration);
        const maxDuration = parseFloat(maxWorkoutDuration);
        const minSpd = parseFloat(minSpeed);
        const maxSpd = parseFloat(maxSpeed);
        const minInc = parseFloat(minIncline);
        const maxInc = parseFloat(maxIncline);
        const intervals = parseInt(numIntervals);
        const userWeight = parseFloat(weight);

        if (
            isNaN(calorieTarget) || isNaN(minDuration) || isNaN(maxDuration) || isNaN(minSpd) || isNaN(maxSpd) ||
            isNaN(minInc) || isNaN(maxInc) || isNaN(intervals) || isNaN(userWeight)
        ) {
            Alert.alert("Error", "Please enter valid numbers for all fields.");
            return false;
        }

        // 🔥 **Adding Limits for Inputs**
        if (calorieTarget < 20 || calorieTarget > 1000) {
            Alert.alert("Invalid Input", "Calories goal must be between 20 and 1000.");
            return false;
        }
        if (minDuration < 1 || maxDuration > 120 || minDuration > maxDuration) {
            Alert.alert("Invalid Input", "Workout duration must be between 1 and 120 minutes.");
            return false;
        }
        if (minSpd < 0.1 || maxSpd > 15 || minSpd > maxSpd) {
            Alert.alert("Invalid Input", "Speed must be between 0.1 and 15 mph.");
            return false;
        }
        if (minInc < 0 || maxInc > 15 || minInc > maxInc) {
            Alert.alert("Invalid Input", "Incline must be between 0% and 15%.");
            return false;
        }
        if (intervals < 1 || intervals > 25) {
            Alert.alert("Invalid Input", "Number of intervals must be between 1 and 25.");
            return false;
        }
        if (userWeight < 30 || userWeight > 300) {
            Alert.alert("Invalid Input", "Weight must be between 30kg and 300kg.");
            return false;
        }

        return true;
    };

    const generateWorkout = () => {
        Keyboard.dismiss();

        if (!validateInput()) return; // Stop if input is invalid

        const calorieTarget = parseFloat(calorieGoal);
        const minDuration = parseFloat(minWorkoutDuration);
        const maxDuration = parseFloat(maxWorkoutDuration);
        const minSpd = parseFloat(minSpeed);
        const maxSpd = parseFloat(maxSpeed);
        const minInc = parseFloat(minIncline);
        const maxInc = parseFloat(maxIncline);
        const intervals = parseInt(numIntervals);
        const userWeight = parseFloat(weight);

        let totalWorkoutDuration = parseFloat((Math.random() * (maxDuration - minDuration) + minDuration).toFixed(2));
        let remainingCalories = calorieTarget;
        let remainingTime = totalWorkoutDuration;
        let intervalData = [];

        let timeSplits = [];
        let sumOfSplits = 0;

        for (let i = 0; i < intervals; i++) {
            let percentage = Math.random() * 0.4 + 0.15;
            timeSplits.push(percentage);
            sumOfSplits += percentage;
        }

        timeSplits = timeSplits.map(split => split / sumOfSplits);

        for (let i = 0; i < intervals; i++) {
            let speed, incline, caloriesPerMin;

            do {
                speed = parseFloat((Math.random() * (maxSpd - minSpd) + minSpd).toFixed(1));
                incline = parseFloat((Math.random() * (maxInc - minInc) + minInc).toFixed(1));
                caloriesPerMin = calculateCaloriesPerMinute(speed, incline, userWeight);
            } while (caloriesPerMin < 5);

            let timeForInterval;
            let caloriesBurned;

            if (i === intervals - 1) {
                timeForInterval = parseFloat((remainingCalories / caloriesPerMin).toFixed(2));
                caloriesBurned = remainingCalories;
            } else {
                timeForInterval = parseFloat((totalWorkoutDuration * timeSplits[i]).toFixed(2));
                timeForInterval = Math.min(timeForInterval, remainingTime - (intervals - (i + 1)));
                caloriesBurned = parseFloat((caloriesPerMin * timeForInterval).toFixed(2));
            }

            timeForInterval = Math.max(timeForInterval, 1);
            caloriesBurned = Math.max(caloriesBurned, caloriesPerMin);

            intervalData.push({
                interval: i + 1,
                speed,
                incline,
                timeForInterval: timeForInterval.toFixed(2),
                caloriesBurned: caloriesBurned.toFixed(2),
            });

            remainingTime -= timeForInterval;
            remainingCalories -= caloriesBurned;
        }

        navigation.navigate("ExecuteTreadmillWorkout", { intervals: intervalData });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Enter Workout Details:</Text>

            <TextInput style={styles.input} placeholder="Calories Goal (20-1000)" keyboardType="numeric" value={calorieGoal} onChangeText={setCalorieGoal} />
            <TextInput style={styles.input} placeholder="Min Workout Duration (1-120 min)" keyboardType="numeric" value={minWorkoutDuration} onChangeText={setMinWorkoutDuration} />
            <TextInput style={styles.input} placeholder="Max Workout Duration (1-120 min)" keyboardType="numeric" value={maxWorkoutDuration} onChangeText={setMaxWorkoutDuration} />
            <TextInput style={styles.input} placeholder="Min Speed (0.1-15 mph)" keyboardType="numeric" value={minSpeed} onChangeText={setMinSpeed} />
            <TextInput style={styles.input} placeholder="Max Speed (0.1-15 mph)" keyboardType="numeric" value={maxSpeed} onChangeText={setMaxSpeed} />
            <TextInput style={styles.input} placeholder="Min Incline (0-15%)" keyboardType="numeric" value={minIncline} onChangeText={setMinIncline} />
            <TextInput style={styles.input} placeholder="Max Incline (0-15%)" keyboardType="numeric" value={maxIncline} onChangeText={setMaxIncline} />
            <TextInput style={styles.input} placeholder="Number of Intervals (1-25)" keyboardType="numeric" value={numIntervals} onChangeText={setNumIntervals} />
            <TextInput style={styles.input} placeholder="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />

            <TouchableOpacity style={styles.button} onPress={generateWorkout}>
                <Text style={styles.buttonText}>Generate Workout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TreadmillWorkout;