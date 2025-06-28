import { View, Text, FlatList ,Pressable} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import { CourseCategory } from '../../constants/Option';
import CourseListByCategory from '../../components/Explore/CourseListByCategory';


export default function Explore() {

    
  return (
    <FlatList
    style={{flex:1,backgroundColor: Colors.white,}}
    data={[]}
    ListHeaderComponent={
    <View
      style={{
        padding: 25,
        backgroundColor: Colors.white,
        flex: 1,
      }}
    >
      
      <Text
        style={{
          fontFamily: 'Outfit-Bold',
          fontSize: 30,
          marginTop: 20,
        }}
      >
        Explore More Courses
      </Text>

      {CourseCategory.map((item, index) => (
        <View key={index}>
          <CourseListByCategory category={item}/>
        </View>
      ))}
    </View>
    }/>
  );
}
