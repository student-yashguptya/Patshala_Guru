import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function Chapters({ course }) {
  const route = useRouter();

  const isChapterCompleted = (index) => {
    if (!Array.isArray(course?.completedChapter)) return false;
    return course.completedChapter.includes(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chapters</Text>

      <FlatList
        data={course?.chapters}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              route.push({
                pathname: '/ChapterView',
                params: {
                  chapterParams: JSON.stringify(item),
                  DocID: course?.DocID,
                  chapterIndex: index
                }
              });
            }}
            style={styles.chapterBox}
          >
            <View style={styles.chapterInfo}>
              <Text style={styles.chapterNumber}>{index + 1}.</Text>
              <Text style={styles.chapterTitle}>{item.chapterName}</Text>
            </View>
            <Ionicons
              name={isChapterCompleted(index) ? 'checkmark-done' : 'play'}
              size={22}
              color={isChapterCompleted(index) ? Colors.Green : Colors.primary}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 10,
  },
  header: {
    fontFamily: 'Outfit-Bold',
    fontSize: 25,
    marginBottom: 10,
  },
  chapterBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 10,
  },
  chapterNumber: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 18,
    color: '#333',
  },
  chapterTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 18,
    color: '#333',
    flexShrink: 1,
    flexWrap: 'wrap',
  }
});
