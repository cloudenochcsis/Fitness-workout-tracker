import axios from 'axios';

// Configure axios with defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
axios.defaults.withCredentials = false; // Change this to false since we're using token auth
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Log all requests in development mode
axios.interceptors.request.use(request => {
  console.log('Starting API Request:', request.url);
  return request;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Intercept responses to handle auth errors
axios.interceptors.response.use(
  response => {
    console.log('API Response Success:', response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    
    if (error.response && error.response.status === 401) {
      // Redirect to login page or refresh token
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Set auth token for all requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Auth API functions
export const login = async (username, password) => {
  try {
    // Log what we're sending
    console.log('Sending login request with username:', username);
    
    // Use explicit options to ensure headers are correctly set
    const response = await axios({
      method: 'post',
      url: '/auth/login',
      data: { username, password },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Login response:', response.data);
    
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    // Log what we're sending
    console.log('Sending registration request with data:', { username, email, password: '***' });
    
    // Use explicit options to ensure headers are correctly set
    const response = await axios({
      method: 'post',
      url: '/auth/register',
      data: { username, email, password },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Registration response:', response.data);
    
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    setAuthToken(null);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// User profile functions
export const fetchUserProfile = async () => {
  try {
    const response = await axios.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await axios.post('/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Workouts API wrapper functions
export const fetchUserWorkouts = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`/api/workouts?page=${page}&per_page=${perPage}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

export const fetchWorkoutById = async (id) => {
  try {
    const response = await axios.get(`/api/workouts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching workout ${id}:`, error);
    throw error;
  }
};

export const createWorkout = async (workoutData) => {
  try {
    const response = await axios.post('/api/workouts', workoutData);
    return response.data;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};

export const updateWorkout = async (id, workoutData) => {
  try {
    const response = await axios.put(`/api/workouts/${id}`, workoutData);
    return response.data;
  } catch (error) {
    console.error(`Error updating workout ${id}:`, error);
    throw error;
  }
};

export const deleteWorkout = async (id) => {
  try {
    await axios.delete(`/api/workouts/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting workout ${id}:`, error);
    throw error;
  }
};

// Exercises API wrapper functions
export const fetchExercises = async (page = 1, perPage = 50, muscleGroup = null) => {
  try {
    let url = `/api/exercises?page=${page}&per_page=${perPage}`;
    if (muscleGroup && muscleGroup !== 'All') {
      url += `&muscle_group=${muscleGroup}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

export const fetchExerciseById = async (id) => {
  try {
    const response = await axios.get(`/api/exercises/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercise ${id}:`, error);
    throw error;
  }
};

export const createExercise = async (exerciseData) => {
  try {
    const response = await axios.post('/api/exercises', exerciseData);
    return response.data;
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
};

export const updateExercise = async (id, exerciseData) => {
  try {
    const response = await axios.put(`/api/exercises/${id}`, exerciseData);
    return response.data;
  } catch (error) {
    console.error(`Error updating exercise ${id}:`, error);
    throw error;
  }
};

export const deleteExercise = async (id) => {
  try {
    await axios.delete(`/api/exercises/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting exercise ${id}:`, error);
    throw error;
  }
};

// Statistics API
export const fetchUserStats = async () => {
  try {
    const response = await axios.get('/api/stats/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    throw error;
  }
};

export const fetchMonthlyStats = async () => {
  try {
    const response = await axios.get('/api/stats/monthly');
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    throw error;
  }
};

export const fetchExerciseStats = async () => {
  try {
    const response = await axios.get('/api/stats/exercises');
    return response.data;
  } catch (error) {
    console.error('Error fetching exercise stats:', error);
    throw error;
  }
};

// Exporting API objects for easier imports
export const statsApi = {
  getSummary: fetchUserStats,
  getMonthly: fetchMonthlyStats,
  getExerciseStats: fetchExerciseStats
};

export const workoutApi = {
  getWorkouts: fetchUserWorkouts,
  getWorkout: fetchWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout
};
