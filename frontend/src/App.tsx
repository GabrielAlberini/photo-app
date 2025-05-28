import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Gallery from './pages/Gallery';
import UploadPhotos from './pages/UploadPhotos';
import AlbumCreator from './pages/AlbumCreator';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Auth guard component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { theme, initTheme } = useThemeStore();
  const location = useLocation();

  // Initialize theme from localStorage
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Apply theme class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/upload" element={<UploadPhotos />} />
          <Route path="/create-album" element={<AlbumCreator />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;