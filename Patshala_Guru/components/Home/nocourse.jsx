import { View, Text ,Image} from 'react-native'
import Button from '../../Shared/button'
import { useRouter } from 'expo-router';

export default function NoCourse() {
  const router= useRouter();
  return (
    <View
      style={{
        marginTop: 40,
       display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
      source={require('./../../assets/images/Book.png')}
      style={{
        width: 300,
        height: 300,
      }}
      />

      <Text
      style={{
        fontSize: 25,
        fontFamily: 'Outfit-Bold',
        marginTop: 10,
        TextAlign: 'center',
        
      }}
      >You Don't Have Any Course</Text>

      <Button text={'+ Create New Course'} onPress={()=> router.push('/addCourse/addcoursepage')}/>
      <Button text={'Explore Existing Courses'}
      type='outline'/>
      
    </View>
  )
}