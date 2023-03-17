import { createContext, ReactNode, useContext, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import FirebaseClient from '@/models/firebase_client';

interface AuthContextProps {
  authUser: AuthUserProps;
  signInWithGoogle: () => void;
  signOutWithGoogle: () => void;
  loading: boolean;
}

interface AuthUserProps {
  uid?: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

const AuthUserContext = createContext<AuthContextProps | null>(null);
const provider = new GoogleAuthProvider();

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUserProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(
        FirebaseClient.getInstance().Auth,
        provider
      );
      setUser(result.user);
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
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthUserContext.Provider
      value={{
        authUser: {
          uid: user?.uid,
          email: user?.email,
          displayName: user?.email,
          photoURL: user?.photoURL,
        },
        signInWithGoogle,
        signOutWithGoogle,
        loading,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
}

// null checking을 위한 custom hooks
export const useAuth = () => {
  const authState = useContext(AuthUserContext);
  if (!authState) throw new Error('AuthState가 없습니다.');
  return authState;
};
