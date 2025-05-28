import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, FileText, Upload, Calendar } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          <span className="block">Preserve Your Memories</span>
          <span className="block text-primary-600 dark:text-primary-400">Create Beautiful Albums</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-600 dark:text-gray-300">
          PhotoChronicle helps you organize, share, and print your precious memories. Turn digital moments into tangible keepsakes.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <Link
            to="/register"
            className="btn btn-primary px-8 py-3 text-base"
          >
            Get Started
          </Link>
          <Link
            to="/gallery"
            className="btn btn-secondary px-8 py-3 text-base"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to preserve your memories
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 lg:mx-auto">
              Upload, organize, and transform your photos into beautiful printed albums with our easy-to-use platform.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Easy Photo Upload</h3>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Quickly upload your photos with our drag-and-drop interface. Add titles, descriptions, and tags to keep everything organized.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Monthly Collections</h3>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Automatically organize your photos by month and year. Never lose track of when those special moments happened.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">PDF Generation</h3>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Create beautiful PDF albums from your photos with custom covers and layouts. Perfect for printing or sharing digitally.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Camera className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Event Tagging</h3>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Group photos by events like vacations, birthdays, or holidays. Create themed collections that tell a story.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 dark:bg-primary-800 rounded-lg shadow-xl overflow-hidden">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start preserving memories?</span>
            <span className="block text-primary-300">Create your account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-800 bg-white hover:bg-gray-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;