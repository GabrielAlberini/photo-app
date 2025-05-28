import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Heart, Mail, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1">
            <div className="flex items-center">
              <Camera className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">PhotoChronicle</span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Preserve your memories. Create beautiful photo albums and cherish your precious moments forever.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Upload Photos
                </Link>
              </li>
              <li>
                <Link to="/create-album" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Create Album
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
                <a href="mailto:support@photochronicle.com" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  support@photochronicle.com
                </a>
              </li>
              <li className="flex items-center">
                <Github className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
                <a href="https://github.com/photochronicle" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  github.com/photochronicle
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            &copy; {currentYear} PhotoChronicle. All rights reserved. Made with <Heart className="inline-block h-3 w-3 text-red-500" /> in a digital world.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;