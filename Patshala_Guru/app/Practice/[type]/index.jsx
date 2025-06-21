import { View, Text ,Image,Pressable, ActivityIndicator} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router'
import { PracticeOption } from '../../../constants/Option';
import { collection,getDocs, where,query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useContext, useEffect, useState } from 'react';
import {UserDetailContext} from '@/context/UserDetailContext.jsx'
import Colors  from '@/constants/Colors';
import CourseListGrid from '../../../components/PracticeScreen/CourseListGrid';

export default function PracticeTypeHomeScreen() {

  const router=useRouter();
  const {type}=useLocalSearchParams();
  const option=PracticeOption.find(item=>item.name==type);
  const [courseList,setCourseList]=useState([]);
  const {userDetail,setUserDetail}=useContext(UserDetailContext)
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    userDetail&&GetCourseList();
  },[userDetail])

const GetCourseList = async () => {
  setLoading(true);
  setCourseList([]);
  try {
    const q = query(
      collection(db, 'Courses'),
      where('createdBy', '==', userDetail?.Email),
      orderBy('createdOn','desc')
    );

    const querySnapshot = await getDocs(q); 

    querySnapshot.forEach((doc) => {
      //console.log(doc.id, '=>', doc.data());
      setCourseList(prev=>[...prev,doc.data()])
    });

  } catch (error) {
    console.error(' Failed to fetch courses:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <View>
      <Image source={option.image}
      style={{
         width: '100%',
          height: 400,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginTop: 0,
      }}
      />

      <Pressable style={{
        position:"absolute",
        paddingLeft:10,
        paddingTop:20
      }}
      onPress={()=>router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>

      {loading&&<ActivityIndicator size={'large'} color={Colors.primary}/>}

      <CourseListGrid courseList={courseList}
      option={option}
      />
    </View>
  )
}