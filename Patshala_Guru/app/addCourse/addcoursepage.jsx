import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../constants/Colors';
import Button from '../../Shared/button';
import { generateCourseOutline } from '../../config/geminiApi';

const GEMINI_API_KEY = 'AIzaSyDMvaJmysUMCMvA51vTxAeFZkYk9PrzWwo'; // Replace with your actual key

export default function AddCoursePage() {
  const [loading, setLoading] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseOutline, setCourseOutline] = useState('');

  const onGenerateTopic = async () => {
    if (!courseName.trim()) return;
    setLoading(true);
    const result = await generateCourseOutline(courseName, GEMINI_API_KEY);
    if (result) {
      setCourseOutline(result);
    } else {
      setCourseOutline('Failed to generate course outline. Please try again.');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Course</Text>
      <Text style={styles.subtitle}>What you want to learn today?</Text>
      <Text style={styles.description}>
        Please enter the course name you want to create. This will help us to create a better course for you.
        (Ex: Learn Python, Digital Marketing, 10th Science Chapters, etc.)
      </Text>

      <TextInput
        placeholder='(Ex: Learn Python, Digital Marketing...)'
        style={styles.input}
        numberOfLines={4}
        multiline={true}
        value={courseName}
        onChangeText={setCourseName}
      />

      <Button text={'Create Course'} type='outline' onPress={onGenerateTopic} loading={loading} />

      {courseOutline.length > 0 && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{courseOutline}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.white,
    flexGrow: 1,
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
    alignItems: 'flex-start',
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
  },
  resultText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    color: Colors.black,
  },
});
