import { StyleSheet, Image, View, Text, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { TextInput } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from './../../config/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { useContext } from 'react'
import { UserDetailContext } from './../../context/UserDetailContext'

export default function SignIn() {

  const router=useRouter();
  const [Email, setEmail] = useState();
  const [Password, setPassword] = useState();
  const {userDetail, setUserDetail} = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const onSignInClick = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, Email, Password)
    .then(async(resp)=>{
      console.log('User signed in successfully:', resp.user);
      await getUserDetail();
      setLoading(false);
      router.replace('/(tabs)/home');
    })
    .catch(e => {
      console.log(e);
      setLoading(false);
      ToastAndroid.show('Incorrect email or password:', ToastAndroid.BOTTOM)
    })
  }

  const getUserDetail = async() => {
    const result = await getDoc(doc(db, 'users',Email));
    console.log(result.data());
    setUserDetail(result.data());
  }

  return (
    <View style={styles.container}>
     <Image source={require('./../../assets/images/LOGO Image.png')}
     style={styles.logo} />


      <Text style={styles.title}>
        Sign In
      </Text>
      <Text style={styles.description}>
       Welcome back
      </Text>


        <TextInput
        placeholder='Enter your Email'
        value={Email}
        onChangeText={setEmail}
        style={styles.inputText}/>

        <TextInput
        placeholder='Enter Your Password'
        value={Password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.inputText}/>


        <TouchableOpacity
                  onPress={onSignInClick}
                  disabled={loading} 
                    style={styles.signupButton}
                    >
                      {!loading ?<Text
                      style={styles.signupButtonText}
                    >Sign In</Text> :
                            <ActivityIndicator size={'large'} color={Colors.white}/>
                      }
                  </TouchableOpacity>

        <TouchableOpacity
                  onPress={() => router.push("/auth/signup")}
                    style={styles.alreadyHaveAccountText}>  
                    <Text
                      style={styles.signInText}>
                       Don't have an account? <Text style={styles.signInBold}>Sign Up</Text>
                    </Text>
                    </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({

  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    backgroundColor: Colors.white,
   
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 30,
    fontFamily:'Outfit-Bold',
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
      alignItems: "center",
      marginTop: 70,
      width: '80%',
    },
    signupButtonText: {
      color: Colors.black,
      fontSize: 20,
      fontFamily: "Outfit-Bold",
    },
    alreadyHaveAccountText: {
      color: Colors.black,
      textAlign: "center",
      marginTop: 2,
    },
    signInText: {
      color: Colors.black,
      textAlign: "center",
      fontFamily: "Outfit-Bold",
    },
     signInBold: {
      color: Colors.primary,
      fontFamily: "Outfit-Bold",
      textDecorationLine: "underline",
    },

})

 //𝑷𝒂𝒕𝒔𝒉𝒂𝒍𝒂 𝑮𝒖𝒓𝒖 𝒊𝒔 𝒂 𝒑𝒍𝒂𝒕𝒇𝒐𝒓𝒎 𝒘𝒉𝒆𝒓𝒆 𝑺𝑻UDENT, TEACHER, PARENT can connect with each other.