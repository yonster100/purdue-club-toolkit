import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

const STORAGE_KEY = '@club_toolkit_accounts';
const SESSION_KEY = '@club_toolkit_session';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [accounts, setAccounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      let allAccounts = {};
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) allAccounts = JSON.parse(stored);
      } catch (_) {
        allAccounts = {};
      }

      // Always overwrite built-in accounts so passwords stay in sync with code
      allAccounts[users.brooklyn.email] = users.brooklyn;
      allAccounts[users.yoni.email] = users.yoni;

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allAccounts));
      setAccounts(allAccounts);

      const session = await AsyncStorage.getItem(SESSION_KEY);
      if (session) {
        const email = JSON.parse(session);
        if (allAccounts[email]) {
          setCurrentUser(allAccounts[email]);
        }
      }
    } catch (e) {
      console.log('Error loading auth data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email, password) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check built-in accounts first as a reliable fallback
    const builtIn = Object.values(users).find(
      (u) => u.email === normalizedEmail
    );
    if (builtIn && builtIn.password === password) {
      setCurrentUser(builtIn);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(normalizedEmail));
      return;
    }

    // Then check any accounts created via sign-up
    let allAccounts = {};
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) allAccounts = JSON.parse(stored);
    } catch (_) {}

    const account = allAccounts[normalizedEmail];
    if (!account) {
      throw new Error('No account found with that email');
    }
    if (account.password !== password) {
      throw new Error('Incorrect password');
    }

    setCurrentUser(account);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(normalizedEmail));
  }

  async function signUp({ name, email, password, major, year }) {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const allAccounts = stored ? JSON.parse(stored) : {};
    const normalizedEmail = email.toLowerCase().trim();

    if (allAccounts[normalizedEmail]) {
      throw new Error('An account with that email already exists');
    }

    const newUser = {
      id: 'u' + Date.now(),
      name,
      email: normalizedEmail,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=CEB888&color=fff&size=128`,
      interests: [],
      year: year || 'Freshman',
      major: major || 'Undeclared',
      messageCount: 0,
      memberships: [],
    };

    allAccounts[normalizedEmail] = newUser;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allAccounts));
    setAccounts(allAccounts);
    setCurrentUser(newUser);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(normalizedEmail));
  }

  async function signOut() {
    setCurrentUser(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
