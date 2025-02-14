import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
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
    const [results, setResults] = useState(null);

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

    const generateWorkout = () => {
        Keyboard.dismiss();

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
            alert("Please enter valid numbers for all fields.");
            return;
        }

        let totalWorkoutDuration = parseFloat((Math.random() * (maxDuration - minDuration) + minDuration).toFixed(2));
        let remainingCalories = calorieTarget;
        let remainingTime = totalWorkoutDuration;
        let intervalData = [];

        // Generate random percentage splits for each interval
        let timeSplits = [];
        let sumOfSplits = 0;

        for (let i = 0; i < intervals; i++) {
            let percentage = Math.random() * 0.4 + 0.15; // Each interval takes between 15% - 55% of total time
            timeSplits.push(percentage);
            sumOfSplits += percentage;
        }

        // Normalize time splits to ensure total workout duration is matched
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
                // Ensure last interval makes up the remaining calories
                timeForInterval = parseFloat((remainingCalories / caloriesPerMin).toFixed(2));
                caloriesBurned = remainingCalories;
            } else {
                timeForInterval = parseFloat((totalWorkoutDuration * timeSplits[i]).toFixed(2));
                timeForInterval = Math.min(timeForInterval, remainingTime - (intervals - (i + 1)));

                caloriesBurned = parseFloat((caloriesPerMin * timeForInterval).toFixed(2));
                caloriesBurned = Math.min(caloriesBurned, remainingCalories - (intervals - (i + 1)) * 5); // Ensure at least 5 calories per remaining interval
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

        // Navigate to ExecuteTreadmillWorkout with the generated intervals
        navigation.navigate('ExecuteTreadmillWorkout', { intervals: intervalData });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Treadmill Workout Generator</Text>

            <TextInput
                style={styles.input}
                placeholder="Calories Goal"
                keyboardType="numeric"
                value={calorieGoal}
                onChangeText={setCalorieGoal}
            />
            <TextInput
                style={styles.input}
                placeholder="Min Workout Duration (min)"
                keyboardType="numeric"
                value={minWorkoutDuration}
                onChangeText={setMinWorkoutDuration}
            />
            <TextInput
                style={styles.input}
                placeholder="Max Workout Duration (min)"
                keyboardType="numeric"
                value={maxWorkoutDuration}
                onChangeText={setMaxWorkoutDuration}
            />
            <TextInput
                style={styles.input}
                placeholder="Min Speed (mph)"
                keyboardType="numeric"
                value={minSpeed}
                onChangeText={setMinSpeed}
            />
            <TextInput
                style={styles.input}
                placeholder="Max Speed (mph)"
                keyboardType="numeric"
                value={maxSpeed}
                onChangeText={setMaxSpeed}
            />
            <TextInput
                style={styles.input}
                placeholder="Min Incline (%)"
                keyboardType="numeric"
                value={minIncline}
                onChangeText={setMinIncline}
            />
            <TextInput
                style={styles.input}
                placeholder="Max Incline (%)"
                keyboardType="numeric"
                value={maxIncline}
                onChangeText={setMaxIncline}
            />
            <TextInput
                style={styles.input}
                placeholder="Number of Intervals"
                keyboardType="numeric"
                value={numIntervals}
                onChangeText={setNumIntervals}
            />
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />

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