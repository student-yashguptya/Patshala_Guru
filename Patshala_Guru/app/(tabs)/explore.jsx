import { View, Text, FlatList } from 'react-native';
import React from 'react';
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
          {/* <Text
            style={{
              fontFamily: 'Outfit-Bold',
              fontSize: 20,
              marginTop: 10,
            }}
          >
            {item}
          </Text> */}
          <CourseListByCategory category={item}/>
        </View>
      ))}
    </View>
    }/>
  );
}
