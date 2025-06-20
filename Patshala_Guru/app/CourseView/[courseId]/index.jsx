import { View,Image, ScrollView, FlatList} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import Intro from '../../../components/CourseView/intro';
import Colors from '../../../constants/Colors';
import Chapters from '../../../components/CourseView/Chapters';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useEffect, useState } from 'react';

export default function CourseView() {


    const {courseParams,courseId}=useLocalSearchParams();

    const [course,setCourse]=useState([]);
    // const course=JSON.parse(courseParams);
    // console.log(courseId)

    useEffect(()=>{
      if(!courseParams)
      {
        GetCourseById();
      }
      else{
        setCourse(JSON.parse(courseParams));
      }
    },[courseId])

    const GetCourseById=async ()=>{
      const docRef=await getDoc(doc(db,'Courses',courseId));
      const courseData=docRef.data();
      setCourse(courseData)
    }

  return course&&(
     <FlatList
        data={[]}
        ListHeaderComponent={
    <View  style={{
            backgroundColor:Colors.white,
            flex:1
        }}>
       <Intro course={course} />
       <Chapters course={course}/>
    </View>
        }/>
  )
}