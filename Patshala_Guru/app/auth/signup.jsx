import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { TextInput } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth ,db} from './../../config/firebaseConfig'
import { useContext } from 'react'
import { UserDetailContext } from './../../context/UserDetailContext'

export default function SignUp() {
  const router = useRouter();
  const [Name, setName] = useState('');
   const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');

    const{userDetail, setUserDetail} = useContext(UserDetailContext);

    const CreateNewAccount = () => {
      createUserWithEmailAndPassword(auth, Email, Password)
        .then(async(Resp) => {
          const user = Resp.user;
          console.log('User created successfully:', user);
          router.replace('/home');
          await SaveUser(user);
        })
        .catch(e => {
          console.error('Error creating user:', e);
          alert(e.message);
        })
    }

    const SaveUser= async(user) => {

      const data={
        Name: Name,
        Email: Email, 
        member:false,
        uid: user?.uid,
      }


      await setDoc(doc(db, "users", Email),data )

      setUserDetail(data);
    }

  return (
    <View style={styles.container}>
     <Image source={require('./../../assets/images/LOGO Image.png')}
     style={styles.logo} />


      <Text style={styles.title}>
        Sign Up
      </Text>
      <Text style={styles.description}>
      Create a new account to get started
      </Text>


        <TextInput
  placeholder='Enter your Name'
  value={Name}
  onChangeText={setName}

  style={styles.inputText}
/>

<TextInput
  placeholder='Enter your Email'
  value={Email}
  onChangeText={setEmail}
  keyboardType='email-address'
  style={styles.inputText}
/>

<TextInput
  placeholder='Create a Password'
  value={Password}
  onChangeText={setPassword}
  secureTextEntry={true}
  style={styles.inputText}
/>

{/* <TextInput
  placeholder='Confirm Your Password'
  secureTextEntry={true}
  style={styles.inputText}
/> */}


        <TouchableOpacity
                  onPress={() =>{CreateNewAccount()}}
                    style={styles.signupButton}>
                    <Text
                      style={styles.signupButtonText}
                    >Create Account</Text>
                  </TouchableOpacity>

        <TouchableOpacity
                  onPress={() => router.push("/auth/signin")}
                    style={styles.alreadyHaveAccountText}>  
                    <Text
                      style={styles.signInText}>
                       Already have an account?? <Text style={styles.signInBold}>Sign In</Text>
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