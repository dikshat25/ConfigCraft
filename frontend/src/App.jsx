import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ConfigUpload from './pages/ConfigUpload';
import AppRenderer from './pages/AppRenderer';
import CSVImport from './pages/CSVImport';
import Settings from './pages/Settings';
import ErrorMonitor from './pages/ErrorMonitor';
import AuthGuard from './components/auth/AuthGuard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/themeStore';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'bg-bg-secondary text-text-primary border border-border-subtle font-sans',
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)'
          }
        }} 
      />
      
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/configs/new" element={<ConfigUpload />} />
            <Route path="/apps/:id" element={<AppRenderer />} />
            <Route path="/csv-import" element={<CSVImport />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/errors" element={<ErrorMonitor />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
