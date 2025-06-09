import { View, Text ,TouchableOpacity, ActivityIndicator} from 'react-native'
import Colors from '../constants/Colors';

export default function Button({text, onPress,type='fill',loading}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
          backgroundColor: type === 'fill' ? Colors.primary : Colors.white,
          padding: 15,
          borderRadius: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 10,
          borderWidth: 2,
          borderColor: Colors.primary,
          alignSelf: 'center', 
          maxWidth: 350        
}}

      
          disabled={loading}
      >
      {!loading ?<Text
      style={{
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Outfit-Bold',
        color: type === 'fill' ? Colors.white : Colors.primary,

      }}
        >{text}</Text>:
        <ActivityIndicator size={'small'} color={type === 'fill' ? Colors.white : Colors.primary}/>
    }
    </TouchableOpacity>
  )
}