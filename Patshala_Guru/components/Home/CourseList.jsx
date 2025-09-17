import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { imageAssets } from '../../constants/Option';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function CourseList({ courseList ,heading='Courses',enroll=false}) {
  const route = useRouter();

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 25 }}>{heading}</Text>

      {courseList.length === 0 ? (
        <Text style={{ fontFamily: 'Outfit' }}>No courses available.</Text>
      ) : (
        <FlatList
          data={courseList}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => route.push({
                pathname:'/CourseView/'+item?.DocID,
                params:{
                  courseParams:JSON.stringify(item),
                  enroll:enroll
                }
              })}
              style={styles.courseContainer}
            >
              <Image
                source={imageAssets[item.banner_image] || imageAssets['/banner1.png']}
                style={{ width: '100%', height: 200, borderRadius: 15 }}
                resizeMode="cover"
              />

              <Text style={{ fontSize: 18, fontFamily: 'Outfit-Bold', marginTop: 8 }}>
                {item?.courseTitle}
              </Text>
              <View style={styles.chapterRow}>
                <Ionicons name="book-outline" size={20} color="black" />
                <Text style={{ fontFamily: 'Outfit-SemiBold' }}>
                  {item?.chapters?.length || 0} {item?.chapters?.length === 1 ? 'Chapter' : 'Chapters'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
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
