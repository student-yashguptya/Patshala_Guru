import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import Button from '../../Shared/button';
import { prompt } from '@/constants/Prompts';
import { generateCourseOutline } from '../../config/geminiApi';
import { db } from './../../config/firebaseConfig';
import { UserDetailContext } from './../../context/UserDetailContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { imageAssets } from '../../constants/Option';

const GEMINI_API_KEY = 'AIzaSyDMvaJmysUMCMvA51vTxAeFZkYk9PrzWwo';

export default function AddCoursePage() {
  const [loading, setLoading] = useState(false);
  const [checkingMembership, setCheckingMembership] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopics] = useState([]);
  const [courseContent, setCourseContent] = useState('');
  const { userDetail } = useContext(UserDetailContext);
  const { justSubscribed } = useLocalSearchParams();
  const [hasTriggeredAutoTopicGen, setHasTriggeredAutoTopicGen] = useState(false);
  const router = useRouter();

  const bannerKeys = Object.keys(imageAssets);

  useEffect(() => {
  if (!userDetail?.Email) return;

  const unsub = onSnapshot(doc(db, 'Users', userDetail.Email), docSnap => {
    const data = docSnap.data();
    const isMember = data?.member === true;

    setCheckingMembership(false);

    if (isMember) {
      if (
        justSubscribed === 'true' &&
        !hasTriggeredAutoTopicGen &&
        courseName.trim()
      ) {
        setHasTriggeredAutoTopicGen(true);
        onGenerateTopic();
      }
    }
  });

  return () => unsub();
}, [userDetail?.Email, courseName, justSubscribed]);

  const onGenerateTopic = async () => {
    if (userDetail?.member === false) {
      router.push('/Subscription/subscriptionOption');
      return;
    }

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

  const isTopicSelected = topic => selectedTopic.includes(topic);

  const extractValidJSON = rawText => {
    try {
      return JSON.parse(rawText);
    } catch (e) {
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
        throw new Error('No valid JSON found in response');
      }
      const jsonString = rawText.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);
      if (!parsed.courses || !Array.isArray(parsed.courses)) {
        throw new Error('Invalid JSON structure - missing courses array');
      }
      return parsed;
    }
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
        generationConfig: { maxOutputTokens: 8192, temperature: 0.7 },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error('Response blocked due to safety concerns.');
      }
      if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
        throw new Error('Response too long. Try fewer topics.');
      }

      const rawText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.text ||
        '';

      if (!rawText.trim()) throw new Error('Empty response from Gemini API');
      setCourseContent(rawText.trim());

      let parsed;
      try {
        parsed = extractValidJSON(rawText);
      } catch (parseError) {
        Alert.alert(
          'Parsing Error',
          `Course content could not be parsed. Try again.\n\nError: ${parseError.message}`
        );
        setLoading(false);
        return;
      }

      if (!parsed.courses || parsed.courses.length === 0) {
        throw new Error('No valid courses found in response');
      }

      const courseArray = parsed.courses;
      for (const course of courseArray) {
        const DocID = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
        if (!course.courseTitle) continue;

        await setDoc(doc(db, 'Courses', DocID), {
          courseTitle: course.courseTitle,
          description: course.description || 'No description provided',
          difficulty: course.difficulty || 'Easy',
          banner_image: course.banner_image || bannerKeys[Math.floor(Math.random() * bannerKeys.length)],
          category: course.category || 'Tech & Coding',
          createdOn: new Date(),
          createdBy: userDetail?.Email || 'anonymous@unknown.com',
          chapters: course.chapters || [],
          quiz: course.quiz || [],
          flashcards: course.flashcards || [],
          qa: course.qa || [],
          DocID: DocID,
        });
      }

      Alert.alert('Success', `${courseArray.length} course(s) created!`);
      router.push('/(tabs)/home');
    } catch (error) {
      Alert.alert('Error', `Failed to generate/save course: ${error.message}`);
    }

    setLoading(false);
  };

  if (checkingMembership) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Checking membership...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Course</Text>
      <Text style={styles.subtitle}>What you want to learn today?</Text>
      <Text style={styles.description}>
        Enter the course name (Ex: Learn Python, Digital Marketing, etc.)
      </Text>

      <TextInput
        placeholder='(Ex: Learn Python, Digital Marketing, etc.)'
        style={styles.input}
        numberOfLines={4}
        multiline={true}
        value={courseName}
        onChangeText={setCourseName}
        autoFocus={!courseName}
      />

      <Button
        text={'Generate Topic'}
        type='outline'
        onPress={onGenerateTopic}
        loading={loading}
      />

      <View style={{ marginTop: 20 }}>
        <Text style={styles.topicHeader}>
          Select topics to include in the course
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
            <Text style={styles.debugText}>
              ✅ Debug: Course content generated successfully
            </Text>
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
  debugText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    marginTop: 10,
    color: Colors.primary,
  },
});
