import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from '@firebase/auth';
import { getFirestore, doc, getDoc } from '@firebase/firestore';
import { initializeApp } from '@firebase/app';
import { 
  FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_PROJECT_ID, 
  FIREBASE_STORAGE_BUCKET, 
  FIREBASE_MESSAGING_SENDER_ID, 
  FIREBASE_APP_ID, 
  FIREBASE_MEASUREMENT_ID 
} from '@env';

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// ✅ List of Motivational Quotes
const quotes = [
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { text: "Success isn’t given. It’s earned on the track, on the field, in the gym.", author: "Unknown" },
    { text: "If you want to be the best, you have to do things that other people aren’t willing to do.", author: "Michael Phelps" },
    { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
    { text: "Your body achieves what your mind believes.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('User');
    const [dailyGoal, setDailyGoal] = useState(500); // Default 500 kcal
    const [caloriesToday, setCaloriesToday] = useState(0);
    const [recentWorkout, setRecentWorkout] = useState(null);
    const [randomQuote, setRandomQuote] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                // ✅ Fetch username from Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUsername(userDoc.data().username);
                }

                // ✅ Load daily goal
                const storedGoal = await AsyncStorage.getItem('dailyGoal');
                if (storedGoal) setDailyGoal(parseInt(storedGoal));

                // ✅ Load calories burned today
                const storedCalories = await AsyncStorage.getItem('caloriesToday');
                if (storedCalories) setCaloriesToday(parseFloat(storedCalories));

                // ✅ Load last workout
                const lastWorkout = await AsyncStorage.getItem('lastWorkout');
                if (lastWorkout) setRecentWorkout(JSON.parse(lastWorkout));
            }
        };

        fetchUserData();

        // ✅ Pick a random motivational quote
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setRandomQuote(quotes[randomIndex]);
    }, []);

    // ✅ Edit Daily Goal
    const editGoal = async () => {
        Alert.prompt('Set New Daily Goal', 'Enter your new daily calorie goal:', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Save',
                onPress: async (value) => {
                    const newGoal = parseInt(value);
                    if (!isNaN(newGoal) && newGoal > 0) {
                        setDailyGoal(newGoal);
                        await AsyncStorage.setItem('dailyGoal', newGoal.toString());
                    } else {
                        Alert.alert('Invalid Input', 'Please enter a valid number.');
                    }
                },
            },
        ]);
    };

    // ✅ Calculate Progress
    const progress = Math.min(caloriesToday / dailyGoal, 1);

    // ✅ Get Days Ago for Recent Workout
    const getDaysAgo = (dateString) => {
        const today = new Date();
        const workoutDate = new Date(dateString);
        const diffTime = today - workoutDate;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
    };

    return (
        <View style={styles.container}>
            {/* ✅ Fixed White Banner at the Top */}
            <View style={styles.header} />

            {/* ✅ Main Content (Everything Below the Banner) */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* ✅ Welcome Message */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Welcome back, <Text style={styles.username}>{username}</Text> 👋</Text>
                </View>

                {/* ✅ Progress Section */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Today's Calories: {caloriesToday} / {dailyGoal} kcal</Text>
                    <ProgressBar progress={progress} color="#2ecc71" style={styles.progressBar} />
                    <TouchableOpacity style={styles.editButton} onPress={editGoal}>
                        <Text style={styles.editButtonText}>Edit Goal</Text>
                    </TouchableOpacity>
                </View>

                {/* ✅ Recent Activity */}
                {recentWorkout ? (
                    <View style={styles.recentWorkoutContainer}>
                        <Text style={styles.recentTitle}>Recent Activity</Text>
                        <Text style={styles.recentText}>
                            Last Workout: {recentWorkout.caloriesBurned} kcal burned, {recentWorkout.intervals} intervals
                        </Text>
                        <Text style={styles.recentText}>
                            {getDaysAgo(recentWorkout.date) === 0 ? 'Today' : `${getDaysAgo(recentWorkout.date)} days ago`}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.noActivity}>No recent workouts yet.</Text>
                )}

                {/* ✅ Motivational Quote */}
                {randomQuote && (
                    <View style={styles.quoteContainer}>
                        <Text style={styles.quoteText}>"{randomQuote.text}"</Text>
                        <Text style={styles.quoteAuthor}>- {randomQuote.author}</Text>
                    </View>
                )}

                {/* ✅ Learn More Button */}
                <TouchableOpacity style={styles.learnMoreButton} onPress={() => navigation.navigate('AboutPulseSwitch')}>
                    <Text style={styles.learnMoreButtonText}>Learn More About Pulse Switch</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        height: 100,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    welcomeContainer: {
        marginTop: 20,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    username: {
        color: '#2ecc71',
    },
    progressContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
        marginTop: 20,
    },
    progressText: {
        fontSize: 18,
        marginBottom: 10,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: '#2ecc71',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    quoteContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
        marginTop: 20,
    },
    quoteText: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    learnMoreButton: {
        backgroundColor: '#2ecc71',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 242,
    },
    learnMoreButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

