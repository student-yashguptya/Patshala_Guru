import { View, Text ,TouchableOpacity} from 'react-native'
import React, { useContext } from 'react';
import { UserDetailContext } from '../../context/UserDetailContext';
import Ionicons from '@expo/vector-icons/Ionicons';



export default function Header() {

     const{userDetail, setUserDetail} = useContext(UserDetailContext);


  return (
    <View
    style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',   
        }}
        >
        <View>
      <Text
      style={{
        marginTop: 20,
        fontSize: 25,
        fontFamily: 'Outfit-ExtraBold',
    }}
    >Hello, {userDetail?.Name}</Text>

    <Text
    style={{
        fontSize: 18,
         fontFamily: 'Outfit-Medium',
        marginTop: 5
    }}>Let's Get Started !</Text>
    </View>

    {/* <TouchableOpacity>
        <Ionicons name="settings-sharp" size={32} color="black" />
    </TouchableOpacity> */}
    </View>
  )
}