import { View, Text, Platform } from 'react-native'
import Header from '../../components/Home/header'
import Colors from '../../constants/Colors'
import NoCourse from '../../components/Home/nocourse'

export default function Home() {
  return (
    <View
    style={{
      flex: 1,
      backgroundColor: Colors.white,
      padding: 25,
      paddingTop: Platform.OS === 'ios' && 45, // Adjust padding for Android status bar
    }}>
     <Header/>
     <NoCourse/>
    </View>
  )
}