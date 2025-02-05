import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Image, ActivityIndicator } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { initializeApp } from '@firebase/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2fCoot17wtjtOwW99_LJ4NsILZeewF54",
  authDomain: "pulse-switch-application.firebaseapp.com",
  projectId: "pulse-switch-application",
  storageBucket: "pulse-switch-application.firebasestorage.app",
  messagingSenderId: "884714523977",
  appId: "1:884714523977:web:0a7464befbc30137da1e98",
  measurementId: "G-MNZFKGX2SJ"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Import Screens
import HomeScreen from './screens/home';
import WorkoutScreen from './screens/workout';
import JournalScreen from './screens/journal';
import AdviceScreen from './screens/advice';
import AccountScreen from './screens/account';
import AuthScreen from './screens/auth'; // Authentication screen (Login/Signup)

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: '',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Workout':
              iconName = 'dumbbell';
              break;
            case 'Journal':
              iconName = 'notebook';
              break;
            case 'Advice':
              iconName = 'lightbulb-on-outline';
              break;
            case 'Account':
              iconName = 'account-circle';
              break;
            default:
              iconName = 'circle';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'lightgreen',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Advice" component={AdviceScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="green" style={{ flex: 1, justifyContent: 'center' }} />;
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


