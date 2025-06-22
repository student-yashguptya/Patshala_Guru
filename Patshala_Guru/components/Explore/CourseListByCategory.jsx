import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'
import { useRouter } from 'expo-router';
import { imageAssets } from '../../constants/Option';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import CourseList from '../Home/CourseList';

export default function CourseListByCategory({category}) {

    const [courseList,setCourseList]=useState([]);
    const [loading,setLoading]=useState(false);
    const route = useRouter();

    useEffect(()=>{
        GetCourseListByCategory();
    },[])

    const GetCourseListByCategory = async ()=>{
        setLoading(true);
        setCourseList([]);
        const q=query(collection(db,'Courses'),
        where('category','==',category),orderBy('createdOn','desc'))

        const querySnapShot=await getDocs(q)
        querySnapShot.forEach((doc)=>{
            console.log('------------',doc.data());
            setCourseList(prev=>[...prev,doc.data()])
        })
        setLoading(false);
    }

  return  (
    <View>
      { courseList?.length>0 && <CourseList courseList={courseList} heading={category}/>}

    </View>
  )
}


const styles = StyleSheet.create({
  courseContainer: {
    padding: 5,
    backgroundColor: Colors.bg_gray,
    margin: 6,
    borderRadius: 15,
    width: 260,
  },
  chapterRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginTop: 5,
  },
});
