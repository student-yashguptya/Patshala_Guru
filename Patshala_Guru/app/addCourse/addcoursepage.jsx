// Fixed AddCoursePage.js - Main component with better error handling
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

  const bannerKeys = Object.keys(imageAssets);

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

  // Helper function to extract and validate JSON from response
  const extractValidJSON = (rawText) => {
    try {
      // First, try to parse the entire response as JSON
      return JSON.parse(rawText);
    } catch (e) {
      // If that fails, try to extract JSON from within the text
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
        throw new Error('No valid JSON found in response');
      }
      
      const jsonString = rawText.slice(jsonStart, jsonEnd + 1);
      
      // Validate the JSON by attempting to parse it
      const parsed = JSON.parse(jsonString);
      
      // Additional validation to ensure it has the expected structure
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
        generationConfig: {
          maxOutputTokens: 8192, // Increase token limit for complete response
          temperature: 0.7,
        }
      };

      console.log('Sending request to Gemini API...');
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Full Gemini Response:', JSON.stringify(data, null, 2));

      // Check if response was blocked or has safety issues
      if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error('Response was blocked due to safety concerns. Try modifying your topic selection.');
      }

      if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
        throw new Error('Response was truncated due to length. Try selecting fewer topics.');
      }

      const rawText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.text ||
        '';

      if (!rawText.trim()) {
        throw new Error('Empty response from Gemini API');
      }

      console.log('Raw response text:', rawText);
      setCourseContent(rawText.trim());

      // Parse and validate JSON with better error handling
      let parsed;
      try {
        parsed = extractValidJSON(rawText);
        console.log('Parsed JSON:', JSON.stringify(parsed, null, 2));
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError);
        console.error('Raw text that failed to parse:', rawText);
        Alert.alert(
          'Parsing Error', 
          `Failed to parse the generated course content. The response might be incomplete or malformed. Please try again with fewer topics.\n\nError: ${parseError.message}`
        );
        setLoading(false);
        return;
      }

      // Validate the structure
      if (!parsed.courses || !Array.isArray(parsed.courses) || parsed.courses.length === 0) {
        throw new Error('Invalid course structure - no courses found in response');
      }

      // Save courses to Firestore
      const courseArray = parsed.courses;
      console.log(`Saving ${courseArray.length} courses to Firestore...`);
      
      for (const course of courseArray) {
        const DocID = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Validate required fields
        if (!course.courseTitle) {
          console.warn('Course missing title, skipping:', course);
          continue;
        }
        
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
          DocID: DocID
        });
        
        console.log(`Saved course: ${course.courseTitle} with ID: ${DocID}`);
      }

      Alert.alert('Success', `${courseArray.length} course(s) successfully created and saved!`);
      router.push('/(tabs)/home');
      
    } catch (error) {
      console.error('Course Generation Error:', error);
      Alert.alert(
        'Error', 
        `Failed to generate or save course: ${error.message}\n\nPlease try again with different topics or fewer selections.`
      );
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
            <Text style={styles.debugText}>
              Debug: Course content generated successfully
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
});
