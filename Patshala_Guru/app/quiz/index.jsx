import { View, Text, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import Colors from '../../constants/Colors';
import Button from '../../Shared/button';
import { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

export default function Quiz() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const router = useRouter();
  const [currentIndex,setCurrentIndex]=useState(0);
  const quiz=course?.quiz;
  const [selected , setSelected]=useState();
  const [result,setResult]=useState([]);
  const [loading, setLoading] = useState(false);

  const GetPregress=(currentIndex)=>{
    const perc=(currentIndex/quiz?.length);
    return perc;
  }

  const onOptionSelection=(selectedChoice)=>{
    setResult(prev=>({...prev,[currentIndex]:{userChoice:selectedChoice,isCorrect:quiz[currentIndex]?.correctAns==selectedChoice,
      question:quiz[currentIndex]?.question,
      correctAns:quiz[currentIndex]?.correctAns,
    }}));
    console.log(result);
  }

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

    console.log('Quiz results successfully saved to Firestore!');
    router.push({ pathname: "quiz/summary", params: { result: JSON.stringify(result) } });
  } catch (error) {
    console.error('Error saving quiz results:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={{ padding: 25, width: '100%' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'space-between'
        }}
      >
        <Pressable
          style={{ marginRight: 10 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text
          style={{
            fontFamily: 'Outfit-Bold',
            fontSize: 20,
          }}
        >
          {currentIndex+1} of {quiz?.length}
        </Text>
      </View>
      <View 
      style={{
        marginTop:20
      }}
      >
        <Progress.Bar progress={GetPregress(currentIndex)} width={Dimensions.get('window').width*0.85}
        height={10} 
        />
      </View>

      <View
      style={{
        padding:25,
        backgroundColor:Colors.white,
        marginTop:30,
        height:Dimensions.get('screen').height*0.65,
        elevation:5,
        borderRadius:50
      }}>

        <Text
        style={{fontFamily:'Outfit-Bold',fontSize:25,textAlign:'center'}}
        >{quiz[currentIndex].question}</Text>

        {quiz[currentIndex]?.options.map((item, index) => (
          <TouchableOpacity 
          onPress={()=>{setSelected(index);onOptionSelection(item)}}
          key={index} style={{
            padding:20,
            borderWidth:0.3,
            borderRadius:15,
            marginTop:10,
            backgroundColor: selected === index ? Colors.Green : 'white',
            borderColor:Colors.black,
            borderWidth:1
           }}>
            <Text style={{ fontSize:20,fontFamily:'Outfit' }}>{item}</Text>
            </TouchableOpacity>
          ))}

      </View>
      <View style={{ marginTop: 20 }}>
        {(selected?.toString() && quiz?.length-1>currentIndex)&& <Button text={'Next'}
      onPress={()=>{setCurrentIndex(currentIndex+1);setSelected(null);}}
      />}

      {(selected?.toString()  && quiz?.length-1==currentIndex) && <Button text={'Finish'}
      loading={loading}
      onPress={()=>onQuizFinish()}
      />}
      </View>
    </View>
  );
}
