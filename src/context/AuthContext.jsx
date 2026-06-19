import { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithGoogle,
  getRedirectResult,
} from '../firebase/firebase';
import api from '../services/api';

const AuthContext = createContext(null);

function syncUser(firebaseUser) {
  return firebaseUser.getIdToken().then((token) =>
    api.post('/auth/sync', {
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || '',
    }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => ({ ...firebaseUser, dbUser: data.user }))
  ).catch(() => firebaseUser);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe;

    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        return syncUser(result.user).then((u) => { if (!cancelled) setUser(u); });
      }
    }).finally(() => {
      if (!cancelled) {
        unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser && !cancelled) {
            const u = await syncUser(firebaseUser);
            if (!cancelled) setUser(u);
          } else if (!cancelled) {
            setUser(null);
          }
          if (!cancelled) setLoading(false);
        });
      }
    });

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  const register = async (name, email, password, phone) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithGoogle();
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
