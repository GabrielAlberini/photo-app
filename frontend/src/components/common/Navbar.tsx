import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Camera, 
  LogOut, 
  Menu, 
  Moon, 
  Settings, 
  Sun, 
  Upload, 
  X,
  Home,
  Images,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/gallery', label: 'Gallery', icon: <Images size={18} />, protected: true },
    { path: '/upload', label: 'Upload', icon: <Upload size={18} />, protected: true },
    { path: '/create-album', label: 'Create Album', icon: <FileText size={18} />, protected: true },
    { path: '/settings', label: 'Settings', icon: <Settings size={18} />, protected: true },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Camera className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">PhotoChronicle</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => {
              // Skip protected routes if not authenticated
              if (link.protected && !isAuthenticated) return null;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Authentication buttons */}
            {isAuthenticated ? (
              <div className="flex items-center ml-2">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => {
            // Skip protected routes if not authenticated
            if (link.protected && !isAuthenticated) return null;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={closeMenu}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}

          {/* Authentication buttons for mobile */}
          {isAuthenticated ? (
            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center"
                >
                  <LogOut size={18} className="mr-1" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="px-3 py-2 space-y-2">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center rounded-md text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-600 dark:text-primary-400 dark:border-primary-400"
                onClick={closeMenu}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="block w-full px-4 py-2 text-center rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                onClick={closeMenu}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;