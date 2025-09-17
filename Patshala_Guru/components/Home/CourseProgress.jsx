import { View, Text, FlatList } from 'react-native';
import CourseProgressCard from '../../Shared/CourseProgressCard';

export default function CourseProgress({ courseList }) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 25 }}>
        Progress
      </Text>

      <FlatList
        data={courseList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View key={index}>
            <CourseProgressCard item={item} />
          </View>
        )}
      />
    </View>
  );
}
