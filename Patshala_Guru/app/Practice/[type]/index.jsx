import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PracticeOption } from '../../../constants/Option';
import { collection, getDocs, where, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '@/context/UserDetailContext.jsx';
import Colors from '@/constants/Colors';
import CourseListGrid from '../../../components/PracticeScreen/CourseListGrid';

export default function PracticeTypeHomeScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const option = PracticeOption.find((item) => item.name === type);
  const [courseList, setCourseList] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDetail) {
      GetCourseList();
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'Courses'),
        where('createdBy', '==', userDetail?.Email),
        orderBy('createdOn', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const courses = querySnapshot.docs.map((doc) => doc.data());
      setCourseList(courses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Back button */}
      <Pressable
        style={{
          position: 'absolute',
          top: 40,
          left: 20,
          zIndex: 10,
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={28} color="#000" />
      </Pressable>

      {/* Header image */}
      <Image
        source={option?.image}
        style={{
          width: '100%',
          height: 300,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginBottom: 10,
        }}
      />

      {/* Loader */}
      {loading && <ActivityIndicator size="large" color={Colors.primary} />}

      {/* Course grid or empty state */}
      {!loading && courseList.length === 0 ? (
        <Text
          style={{
            textAlign: 'center',
            marginTop: 40,
            fontSize: 16,
            color: 'gray',
            fontFamily: 'Outfit',
          }}
        >
          No courses found.
        </Text>
      ) : (
        <CourseListGrid courseList={courseList} option={option} />
      )}
    </View>
  );
}
