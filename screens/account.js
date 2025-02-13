import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from '@firebase/firestore';
import { getAuth, signOut, onAuthStateChanged } from '@firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Function to generate a random color
const getRandomColor = () => {
  const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#6A5ACD', '#FF4500', '#1E90FF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const AccountScreen = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [editing, setEditing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [avatarColor, setAvatarColor] = useState(getRandomColor()); // Set random color

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditUsername = async () => {
    if (newUsername.trim() === '') return;
    await updateDoc(doc(db, 'users', user.uid), { username: newUsername });
    setUsername(newUsername);
    setNewUsername('');
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* Profile Header Row */}
      <View style={styles.headerRow}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}> 
          <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.usernameText} numberOfLines={1} ellipsizeMode="tail">
          {username}
        </Text>
        <TouchableOpacity onPress={() => setSettingsOpen(!settingsOpen)} style={styles.settingsButton}>
          <Icon name="cog" size={35} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Settings Dropdown */}
      {settingsOpen && (
        <View style={styles.settingsContainer}>
          {editing ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Enter new username"
              />
              <Button title="Save" onPress={handleEditUsername} color="green" />
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)} style={styles.optionButton}>
              <Text style={styles.optionText}>Edit Username</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => signOut(auth)} style={styles.optionButton}>
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  settingsButton: {
    padding: 5,
  },
  settingsContainer: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#777',
    marginRight: 10,
    padding: 5,
    flex: 1,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
});

export default AccountScreen;




