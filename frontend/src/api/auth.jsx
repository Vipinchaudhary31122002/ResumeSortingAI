'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setEmail, clearEmail } from '../store/userSlice';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'; 

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, userData, { withCredentials: true });
      if (response.status === 201 || response.status === 200) {
        dispatch(setEmail(userData.email));
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials, { withCredentials: true });
      if (response.status === 200) {
        dispatch(setEmail(credentials.email));
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
      dispatch(clearEmail());
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while logging out');
    } finally {
      setLoading(false);
    }
  };

  return { signup, login, logout, loading, error };
}
