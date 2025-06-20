import { View, Text, FlatList,StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import {useRouter} from 'expo-router';

export default function Chapters({course}) {
  const route=useRouter();

  const isChapterCompleted = (index) => {
  if (!Array.isArray(course?.completedChapter)) return false;
  return course.completedChapter.includes(index);
};

  return (
    <View
    style={{
        padding:20
    }}
    >
      <Text
      style={{
        fontFamily:"Outfit-Bold",
        fontSize:25
      }}
      >Chapters</Text>

      <FlatList
      data={course?.chapters}

    renderItem={({item,index}) =>(
        <TouchableOpacity
        onPress={() =>{
          route.push({
            pathname:'/ChapterView',
            params:{
              chapterParams: JSON.stringify(item),
              DocID: course?.DocID,
              chapterIndex:index
            }
          })
        }}
        style={{
            padding:18,
            borderWidth:1,
            borderRadius:15,
            marginTop:10,
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center'
        }}
        >
            <View  style={{
                display:'flex',
                flexDirection:'row',
                gap:10,
                
            }}>
                <Text  style={styles.chapterText}>{index+1}.</Text>
                <Text  style={styles.chapterText}>{item.chapterName}</Text>
            </View>
            {isChapterCompleted(index)?(
            <Ionicons name="checkmark-done" size={24} color={Colors.Green} />)
              :(<Ionicons name="play" size={24} color={Colors.primary} />)
              }
        </TouchableOpacity>
    )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
 chapterText:{
    fontFamily:"Outfit-SemiBold",
    fontSize:20
 }
});