import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { UserDetailContext } from '@/context/UserDetailContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

const PLAN_FEATURES = {
  Free: ['✔ Access to basic templates', '✔ Limited LUTs', '✘ No premium fonts or effects'],
  Standard: ['✔ 30 cinematic LUTs', '✔ Pro fonts & transition effects', '✔ 10+ templates'],
  Premium: [
    '✔ Everything in Standard',
    '✔ Unlimited templates',
    '✔ AI course creation & progress tracking',
  ],
};

export default function Mysubscription() {
  const { userDetail } = useContext(UserDetailContext);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userDetail?.uid) return;

    const unsub = onSnapshot(doc(db, 'users', userDetail.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMembership({
          plan: data.membershipPlan || 'Free',
          billing: data.billingCycle || 'None',
          updatedAt: data.updatedAt?.toDate?.().toDateString?.() || 'N/A',
        });
      }
    });

    return () => unsub();
  }, [userDetail?.uid]);

  const handleUpgrade = () => {
    router.push('/Subscription/subscriptionOption');
  };

  const handleCancelPlan = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your current plan and switch to Free?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            if (!userDetail?.uid) return;
            setLoading(true);
            try {
              await updateDoc(doc(db, 'users', userDetail.uid), {
                member: false,
                membershipPlan: 'Free',
                billingCycle: 'None',
                updatedAt: new Date(),
              });
              Alert.alert('Cancelled', 'You have reverted to the Free plan.');
            } catch (err) {
              Alert.alert('Error', 'Failed to cancel subscription.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRenew = () => {
    Alert.alert(
      'Renew Subscription',
      `Do you want to renew your ${membership.plan} plan (${membership.billing})?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Renew',
          onPress: async () => {
            if (!userDetail?.uid) return;
            setLoading(true);
            try {
              await updateDoc(doc(db, 'users', userDetail.uid), {
                updatedAt: new Date(),
              });
              Alert.alert('Renewed', 'Your subscription has been renewed.');
            } catch (err) {
              Alert.alert('Error', 'Failed to renew subscription.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!membership) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading subscription info...</Text>
      </View>
    );
  }

  const { plan, billing, updatedAt } = membership;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Your Subscription</Text>

      <View style={styles.card}>
        <Text style={styles.planLabel}>Current Plan:</Text>
        <Text style={styles.planName}>{plan}</Text>

        <Text style={styles.billing}>Billing Cycle: {billing}</Text>
        <Text style={styles.updatedAt}>Activated On: {updatedAt}</Text>

        <Text style={styles.featureHeader}>Features:</Text>
        {PLAN_FEATURES[plan]?.map((feature, index) => (
          <Text key={index} style={styles.featureItem}>
            {feature}
          </Text>
        ))}
      </View>

      {plan !== 'Premium' && (
        <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade} disabled={loading}>
          <Text style={styles.upgradeText}>Upgrade Plan</Text>
        </TouchableOpacity>
      )}

      {plan !== 'Free' && (
        <>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleRenew} disabled={loading}>
            <Text style={styles.secondaryText}>Renew Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelPlan} disabled={loading}>
            <Text style={styles.cancelText}>Cancel Plan</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'white',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  planLabel: {
    fontSize: 16,
    color: Colors.gray,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  billing: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  updatedAt: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  featureHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  featureItem: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  upgradeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 12,
  },
  upgradeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: '#e0f3ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 10,
  },
  secondaryText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: '#ffe6e6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  cancelText: {
    color: '#cc0000',
    fontWeight: '600',
    fontSize: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray,
  },
});
