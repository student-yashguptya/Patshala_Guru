import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import React, { useState, useContext } from 'react';
import Colors from '@/constants/Colors';
import { TextInput } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './../../config/firebaseConfig';
import { UserDetailContext } from './../../context/UserDetailContext';

export default function SignUp() {
  const router = useRouter();
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const { setUserDetail } = useContext(UserDetailContext);

  const CreateNewAccount = async () => {
    if (!Name || !Email || !Password) {
      Alert.alert('Incomplete Info', 'Please fill in all fields.');
      return;
    }

    try {
      // Create user in Firebase Auth
      const resp = await createUserWithEmailAndPassword(auth, Email, Password);
      const user = resp.user;

      // Update Firebase display name (optional)
      await updateProfile(user, { displayName: Name });

      // Prepare user data
      const userData = {
        Name,
        Email,
        member: false,
        uid: user.uid,
        createdAt: new Date(),
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), userData);
      setUserDetail(userData);

      console.log('✅ User created & saved successfully');
      router.replace('/(tabs)/home');
    } catch (e) {
      console.error('❌ Error during signup:', e);
      Alert.alert('Signup Error', e.message || 'Something went wrong.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('./../../assets/images/LOGO Image.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.description}>Create a new account to get started</Text>

        <TextInput
          placeholder="Enter your Name"
          value={Name}
          onChangeText={setName}
          style={styles.inputText}
        />
        <TextInput
          placeholder="Enter your Email"
          value={Email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.inputText}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Create a Password"
          value={Password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputText}
        />

        <TouchableOpacity onPress={CreateNewAccount} style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/auth/signin')}
          style={styles.alreadyHaveAccountText}
        >
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text style={styles.signInBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 50,
    backgroundColor: Colors.white,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Outfit-Bold',
    marginTop: 20,
  },
  description: {
    fontSize: 20,
    fontFamily: 'Outfit-Regular',
    color: '#666',
    marginTop: 10,
  },
  inputText: {
    width: '80%',
    height: 50,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    fontFamily: 'Outfit-Regular',
  },
  signupButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 70,
    width: '80%',
  },
  signupButtonText: {
    color: Colors.black,
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
  },
  alreadyHaveAccountText: {
    marginTop: 20,
  },
  signInText: {
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Outfit-Bold',
  },
  signInBold: {
    color: Colors.primary,
    fontFamily: 'Outfit-Bold',
    textDecorationLine: 'underline',
  },
});
