
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { UserRole } from '../types.js';
import { MOCK_API_DELAY } from '../constants.js'; // For simulating API calls

// Mock users - In a real app, this would come from a backend.
// Passwords should be hashed securely. For this mock, we'll use simple strings.
const MOCK_USERS = [
  { id: 'admin1', name: 'Alice Administrator LongNameExample', email: 'admin@example.com', address: '123 Admin St, System City', role: UserRole.ADMIN, passwordHash: 'AdminPass1!' },
  { id: 'user1', name: 'Bob User Example VeryLongName', email: 'user@example.com', address: '456 User Ave, Normal Town', role: UserRole.USER, passwordHash: 'UserPass1!' },
  { id: 'storeowner1', name: 'Charlie Owner StoreNameExample', email: 'owner@store.com', address: '789 Store Rd, Shopsville', role: UserRole.STORE_OWNER, passwordHash: 'OwnerPass1!', storeId: 'store1' },
];

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [users, setUsers] = useState(MOCK_USERS); // Manage users state locally for this mock
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.passwordHash === password); // Simplified password check
        if (user) {
          setCurrentUser(user);
          resolve(user);
        } else {
          setError('Invalid email or password.');
          resolve(null);
        }
        setIsLoading(false);
      }, MOCK_API_DELAY);
    });
  }, [users]);

  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (users.some(u => u.email === userData.email)) {
          setError('Email already exists.');
          resolve(null);
          setIsLoading(false);
          return;
        }
        const newUser = {
          id: `user${Date.now()}`,
          name: userData.name,
          email: userData.email,
          address: userData.address,
          passwordHash: userData.password, // Store password directly for mock
          role: userData.role || UserRole.USER, // Default to Normal User
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        setCurrentUser(newUser); // Auto-login after signup
        resolve(newUser);
        setIsLoading(false);
      }, MOCK_API_DELAY);
    });
  }, [users]);
  
  const addUserByAdmin = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (users.some(u => u.email === userData.email)) {
          setError('Email already exists for new user.');
          resolve(null);
          setIsLoading(false);
          return;
        }
        const newUser = {
          id: `${userData.role.toLowerCase().replace(/\s/g, '')}${Date.now()}`,
          ...userData,
          passwordHash: userData.password, 
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        resolve(newUser); // Admin doesn't auto-login as this new user
        setIsLoading(false);
      }, MOCK_API_DELAY);
    });
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const updatePassword = useCallback(async (oldPassword, newPassword) => {
    if (!currentUser) {
      setError("No user logged in.");
      return false;
    }
    setIsLoading(true);
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (currentUser.passwordHash === oldPassword) {
          const updatedUser = { ...currentUser, passwordHash: newPassword };
          setCurrentUser(updatedUser);
          setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
          resolve(true);
        } else {
          setError("Incorrect old password.");
          resolve(false);
        }
        setIsLoading(false);
      }, MOCK_API_DELAY);
    });
  }, [currentUser, users]);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, error, login, signup, logout, updatePassword, addUserByAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};