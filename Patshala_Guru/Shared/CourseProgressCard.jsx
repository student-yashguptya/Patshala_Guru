import { View, Text, Image } from 'react-native';
import Colors from '../constants/Colors';
import { imageAssets } from '../constants/Option';
import * as Progress from 'react-native-progress';

export default function CourseProgressCard({ item, width = 280 }) {
  const GetCompletedChapters = (course) => {
    const total = course?.chapters?.length || 0;
    const completed = course?.completedChapter?.length || 0;
    if (total === 0) return 0;
    return completed / total;
  };

  const progress = GetCompletedChapters(item);
  const totalChapters = item?.chapters?.length || 0;
  const completedChapters = item?.completedChapter?.length || 0;

  return (
    <View
      style={{
        margin: 6,
        padding: 15,
        backgroundColor: Colors.bg_gray,
        borderRadius: 15,
        width: width,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
        }}
      >
        <Image
          source={imageAssets[item.banner_image] || imageAssets['/banner1.png']}
          style={{ width: 100, height: 100, borderRadius: 15 }}
          resizeMode="cover"
        />

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 18,
              fontFamily: 'Outfit-Bold',
              flexWrap: 'wrap',
            }}
          >
            {item?.courseTitle}
          </Text>
          <Text style={{ fontFamily: 'Outfit-SemiBold' }}>
            {totalChapters} {totalChapters === 1 ? 'Chapter' : 'Chapters'}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Progress.Bar
          progress={progress}
          width={width === '100%' ? null : 250}
          style={{ alignSelf: 'stretch' }}
        />
        <Text style={{ fontFamily: 'Outfit-SemiBold' }}>
          {completedChapters} Out of {totalChapters} Chapter Completed
        </Text>
      </View>
    </View>
  );
}
