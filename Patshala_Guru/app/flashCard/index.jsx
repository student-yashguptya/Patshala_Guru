import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import { useState } from 'react';
import FlipCard from 'react-native-flip-card';
import * as Progress from 'react-native-progress';

export default function FlashCard() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const flashcard = course?.flashcards || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get('screen').width;
  const router = useRouter();

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / (width * 0.875));
    setCurrentIndex(index);
  };

   const GetPregress=(currentIndex)=>{
    const perc=(currentIndex/flashcard?.length);
    return perc;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.counterText}>
          {currentIndex + 1} of {flashcard.length}
        </Text>
        </View>
        <View 
              style={{
                marginTop:20
              }}
              >
                <Progress.Bar progress={GetPregress(currentIndex)} width={Dimensions.get('window').width*0.85}
                height={10} 
                />
              </View>
        
      

      {/* Flashcard List */}
      <FlatList
        data={flashcard}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <FlipCard
              style={styles.flipcard}
              friction={8}
              perspective={1000}
              flipHorizontal={true}
              flipVertical={false}
              clickable
            >
              {/* Front */}
              <View style={styles.face}>
                <Text style={styles.text}>{item.front}</Text>
              </View>

              {/* Back */}
              <View style={styles.back}>
                <Text style={styles.text1}>{item.back}</Text>
              </View>
            </FlipCard>
          </View>
        )}
      />
    </View>
  );
}

const width = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
    color: '#333',
  },
  cardContainer: {
    width: width * 0.875,
    paddingVertical: 30,
    alignItems: 'center',
  },
  flipcard: {
  width: width * 0.78,
  height: 500,
  borderRadius: 20,
  backgroundColor: '#ffffff', // Explicit white
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 8,
  elevation: 5,
},

face: {
  flex: 1,
  backgroundColor: Colors.white, // Explicit white
  borderRadius: 20,
  padding: 20,
  justifyContent: 'center',
  alignItems: 'center',
},

back: {
  flex: 1,
  backgroundColor:Colors.blue, // Explicit white
  borderRadius: 20,
  padding: 20,
  justifyContent: 'center',
  alignItems: 'center',
},

text: {
  fontFamily: 'Outfit-Bold',
  fontSize: 28,
  color:Colors.black, // Explicit black
  textAlign: 'center',
  lineHeight: 34,
},
text1: {
  fontFamily: 'Outfit-Bold',
  fontSize: 28,
  color:Colors.white, // Explicit black
  textAlign: 'center',
  lineHeight: 34,
},
});
