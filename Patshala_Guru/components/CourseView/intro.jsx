import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { imageAssets } from '../../constants/Option';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import Button from '../../Shared/button';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from './../../context/UserDetailContext';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

export default function Intro({ course, enroll }) {
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const { userDetail } = useContext(UserDetailContext);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (!userDetail?.uid) return;
    const unsub = onSnapshot(doc(db, 'users', userDetail.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsMember(!!data?.member);
      } else {
        setIsMember(false);
      }
    });

    return () => unsub(); // Clean up listener on unmount
  }, [userDetail?.uid]);

  const onEnrollCourse = async () => {
    if (!isMember) {
      Alert.alert(
        'Membership Required',
        'You need to purchase a membership plan to enroll in this course.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'View Plans',
            onPress: () => route.replace('/Subscription/s ubscriptionOption'),
          },
        ]
      );
      return;
    }

    const DocID = Date.now().toString();
    setLoading(true);
    const data = {
      ...course,
      createdBy: userDetail?.Email,
      createdOn: new Date(),
      enrolled: true,
    };

    await setDoc(doc(db, 'Courses', DocID), data);

    route.replace({
      pathname: '/CourseView/' + DocID,
      params: {
        courseParams: JSON.stringify(data),
        enroll: false,
      },
    });

    setLoading(false);
  };

  return (
    <View>
      <Image
        source={imageAssets[course?.banner_image]}
        style={{
          width: '100%',
          height: 300,
        }}
      />
      <View style={{ padding: 20 }}>
        <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 25 }}>
          {course?.courseTitle}
        </Text>
        <View style={styles.chapterRow}>
          <Ionicons name="book-outline" size={20} color={Colors.blue} />
          <Text
            style={{
              fontFamily: 'Outfit-SemiBold',
              fontSize: 18,
              color: Colors.blue,
            }}
          >
            {course?.chapters?.length || 0}{' '}
            {course?.chapters?.length === 1 ? 'Chapter' : 'Chapters'}
          </Text>
        </View>
        <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, marginTop: 10 }}>
          Description:
        </Text>
        <Text style={{ fontFamily: 'Outfit', fontSize: 16, color: Colors.gray }}>
          {course?.description}
        </Text>
      </View>

      {enroll ? (
        <Button text={'Enroll Now'} loading={loading} onPress={onEnrollCourse} />
      ) : (
        <Button text={'Start Now'} onPress={() => console.log('Starting...')} />
      )}

      <Pressable
        style={{
          position: 'absolute',
          paddingLeft: 10,
          paddingTop: 20,
        }}
        onPress={() => route.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  chapterRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginTop: 5,
  },
});
