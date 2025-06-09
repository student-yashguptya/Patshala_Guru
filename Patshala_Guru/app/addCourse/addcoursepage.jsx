import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { useState } from 'react'  
import Button from '../../Shared/button' 


export default function AddCoursePage() {
  const [loading, setLoading] = useState(false);
  const onGenerateTopic = () => {
    // Logic to generate topics based on the course name
    console.log('Generating topics for the course...');
    // You can add your API call or logic here
  }
  return (
    <View
      style={styles.container}>
      <Text
      style={styles.title}
      >Create New Course</Text>

      <Text
      style={styles.subtitle}
      >What you want to learn today?</Text>

      <Text
      style={styles.description}
      >Please enter the course name you want to create. This will help us to create a better course for you (Ex: Learn Python, Digital Markitting, 10th Science Chapters, 12th Science Chapters, etc....).</Text>

      <TextInput placeholder='(Ex: Learn Python, Digital Markitting, 10th Science Chapters, 12th Science Chapters, etc....)'
      style={styles.input}
      numberOfLines={4}
      multiline={true}
      />

      <Button
      text={'Create Course'}
      type='outline'
      onPress={() => 
        onGenerateTopic()
      } loading={loading}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.white,
  },
  title: {
    fontFamily: 'Outfit-ExtraBold',
    fontSize: 30,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: 'Outfit-Medium',
    fontSize: 25,
    color: Colors.black,
  },
  description: {
    fontFamily: 'Outfit-Medium',
    fontSize: 15,
    color: Colors.gray,
    marginTop: 10,
  },
  input: {
    fontFamily: 'Outfit-Medium',
    fontSize: 15,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    height: 100,
    alignItems:'flex-start',
  },
})