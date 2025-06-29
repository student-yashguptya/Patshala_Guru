import { View, Text, Pressable, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import Colors from '../../constants/Colors';
import Button from '../../Shared/button';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

export default function Quiz() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const quiz = course?.quiz;
  const [selected, setSelected] = useState();
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetPregress = (currentIndex) => {
    return currentIndex / quiz?.length;
  };

  const onOptionSelection = (selectedChoice) => {
    setResult((prev) => ({
      ...prev,
      [currentIndex]: {
        userChoice: selectedChoice,
        isCorrect: quiz[currentIndex]?.correctAns === selectedChoice,
        question: quiz[currentIndex]?.question,
        correctAns: quiz[currentIndex]?.correctAns,
      },
    }));
  };

  const onQuizFinish = async () => {
    try {
      setLoading(true);

      if (!course?.DocID) {
        console.warn('Course DocID missing. Cannot update quiz result.');
        return;
      }

      await updateDoc(doc(db, 'Courses', course.DocID), {
        quizResult: result,
      });

      router.push({
        pathname: 'quiz/summary',
        params: { result: JSON.stringify(result) },
      });
    } catch (error) {
      console.error('Error saving quiz results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 25, width: '100%', flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable style={{ marginRight: 10 }} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 20 }}>
          {currentIndex + 1} of {quiz?.length}
        </Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Progress.Bar
          progress={GetPregress(currentIndex)}
          width={Dimensions.get('window').width * 0.85}
          height={10}
        />
      </View>

      <View
        style={{
          padding: 25,
          backgroundColor: Colors.white,
          marginTop: 30,
          height: Dimensions.get('screen').height * 0.55,
          elevation: 5,
          borderRadius: 30,
        }}
      >
        <Text
          style={{
            fontFamily: 'Outfit-Bold',
            fontSize: 22,
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          {quiz[currentIndex].question}
        </Text>

        {/* Scrollable Options */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {quiz[currentIndex]?.options.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelected(index);
                onOptionSelection(item);
              }}
              style={{
                padding: 15,
                borderWidth: 1,
                borderRadius: 15,
                marginTop: 10,
                backgroundColor: selected === index ? Colors.Green : 'white',
                borderColor: Colors.black,
              }}
            >
              <Text style={{ fontSize: 18, fontFamily: 'Outfit' }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ marginTop: 20 }}>
        {selected?.toString() && quiz?.length - 1 > currentIndex && (
          <Button
            text={'Next'}
            onPress={() => {
              setCurrentIndex(currentIndex + 1);
              setSelected(null);
            }}
          />
        )}

        {selected?.toString() && quiz?.length - 1 === currentIndex && (
          <Button text={'Finish'} loading={loading} onPress={onQuizFinish} />
        )}
      </View>
    </View>
  );
}
