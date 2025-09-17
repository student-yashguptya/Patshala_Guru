import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useEffect, useState } from 'react';
import CourseList from './../Home/CourseList';
import { View, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors'; 

export default function CourseListByCategory({ category }) {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(
          collection(db, 'Courses'),
          where('category', '==', category)
        );
        const querySnapshot = await getDocs(q);
        const courses = querySnapshot.docs.map(doc => ({
          DocID: doc.id,          
          ...doc.data(),
        }));
        setCourseList(courses);
      } catch (error) {
        console.error(`Error fetching courses for ${category}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category]);

  return (
    <View style={{ paddingVertical: 10 }}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        courseList?.length > 0 && (
          <CourseList courseList={courseList} heading={category} 
          enroll={true}
          />
        )
      )}
    </View>
  );
}
