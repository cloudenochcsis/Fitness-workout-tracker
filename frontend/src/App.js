import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './context/AuthContext';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutList from './pages/WorkoutList';
import WorkoutDetail from './pages/WorkoutDetail';
import WorkoutForm from './pages/WorkoutForm';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/workouts" element={
            <PrivateRoute>
              <WorkoutList />
            </PrivateRoute>
          } />
          <Route path="/workouts/:id" element={
            <PrivateRoute>
              <WorkoutDetail />
            </PrivateRoute>
          } />
          <Route path="/workouts/new" element={
            <PrivateRoute>
              <WorkoutForm />
            </PrivateRoute>
          } />
          <Route path="/workouts/edit/:id" element={
            <PrivateRoute>
              <WorkoutForm />
            </PrivateRoute>
          } />
          <Route path="/exercises" element={
            <PrivateRoute>
              <ExerciseLibrary />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
