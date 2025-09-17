import { View, Text, Platform, FlatList } from 'react-native'
import Header from '../../components/Home/header'
import Colors from '../../constants/Colors'
import NoCourse from '../../components/Home/nocourse'
import { useContext, useEffect, useState } from 'react'
import { db } from './../../config/firebaseConfig';
import { collection, doc, getDocs, query, where } from 'firebase/firestore'
import { UserDetailContext } from '../../context/UserDetailContext'
import CourseList from '../../components/Home/CourseList'
import PracticeSection from '../../components/Home/PracticeSection'
import CourseProgress from '../../components/Home/CourseProgress'

export default function Home() {

  const{userDetail, setUserDetail}=useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading,setLoading]=useState(false);

  useEffect(() =>{
    userDetail&&GetCouseList();
  },[userDetail])

  const GetCouseList = async() => {
    setLoading(true);
    setCourseList([])
    const q=query (collection(db,'Courses'),where('createdBy','==', userDetail?.Email))
    const querySnapShot = await getDocs(q)

    querySnapShot.forEach((doc) => {
      console.log('--',doc.data());
      setCourseList(prev=>[...prev,doc.data()])
    })
    setLoading(false);
  }
  return (
    <FlatList
    data={[]}
    onRefresh={()=>GetCouseList()}
    refreshing={loading}
    ListHeaderComponent={
    <View
    style={{
      flex: 1,
      backgroundColor: Colors.white,
      padding: 25,
      paddingTop: Platform.OS === 'ios' && 45,
    }}>
     <Header/>
     {courseList?.length==0?
     <NoCourse/>:
     <View>
      <CourseProgress courseList={courseList}/>
      <PracticeSection/>
     <CourseList courseList={courseList} />
     </View>
}
    </View>
    }/>
  )
}