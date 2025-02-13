import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';

const TreadmillWorkout = () => {
    const [speed, setSpeed] = useState('');
    const [incline, setIncline] = useState('');
    const [weight, setWeight] = useState('');
    const [results, setResults] = useState(null);

    const calculateCaloriesPerMinute = () => {
        Keyboard.dismiss();

        const speedValue = parseFloat(speed);
        const inclineValue = parseFloat(incline);
        const weightValue = parseFloat(weight);

        if (isNaN(speedValue) || isNaN(inclineValue) || isNaN(weightValue)) {
            alert("Please enter valid numbers for all fields.");
            return;
        }

        const speed_m_min = speedValue * 26.8;
        let vo2;
        if (speedValue <= 3.7) {
            vo2 = (0.1 * speed_m_min) + (1.8 * speed_m_min * (inclineValue / 100)) + 3.5;
        } else {
            vo2 = (0.2 * speed_m_min) + (0.9 * speed_m_min * (inclineValue / 100)) + 3.5;
        }

        const mets = vo2 / 3.5;
        const caloriesPerMin = (mets * 3.5 * weightValue) / 200;

        setResults({
            vo2: vo2.toFixed(2),
            mets: mets.toFixed(2),
            caloriesPerMin: caloriesPerMin.toFixed(2)
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Treadmill Workout Calculator</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Speed (mph)"
                keyboardType="numeric"
                value={speed}
                onChangeText={setSpeed}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Incline (%)"
                keyboardType="numeric"
                value={incline}
                onChangeText={setIncline}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Weight (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />

            <TouchableOpacity style={styles.button} onPress={calculateCaloriesPerMinute}>
                <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>

            {results && (
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultText}>VO₂: {results.vo2} ml/kg/min</Text>
                    <Text style={styles.resultText}>METs: {results.mets}</Text>
                    <Text style={styles.resultText}>Calories per Minute: {results.caloriesPerMin} kcal/min</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: '80%',
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
    resultsContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        width: '80%',
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
    },
});

export default TreadmillWorkout;
