import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/logonew.png')} style={styles.logo} />
            <Text style={styles.footerText1}></Text>
            <Text style={styles.footerText2}>Pulse Switch 2025</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#243B55',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    footerText1: {
        position: 'absolute',
        bottom: 100,
        color: '#ffffff',
        fontSize: 14,
    },
    footerText2: {
        position: 'absolute',
        bottom: 50,
        color: '#ffffff',
        fontSize: 14,
    },
});
