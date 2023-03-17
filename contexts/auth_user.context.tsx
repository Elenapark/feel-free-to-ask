import { createContext, ReactNode, useContext } from 'react';
import useFirebaseAuth from '@/hooks/use_firebase_auth';
import { AuthUserProps } from '@/models/types/auth_user';

export interface AuthContextProps {
  authUser: AuthUserProps | null;
  signInWithGoogle: () => void;
  signOutWithGoogle: () => void;
  loading: boolean;
}

const AuthUserContext = createContext<AuthContextProps | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const authState = useFirebaseAuth();

  return (
    <AuthUserContext.Provider value={authState}>
      {children}
    </AuthUserContext.Provider>
  );
}

export const useAuth = () => {
  const authState = useContext(AuthUserContext);
  if (!authState) {
    console.error('Auth Provider 외부에서 AuthState에 접근하고 있습니다!');
  }
  return authState;
};
