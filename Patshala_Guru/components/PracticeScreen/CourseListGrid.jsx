import { View, Image, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CourseListGrid({ courseList, option }) {
  const router = useRouter();
  const onPress=(course)=>{
    if(option?.name=='Quiz')
    {
      router.push({
        pathname:'/quiz',
        params:{
          courseParams: JSON.stringify(course)
        }
      })
    }
  }

  return (
    <View>
      <FlatList
        data={courseList}
        numColumns={2}
        style={{ padding: 20 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress={()=>onPress(item)}
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding:15,
              backgroundColor:Colors.white,
              margin:7,
              borderRadius:15,
              elevation:5
            }}
          >
             <Ionicons name="checkmark-done" size={24} color='black'
             style={{
              position:'absolute',
              top:10,
              left:20
             }}
             />
            <Image
              source={option?.icon}
              style={{
                width: '100%',
                height: 100,
              }}
              resizeMode="contain"
            />
            

            <Text style={{ marginTop: 7,
            fontFamily:"Outfit",
            textAlign:'center',

            }}>{item?.courseTitle}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
