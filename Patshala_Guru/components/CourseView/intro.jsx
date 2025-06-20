import { View, Text ,Image,StyleSheet, Pressable} from 'react-native'
import { imageAssets } from '../../constants/Option';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import Button from '../../Shared/button';
import { useRouter } from 'expo-router';

export default function Intro({course}) {
    const route=useRouter();
  return (
    <View>
      
         <Image source={imageAssets[course?.banner_image]}
              style={{
                width:'100%',
                height:300
              }}
              />
      <View
      style={{
        padding:20
      }}
      >
        <Text style={{fontFamily:"Outfit-Bold",fontSize:25}}>{course?.courseTitle}</Text>
              <View style={styles.chapterRow}>
                <Ionicons name="book-outline" size={20} color={Colors.blue} />
                <Text style={{ fontFamily: 'Outfit-SemiBold',fontSize:18,color:Colors.blue }}>
                  {course?.chapters?.length || 0} {course?.chapters?.length === 1 ? 'Chapter' : 'Chapters'}
                </Text>
              </View>
               <Text style={{fontFamily:"Outfit-SemiBold",fontSize:20,marginTop:10}}>Description:</Text>
               <Text style={{fontFamily:"Outfit",fontSize:16,color:Colors.gray}}>{course?.description}</Text>
      </View>

      <Button
      text={'Start Now'}
      onPress={()=>console.log('Start Now Pressed')}
      />

      <Pressable style={{
        position:"absolute",
        paddingLeft:10,
        paddingTop:20
      }}
      onPress={()=>route.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  chapterRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginTop: 5,
  },
});
