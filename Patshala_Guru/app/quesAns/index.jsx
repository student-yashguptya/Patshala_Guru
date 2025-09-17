import { View, Text, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import { useState } from 'react';

export default function QuestionAnswers() {
  const router = useRouter();
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const qaList = course?.qa;
  const [selected, setSelected] = useState();

  const OnQuestionSelect = (index) => {
    setSelected(selected === index ? null : index);
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: Colors.background || '#fff' }}>
      <Pressable style={{ marginRight: 10, marginTop: 20 }} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>

      <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 25, marginTop: 10 }}>
        Question & Answers
      </Text>

      <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, marginTop: 10 }}>
        {course?.courseTitle}
      </Text>

      <FlatList
        data={qaList}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => OnQuestionSelect(index)}
            style={{
              backgroundColor: Colors.white,
              padding: 15,
              marginTop: 15,
              borderRadius: 15,
              elevation: 3,
            }}
          >
            <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 20 }}>
              Question: {item?.question}
            </Text>
            {selected === index && (
              <View style={{ borderTopWidth: 1, marginTop: 10, paddingTop: 10 }}>
                <Text
                  style={{
                    fontFamily: 'Outfit-Regular',
                    fontSize: 18,
                    color: Colors.Green,
                  }}
                >
                  Answer: {item?.answer}
                </Text>
              </View>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}
