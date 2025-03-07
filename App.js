import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { initializeApp } from '@firebase/app';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { 
  FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_PROJECT_ID, 
  FIREBASE_STORAGE_BUCKET, 
  FIREBASE_MESSAGING_SENDER_ID, 
  FIREBASE_APP_ID, 
  FIREBASE_MEASUREMENT_ID 
} from '@env';

// ✅ Firebase Configuration
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

// ✅ Import Screens
import HomeScreen from './screens/home';
import WorkoutScreen from './screens/workout';
import TreadmillWorkout from './screens/workouts/treadmillworkout';
import ExecuteTreadmillWorkout from './screens/workouts/executetreadmillworkout'; 
import JournalScreen from './screens/journal';
import AdviceScreen from './screens/advice';
import AccountScreen from './screens/account';
import AuthScreen from './screens/auth'; 
import AboutPulseSwitch from './screens/home_screens/aboutpulseswitch';
import DiaryScreen from './screens/journal_screens/diary';
import NotesScreen from './screens/journal_screens/notes';
import EditNoteScreen from './screens/journal_screens/editnote';
import EditDiaryEntryScreen from './screens/journal_screens/editdiary';
import SplashScreen from './screens/splashscreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ✅ Define GradientHeader before using it
const GradientHeader = () => (
  <LinearGradient
    colors={['#243B55', '#f0f0f0']}
    style={StyleSheet.absoluteFill}
  />
);


const gradientHeaderOptions = {
  headerBackground: () => <GradientHeader />,
  headerTintColor: '#fff', // Keeps back button & icons white

  headerTitle: '', // Ensures no text in the center

  headerRight: () => ( // 👈 Places logo in the right corner
    <Image
      source={require('./assets/logonew.png')} // ✅ Make sure the path is correct
      style={{
        width: 80, // Adjust width
        height: 35, // Adjust height
        resizeMode: 'contain', // Prevents stretching
        marginRight: -10, // Moves it away from the edge
        marginTop: -20
      }}
    />
  ),

  headerTitleAlign: 'left', // Optional: Aligns any future text to the left
};


// ✅ Stack Navigator for Home
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ ...gradientHeaderOptions }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: true }} />
    <Stack.Screen name="AboutPulseSwitch" component={AboutPulseSwitch} />
  </Stack.Navigator>
);

// ✅ Stack Navigator for Workouts
const WorkoutStack = () => (
  <Stack.Navigator screenOptions={{ ...gradientHeaderOptions }}>
    <Stack.Screen name="WorkoutMain" component={WorkoutScreen} options={{ headerShown: true }} />
    <Stack.Screen name="TreadmillWorkout" component={TreadmillWorkout} />
    <Stack.Screen name="ExecuteTreadmillWorkout" component={ExecuteTreadmillWorkout} />
  </Stack.Navigator>
);

const JournalStack = () => (
  <Stack.Navigator screenOptions={{ ...gradientHeaderOptions }}>
    <Stack.Screen name="JournalMain" component={JournalScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Diary" component={DiaryScreen} />
    <Stack.Screen name="Notes" component={NotesScreen} />
    <Stack.Screen name="EditNote" component={EditNoteScreen} />
    <Stack.Screen name="EditDiaryEntry" component={EditDiaryEntryScreen} />
  </Stack.Navigator>
);

const AdviceStack = () => (
  <Stack.Navigator screenOptions={{ ...gradientHeaderOptions }}>
    <Stack.Screen name="AdviceMain" component={AdviceScreen} options={{ headerShown: true }} />
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator screenOptions={{ ...gradientHeaderOptions }}>
    <Stack.Screen name="AccountMain" component={AccountScreen} options={{ headerShown: true }} />
  </Stack.Navigator>
);

// ✅ Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: '',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = 'home'; break;
            case 'Workout': iconName = 'dumbbell'; break;
            case 'Journal': iconName = 'notebook'; break;
            case 'Advice': iconName = 'lightbulb-on-outline'; break;
            case 'Account': iconName = 'account-circle'; break;
            default: iconName = 'circle';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'lightgreen',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Workout" component={WorkoutStack} options={{ headerShown: false }} />
      <Tab.Screen name="Journal" component={JournalStack} options={{ headerShown: false }} />
      <Tab.Screen name="Advice" component={AdviceStack} options={{ headerShown: false }} />
      <Tab.Screen name="Account" component={AccountStack} options={{ headerShown: false }}/>
      
    </Tab.Navigator>
  );
}

// ✅ Main App Component with Splash Screen
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => {
      unsubscribe();
      clearTimeout(splashTimer);
    };
  }, []);

  if (loading || showSplash) {
    return <SplashScreen />;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="MainTabs" component={MainTabs} />
          ) : (
            <Stack.Screen name="Auth" component={AuthScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}



