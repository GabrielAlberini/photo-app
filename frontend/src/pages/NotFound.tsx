import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Camera } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 mb-6">
        <Camera className="h-10 w-10 text-primary-600 dark:text-primary-400" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/" className="btn btn-primary flex items-center justify-center">
          <Home className="mr-2 h-4 w-4" />
          Go to Home
        </Link>
        <Link to="/gallery" className="btn btn-secondary flex items-center justify-center">
          <Camera className="mr-2 h-4 w-4" />
          View Gallery
        </Link>
      </div>
    </div>
  );
};

export default NotFound;