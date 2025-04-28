'use client';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// Load state from localStorage
const loadState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

// Create store factory function
export const makeStore = () => {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: loadState(),
  });

  // Subscribe to store changes and save to localStorage
  if (typeof window !== 'undefined') {
    store.subscribe(() => {
      saveState(store.getState());
    });
  }

  return store;
};

// Create store instance if we're on the client side
export const store = typeof window !== 'undefined' ? makeStore() : null;