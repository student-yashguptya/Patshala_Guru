import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { UserDetailContext } from './../../context/UserDetailContext';
import Colors from '@/constants/Colors'; // ✅ Import Colors

export default function Profile() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const menuItems = [
    { name: 'Add Course', icon: 'add-circle-outline' },
    { name: 'My Course', icon: 'book-outline' },
    { name: 'Course Progress', icon: 'trending-up-outline' },
    { name: 'My Subscription', icon: 'card-outline' },
    { name: 'Logout', icon: 'log-out-outline' },
  ];

  const onMenuClick = (menu) => {
    if (menu.name === 'Logout') {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: () => {
              signOut(auth)
                .then(() => {
                  setUserDetail(null);
                  router.replace('/');
                })
                .catch((error) => {
                  Alert.alert('Error', error.message);
                });
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      switch (menu.name) {
        case 'Add Course':
          router.push('/addCourse/addcoursepage');
          break;
        case 'My Course':
          router.push('/(tabs)/home');
          break;
        case 'Course Progress':
          router.push('/(tabs)/progress');
          break;
        case 'My Subscription':
          router.push('/Subscription/mysubscription');
          break;
        default:
          Alert.alert(menu.name);
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Profile</Text>

      <Image
        source={require('../../assets/images/LOGO Image.png')}
        style={styles.avatar}
      />
      <Text style={styles.name}>{userDetail?.Name || '--'}</Text>
      <Text style={styles.email}>{userDetail?.Email || 'anonymous@unknown.com'}</Text>

      <View style={styles.menuWrapper}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => onMenuClick(item)}
          >
            <Ionicons name={item.icon} size={22} color={Colors.primary} />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 5,
  },
  email: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 30,
  },
  menuWrapper: {
    width: '100%',
  },
  menuItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 14,
    color: '#333',
  },
});
