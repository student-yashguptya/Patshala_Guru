import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { UserDetailContext } from '@/context/UserDetailContext';

const PLANS = ['Free', 'Standard', 'Premium'];
const BILLINGS = ['Annual', 'Monthly'];

const PRICING = {
  Standard: { Annual: '₹3,299/year', Monthly: '₹399/month' },
  Premium: { Annual: '₹4,999/year', Monthly: '₹599/month' },
};

export default function SubscriptionOption() {
  const [selectedPlan, setSelectedPlan] = useState('Free');
  const [selectedBilling, setSelectedBilling] = useState('Annual');
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  const from = params?.from || 'addcoursepage';

  const getFeatures = () => {
    switch (selectedPlan) {
      case 'Free':
        return [
          '✔ Access to basic templates',
          '✔ Limited LUTs',
          '✘ No premium fonts or effects',
        ];
      case 'Standard':
        return [
          '✔ Access to 30 cinematic LUTs',
          '✔ Pro fonts and transition effects',
          '✔ 10+ templates',
        ];
      case 'Premium':
        return [
          '✔ Everything in Standard',
          '✔ Unlimited templates',
          '✔ AI course creation & progress tracking',
        ];
      default:
        return [];
    }
  };

  const upgradePlan = async (plan) => {
    try {
      const userRef = doc(db, 'users', userDetail.uid);
      await updateDoc(userRef, {
        member: true,
        membershipPlan: plan,
        billingCycle: plan === 'Free' ? 'None' : selectedBilling,
        updatedAt: new Date(),
      });

      Alert.alert('Success', `You’ve activated the ${plan} plan!`);
      router.replace(from === 'mysubscription' ? '/mysubscription' : '/addCourse/addcoursepage');
    } catch (error) {
      console.error('Membership update failed:', error);
      Alert.alert('Error', 'Failed to update your plan. Please try again.');
    }
  };

  const handleContinue = async () => {
    if (!userDetail?.uid) {
      Alert.alert('Error', 'User data not available');
      return;
    }

    if (selectedPlan === 'Free') {
      await upgradePlan('Free');
      return;
    }

    Alert.alert(
      'Payment Required',
      `You selected the ${selectedPlan} plan (${PRICING[selectedPlan][selectedBilling]}).`,
      [
        {
          text: 'OK',
          onPress: () => {
            Alert.alert('Coming Soon', 'This plan is not applicable for now. Switching to Free plan.');
            setSelectedPlan('Free');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('./../../assets/images/edu.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Get started with a plan</Text>

      <View style={styles.tabContainer}>
        {PLANS.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, selectedPlan === type && styles.activeTab]}
            onPress={() => setSelectedPlan(type)}
          >
            <Text style={[styles.tabText, selectedPlan === type && styles.activeTabText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.features}>
        {getFeatures().map((feature, idx) => (
          <Text key={idx} style={styles.feature}>{feature}</Text>
        ))}
      </View>

      {selectedPlan !== 'Free' && (
        <View style={styles.planCardContainer}>
          {BILLINGS.map((billing) => (
            <TouchableOpacity
              key={billing}
              style={[
                styles.planCard,
                selectedBilling === billing && styles.planCardSelected,
              ]}
              onPress={() => setSelectedBilling(billing)}
            >
              <Text style={styles.planTitle}>{billing}</Text>
              <Text style={styles.planSub}>
                {PRICING[selectedPlan][billing]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>
          {selectedPlan === 'Free' ? 'Continue with Free Plan' : 'Continue'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
      <Text 
      style={{marginTop:30,fontFamily:"Outfit-SemiBold",fontSize:12,color:Colors.error,alignItems:'center'}}
      >(login again into your account to enable the subscription )</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 220,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    color: 'gray',
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  features: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: 10,
  },
  feature: {
    fontSize: 14,
    marginVertical: 4,
  },
  planCardContainer: {
    width: '100%',
    marginBottom: 20,
  },
  planCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  planCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#e6f8ed',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planSub: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  continueText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 6,
  },
});
