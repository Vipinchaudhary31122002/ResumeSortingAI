'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'; 

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, userData, { withCredentials: true });
      if (response.status === 201 || response.status === 200) {
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
      await axios.post(`${BASE_URL}/auth/logout`,{}, { withCredentials: true });
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while logging out');
    } finally {
      setLoading(false);
    }
  };

  return { signup, login, logout, loading, error };
}
