import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from '@firebase/firestore';
import { 
  FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_PROJECT_ID, 
  FIREBASE_STORAGE_BUCKET, 
  FIREBASE_MESSAGING_SENDER_ID, 
  FIREBASE_APP_ID, 
  FIREBASE_MEASUREMENT_ID 
} from '@env';

// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AuthScreen = ({ email, setEmail, password, setPassword, username, setUsername, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.container}>
      {/* Top Half - Green Background */}
      <View style={styles.topHalf}>
        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
      </View>

      {/* Bottom Half - Off-White Background */}
      <View style={styles.bottomHalf}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />
        </View>

        {!isLogin && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity onPress={handleAuthentication} style={styles.authButton}>
          <Text style={styles.authButtonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.toggleText}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimerNotice}>PulseSwitch 2025</Text>

      </View>
    </View>
  );
};

export default App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [fetchedUsername, setFetchedUsername] = useState('');

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setFetchedUsername(userDoc.data().username);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (user) {
        console.log('User logged out successfully!');
        await signOut(auth);
        setUser(null);
        setFetchedUsername('');
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Store username in Firestore
          await setDoc(doc(db, 'users', user.uid), {
            username: username,
            email: email,
          });

          console.log('User created successfully and username stored!');
          setFetchedUsername(username);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <AuthScreen
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      username={username}
      setUsername={setUsername}
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      handleAuthentication={handleAuthentication}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
    backgroundColor: '#2ecc71', // Green
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Off-White/Grey
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'AvenirNext-DemiBold',
  },
  inputContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 3, // Shadow effect
    fontFamily: 'AvenirNext-DemiBold',
  },
  input: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'AvenirNext-DemiBold',
  },
  authButton: {
    width: '90%',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'AvenirNext-DemiBold',
  },
  toggleText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'AvenirNext-DemiBold',
  },
  disclaimerNotice: {
    color: 808080,
    fontSize: 10,
    marginTop: 180
  }
});
