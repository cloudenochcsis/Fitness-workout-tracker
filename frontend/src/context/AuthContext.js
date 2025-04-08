import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Set the default Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user profile
        axios.get('/auth/profile')
          .then(response => {
            setUser(response.data);
            setLoading(false);
          })
          .catch(err => {
            console.error('Error fetching profile:', err);
            logout(); // Clear invalid token
            setLoading(false);
          });
      } catch (err) {
        console.error('Error setting up auth:', err);
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (username, password) => {
    try {
      // Ensure we're sending JSON content
      const response = await axios.post('/auth/login', 
        { username, password },
        { 
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (!response.data || !response.data.access_token) {
        throw new Error('Invalid response from server');
      }
      
      const { user, access_token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', access_token);
      
      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(user);
      setError(null);
      return user;
    } catch (err) {
      console.error('Login error in context:', err);
      setError(err.response?.data?.error || 'An error occurred during login');
      throw err;
    }
  };
  
  const register = async (username, email, password) => {
    try {
      // Ensure we're sending JSON content
      const response = await axios.post('/auth/register', 
        { username, email, password }
      );
      
      if (!response.data || !response.data.access_token) {
        throw new Error('Invalid response from server');
      }
      
      const { user, access_token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', access_token);
      
      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(user);
      setError(null);
      return user;
    } catch (err) {
      console.error('Registration error in context:', err);
      
      // Provide more specific error messages based on backend response
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        throw err;
      }
      
      // Fall back to a generic error if we can't get a specific one
      setError('Registration failed. Please check your network connection and try again.');
      throw err;
    }
  };
  
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/auth/profile', userData);
      setUser(response.data.user);
      setError(null);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while updating profile');
      throw err;
    }
  };
  
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    error,
    login,
    register,
    updateProfile,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
