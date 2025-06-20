import { View, Text, FlatList, Image } from 'react-native';
import React from 'react';
import { PracticeOption } from '../../constants/Option';

export default function PracticeSection() {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 25, marginBottom: 10 }}>
        Practice
      </Text>

      <FlatList
        data={PracticeOption}
        numColumns={3}
        key={'grid-3'}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width: 100, 
              alignItems: 'center',
              marginHorizontal: 5,
            }}
          >
            <Image
              source={item?.image}
              style={{
                width: 130,
                height: 130,
                borderRadius: 20,
                resizeMode: 'cover',
              }}
            />
          </View>
        )}
      />
    </View>
  );
}
