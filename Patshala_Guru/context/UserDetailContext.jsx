// context/UserDetailContext.js
import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const UserDetailContext = createContext({
  userDetail: null,
  setUserDetail: () => {},
  loading: true,
});

export const UserDetailProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserDetail(userDoc.data());
          } else {
            console.warn('No user document found');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      } else {
        setUserDetail(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail, loading }}>
      {children}
    </UserDetailContext.Provider>
  );
};
