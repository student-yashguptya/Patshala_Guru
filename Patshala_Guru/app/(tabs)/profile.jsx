import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig'; // adjust path as per your project

import { useContext } from 'react';
import { UserDetailContext } from './../../context/UserDetailContext';

export default function Profile() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const router = useRouter();

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
                  router.replace("./index");
                })
                .catch((error) => {
                  Alert.alert('Error', error.message);
                });
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const menuItems = [
    { name: 'Add Course', icon: 'add-circle-outline' },
    { name: 'My Course', icon: 'book-outline' },
    { name: 'Course Progress', icon: 'trending-up-outline' },
    { name: 'My Subscription', icon: 'card-outline' },
    { name: 'Logout', icon: 'log-out-outline' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{userDetail?.email}</Text>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => onMenuClick(item)}
        >
          <Ionicons name={item.icon} size={24} color="#333" />
          <Text style={styles.menuText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
});
