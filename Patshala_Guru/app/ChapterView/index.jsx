import { View, Text, Dimensions,StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Progress from 'react-native-progress';
import Colors  from '../../constants/Colors';
import Button from '../../Shared/button';
import { ScrollView } from 'react-native-gesture-handler';
import { db } from './../../config/firebaseConfig';
import { arrayUnion, updateDoc,doc } from 'firebase/firestore';

export default function ChapterView() {

    const {chapterParams, DocID, chapterIndex}=useLocalSearchParams();
    const chapters = JSON.parse(chapterParams);
    const chapterIdx = parseInt(chapterIndex);
    const [loader,setLoader]=useState(false);
    const[currentPage,setCurrentPage]=useState(0);
    const router=useRouter();
    const GetProgress=(currentPage)=>{
      const perc=(currentPage/chapters?.content?.length);
      return perc;
    }

    const onChapterComplete = async () => {
  setLoader(true);
  try {
    await updateDoc(doc(db, 'Courses', DocID), {
      completedChapter: arrayUnion(chapterIdx),
    });
    router.replace('/CourseView/'+DocID)
  } catch (error) {
    console.error('🔥 Firestore update failed:', error);
    alert('Something went wrong while saving progress!');
  } finally {
    setLoader(false);
  }
};


  return (
    <ScrollView>
    <View
    style={{
      paddingTop:35,
      padding:25,
      backgroundColor:Colors.white,
      flex:1
    }}
    >
      <Progress.Bar progress={GetProgress(currentPage)} width={Dimensions.get('screen').width*0.85} />
      <View>
        <Text
        style={{
          fontFamily:"Outfit-Bold",
          fontSize:25,
          marginTop:20
        }}
        >
          {chapters?.content[currentPage]?.topic}
        </Text>

        <Text style={{
          fontFamily:"Outfit",
          fontSize:20,
          marginTop:10
        }}>{chapters?.content[currentPage]?.explain}</Text>

        <Text style={styles.Title}>Code</Text>
        {chapters?.content[currentPage]?.code&&<Text style={[styles.TitleContent,{backgroundColor:Colors.black,color:Colors.white}]}>{chapters?.content[currentPage]?.code}</Text>}

        <Text style={styles.Title}>Example</Text>
        {chapters?.content[currentPage]?.example&&<Text style={styles.TitleContent}>{chapters?.content[currentPage]?.example}</Text>}
      </View>

      <View
      style={{marginTop:50}}
      >
        {chapters?.content?.length-1!=currentPage?
             <Button 
             text={'Next'}
             onPress={() => setCurrentPage(currentPage+1)}/>
             :<Button
             text={'Finish'}
             onPress={() =>onChapterComplete()} loading={loader}
             />}
       </View>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
 Title:{
  marginTop:10,
  fontFamily:"Outfit-SemiBold",
  fontSize:19
 },
 TitleContent:{
  padding:15,
  backgroundColor:Colors.bg_gray,
  borderRadius:15,
  fontFamily:"Outfit",
  fontSize:18,
  marginTop:10
 }
});