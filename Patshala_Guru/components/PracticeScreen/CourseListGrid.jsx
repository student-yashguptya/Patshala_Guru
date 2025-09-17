import { View, Image, FlatList, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CourseListGrid({ courseList, option }) {
  const router = useRouter();

  const onPress = (course) => {
    router.push({
      pathname: option.path,
      params: {
        courseParams: JSON.stringify(course),
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={courseList}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 30,
        }}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPress(item)}
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 15,
              backgroundColor: Colors.white,
              margin: 7,
              borderRadius: 15,
              elevation: 5,
              minWidth: (Dimensions.get('window').width / 2) - 30,
            }}
          >
            <Ionicons
              name="checkmark-done"
              size={24}
              color="black"
              style={{
                position: 'absolute',
                top: 10,
                left: 20,
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
            <Text
              style={{
                marginTop: 7,
                fontFamily: 'Outfit',
                textAlign: 'center',
              }}
            >
              {item?.courseTitle}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
