import { View, Text, Image, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { useEffect, useState } from 'react';
import Button from '../../Shared/button';

export default function QuizSummary() {
  const { result } = useLocalSearchParams();
  const QuizResult = JSON.parse(result);
  const [correctAns, setCorrectAns] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(0);

  useEffect(() => {
    QuizResult && calculateResult();
  }, [QuizResult]);

  const calculateResult = () => {
    if (QuizResult !== undefined) {
      const correctAnswers = Object.entries(QuizResult)?.filter(
        ([_, value]) => value?.isCorrect === true
      );
      const total = Object.keys(QuizResult).length;

      setCorrectAns(correctAnswers.length);
      setTotalQuestion(total);
    }
  };

  const getPercentageMark = () => {
    return totalQuestion === 0 ? 0 : ((correctAns / totalQuestion) * 100).toFixed(0);
  };

  const incorrectAns = totalQuestion - correctAns;
  const router = useRouter();

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text
        style={{
          marginTop: 30,
          textAlign: 'center',
          fontFamily: 'Outfit-Bold',
          fontSize: 30,
        }}
      >
        Quiz Summary
      </Text>

      <View
        style={{
          backgroundColor: Colors.white,
          padding: 20,
          borderRadius: 50,
          marginHorizontal: 30,
          alignItems: 'center',
          marginTop: 60,
          elevation: 4,
        }}
      >
        <Image
          source={require('./../../assets/images/trophy.png')}
          style={{
            width: 200,
            height: 200,
            marginTop: -100,
            resizeMode: 'contain',
          }}
        />

        <Text
          style={{
            fontFamily: 'Outfit-Bold',
            fontSize: 26,
            marginTop: 10,
            textAlign: 'center',
          }}
        >
          {getPercentageMark() > 60 ? '🎉 Congratulations!' : '⚠️ Try Again!'}
        </Text>

        <Text
          style={{
            fontFamily: 'Outfit-SemiBold',
            fontSize: 17,
            marginTop: 10,
            color: Colors.gray,
            textAlign: 'center',
          }}
        >
          You answered {getPercentageMark()}% correctly.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 30,
            width: '100%',
          }}
        >
          <View style={{ padding: 7 }}>
            <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 18 }}>
              Q: {totalQuestion}
            </Text>
          </View>

          <View style={{ padding: 7 }}>
            <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 18 }}>
              ✅: {correctAns}
            </Text>
          </View>

          <View style={{ padding: 7 }}>
            <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 18 }}>
              ❌: {incorrectAns}
            </Text>
          </View>
        </View>
      </View>
       <View
       style={{marginTop:20}}
       >
        <Button 
       text={'Back to Home'}
       onPress={()=>router.replace('/(tabs)/home')}
       />
       </View>

       <View
       style={{
        marginTop:25,
        
        flex:1
       }}
       >
        <Text
        style={{
            fontFamily:"Outfit-Bold",
            fontSize:25
        }}
        >Summary:</Text>
       <FlatList
       showsVerticalScrollIndicator={false}
         data={Object.entries(QuizResult)}
         keyExtractor={([key], index) => key || index.toString()}
         renderItem={({ item }) => {
          const quizItem = item[1];
          return (
          <View
          style={{
            padding:15,
            borderWidth:1,
            marginTop:5,
            borderRadius:15,
            backgroundColor:quizItem?.isCorrect==true?Colors.Green:Colors.error

          }}
          >
          <Text
          style={{
            fontFamily:"Outfit",
            fontSize:20
          }}
          >{quizItem.question}</Text>
          <Text
          style={{fontFamily:'Outfit', fontSize:15}}
          >Ans: {quizItem?.correctAns}</Text>
          </View>
          );
          }}
        />
        </View>

    </View>
  );
}
