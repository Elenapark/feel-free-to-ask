import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import FirebaseClient from '@/models/firebase_client';

import { AuthUserProps } from '@/models/types/auth_user';
import { AuthContextProps } from '@/contexts/auth_user.context';

export default function useFirebaseAuth(): AuthContextProps {
  const [authUser, setAuthUser] = useState<AuthUserProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(
        FirebaseClient.getInstance().Auth,
        provider
      );
      if (result.user) {
        console.info(result.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signOutWithGoogle = async () => {
    try {
      await signOut(FirebaseClient.getInstance().Auth);
    } catch (err) {
      console.error(err);
    } finally {
      setAuthUser(null);
      setLoading(false);
    }
  };

  const onChangeAuthState = (authState: User | null) => {
    // 유저 정보 없을 경우
    if (authState === null) {
      setAuthUser(null);
      setLoading(false);
      console.info('유저 정보가 없습니다.');
      return;
    }

    // 유저가 로그인 상태인 경우
    setAuthUser({
      uid: authState.uid,
      email: authState.email,
      displayName: authState.displayName,
      photoURL: authState.photoURL,
    });
  };

  useEffect(() => {
    // mount시, unmount시 authState감지
    const unsubscribeFirebase =
      FirebaseClient.getInstance().Auth.onAuthStateChanged(onChangeAuthState);
    return () => unsubscribeFirebase();
  }, []);

  return {
    authUser,
    signInWithGoogle,
    signOutWithGoogle,
    loading,
  };
}
