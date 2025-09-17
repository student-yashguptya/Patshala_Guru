import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '../../context/UserDetailContext';
import CourseProgressCard from '../../Shared/CourseProgressCard';
import { db } from './../../config/firebaseConfig';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function Progress() {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  useEffect(() => {
    userDetail && GetCouseList();
  }, [userDetail]);

  const GetCouseList = async () => {
    setLoading(true);
    setCourseList([]);
    const q = query(collection(db, 'Courses'), where('createdBy', '==', userDetail?.Email));
    const querySnapShot = await getDocs(q);

    querySnapShot.forEach((doc) => {
      setCourseList((prev) => [...prev, doc.data()]);
    });

    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 50 }}>
      <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 28, marginBottom: 15 }}>
        Course Progress
      </Text>

      <FlatList
        data={courseList}
        onRefresh={()=>GetCouseList()}
        refreshing={loading}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9}
          onPress={() => route.push({
                pathname:'/CourseView/'+item?.DocID,
                params:{
                  courseParams:JSON.stringify(item)
                }
              })}
          >
            <CourseProgressCard item={item} width={'100%'} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
