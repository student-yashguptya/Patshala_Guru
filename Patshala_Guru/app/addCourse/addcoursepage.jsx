import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Colors from '../../constants/Colors';
import Button from '../../Shared/button';
import { prompt } from '@/constants/Prompts';
import { generateCourseOutline } from '../../config/geminiApi';
import { db } from './../../config/firebaseConfig';
import { UserDetailContext } from './../../context/UserDetailContext';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { imageAssets } from '../../constants/Option';


const GEMINI_API_KEY = 'AIzaSyDMvaJmysUMCMvA51vTxAeFZkYk9PrzWwo';

export default function AddCoursePage() {
  const [loading, setLoading] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopics] = useState([]);
  const [courseContent, setCourseContent] = useState('');
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const bannerKeys = Object.keys(imageAssets); // ['banner1.png', 'banner2.png']


  const onGenerateTopic = async () => {
    if (!courseName.trim()) return;
    setLoading(true);
    try {
      const result = await generateCourseOutline(courseName, GEMINI_API_KEY);
      let parsedTopics = [];
      try {
        parsedTopics = JSON.parse(result);
        if (!Array.isArray(parsedTopics)) throw new Error();
      } catch {
        parsedTopics = result
          ? result
              .split('\n')
              .filter(Boolean)
              .map(item => item.replace(/^[\s*-]+\s*/, '').replace(/["']/g, ''))
          : [];
      }
      setTopics(parsedTopics);
    } catch (error) {
      console.error('Topic Generation Failed:', error);
      Alert.alert('Error', 'Failed to generate topics');
    }
    setLoading(false);
  };

  const onTopicSelect = topic => {
    const isAlreadyExist = selectedTopic.includes(topic);
    if (!isAlreadyExist) {
      setSelectedTopics(prev => [...prev, topic]);
    } else {
      const updated = selectedTopic.filter(item => item !== topic);
      setSelectedTopics(updated);
    }
  };

  const isTopicSelected = topic => {
    return selectedTopic.includes(topic);
  };

  const onGenerateCourse = async () => {
    if (selectedTopic.length === 0) return;
    setLoading(true);
    try {
      const topicsAsString = selectedTopic.join(', ');
      const coursePrompt = `${topicsAsString}\n${prompt.COURSE}`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      const body = {
        contents: [{ parts: [{ text: coursePrompt }] }],
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const rawText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.text ||
        '';

      if (!rawText.trim()) throw new Error('Empty or invalid Gemini response');
      setCourseContent(rawText.trim());

      // Parse JSON
     let parsed;
try {
  const jsonStart = rawText.indexOf('{');
  const jsonEnd = rawText.lastIndexOf('}');
  const jsonString = rawText.slice(jsonStart, jsonEnd + 1);

  parsed = JSON.parse(jsonString);
} catch (err) {
  console.error('Parsing error:', err, rawText);
  Alert.alert('Error', 'Failed to parse course content JSON. Try regenerating.');
  setLoading(false);
  return;
}


      const courseArray = parsed?.courses || [];
      for (const course of courseArray) {
        const DocID=Date.now().toString()
       await setDoc(doc(db, 'Courses', DocID), {
       courseTitle: course.courseTitle,
       description: course.description,
       banner_image: course.banner_image ?? bannerKeys[Math.floor(Math.random() * bannerKeys.length)],
       category: course.category ?? 'Tech & Coding', // default fallback
       createdOn: new Date(),
       createdBy: userDetail?.Email ?? 'anonymous@unknown.com',
       chapters: course.chapters ?? [],
       quiz: course.quiz ?? [],
       flashcards: course.flashcards ?? [],
       qa: course.qa ?? [],
       DocID: DocID
     });

    }

      Alert.alert('Success', 'Course(s) saved to Firestore');
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Course Generation or Save Failed:', error);
      Alert.alert('Error', 'Something went wrong while generating or saving the course.');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Course</Text>
      <Text style={styles.subtitle}>What you want to learn today?</Text>
      <Text style={styles.description}>
        Please enter the course name you want to create. This will help us to
        create a better course for you. (Ex: Learn Python, Digital Marketing,
        10th Science Chapters, etc.)
      </Text>

      <TextInput
        placeholder='(Ex: Learn Python, Digital Marketing ,10th Science Chapters, etc.)'
        style={styles.input}
        numberOfLines={4}
        multiline={true}
        value={courseName}
        onChangeText={setCourseName}
      />

      <Button
        text={'Generate Topic'}
        type='outline'
        onPress={onGenerateTopic}
        loading={loading}
      />

      <View style={{ marginTop: 20 }}>
        <Text style={styles.topicHeader}>
          Select all topics which you want to add in the course
        </Text>

        {topics.length > 0 && (
          <View style={styles.topicsContainer}>
            {topics.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => onTopicSelect(item)}
                style={[
                  styles.topicPill,
                  {
                    backgroundColor: isTopicSelected(item)
                      ? Colors.primary
                      : Colors.lightGray,
                  },
                ]}
              >
                <Text
                  style={{
                    color: isTopicSelected(item)
                      ? Colors.white
                      : Colors.black,
                    fontFamily: 'Outfit-Medium',
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {selectedTopic.length > 0 && (
          <Button
            text='Generate Course'
            onPress={onGenerateCourse}
            loading={loading}
          />
        )}

        {courseContent && (
          <View style={{ marginBottom: 30 }}>
            {/* You can optionally display raw course content here for debugging */}
          </View>
        )}
      </View>
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
  topicHeader: {
    fontFamily: 'Outfit',
    fontSize: 20,
    marginBottom: 10,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicPill: {
    borderRadius: 100,
    borderWidth: 1,
    padding: 7,
    paddingHorizontal: 15,
    marginRight: 8,
  },
});
