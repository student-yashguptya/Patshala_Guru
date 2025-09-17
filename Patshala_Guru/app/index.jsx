import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "./../constants/Colors";
import React from "react";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useContext } from "react";
import { UserDetailContext } from "./../context/UserDetailContext";
import { useEffect } from "react";



export default function Index() {

  const router = useRouter();
   const {userDetail, setUserDetail} = useContext(UserDetailContext);


  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User is signed in:", user);
      const result = await getDoc(doc(db, "users", user?.email));
      setUserDetail(result.data());
      router.replace("/(tabs)/home"); // 👈 or any other route
    } else {
      console.log("No user is signed in.");
    }
  });

  return unsubscribe;
}, []);

  return (
    <View
      style={styles.container1}
    >
      <Image
        source={require("./../assets/images/Landing screen.png")}
        style={styles.image}
        />

        <View
        style={styles.container2}>
          <Text
            style={styles.welcomeText}>
            Welcome to StudyGenie
          </Text>
          <Text
            style={styles.descriptionText}>
            🎓 Your one-stop solution for all educational needs 📚✨
          </Text>

          <TouchableOpacity
          onPress={() => router.push("/auth/signup")}
            style={styles.getStartedButton}>
            <Text
              style={styles.getStartedButtonText}
            >Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={() => router.push("/auth/signin")}
            style={styles.alreadyHaveAccountText}>  
            <Text
              style={styles.signInText}>
               Already have an account? <Text style={styles.signInBold}>Sign In</Text>
            </Text>
            </TouchableOpacity>
        </View>
    </View>

  );
}



const styles = StyleSheet.create({
  container1: {
    //flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 400,
    marginTop: 50,
    resizeMode: "contain",
  },
  container2: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.primary,
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  welcomeText: {
    fontSize: 35,
    marginBottom: 10,
    fontFamily: "Outfit-Bold",
    color: Colors.white,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 20,
    fontFamily: "Outfit",
    color: Colors.white,
    textAlign: "center",
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 20,
  },
  getStartedButtonText: {
    color: Colors.black,
    fontSize: 20,
    fontFamily: "Outfit-Bold",
  },
  alreadyHaveAccountText: {
    color: Colors.white,
    textAlign: "center",
    marginTop: 2,
    
  },
  signInText: {
    color: Colors.white,
    textAlign: "center",
    fontFamily: "Outfit-Regular",
  },
   signInBold: {
    color: Colors.black,
    fontFamily: "Outfit-Bold",
    textDecorationLine: "underline",
  },
})