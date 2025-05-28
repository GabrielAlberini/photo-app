import React, { useState } from 'react';
import { Bell, Moon, Sun, User, Calendar } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';

const Settings: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();
  
  const [notifyMonthlyReminder, setNotifyMonthlyReminder] = useState(true);
  const [reminderDay, setReminderDay] = useState(28);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Profile Information
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="sm:w-1/4 mb-4 sm:mb-0">
                <div className="relative w-20 h-20 mx-auto sm:mx-0">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-1 rounded-full text-xs">
                    <User className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="sm:w-3/4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="label">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={user?.name || ''}
                      className="input"
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user?.email || ''}
                      className="input"
                      readOnly
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button className="btn btn-secondary mt-2">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              ) : (
                <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              )}
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col space-y-4">
              <div>
                <span className="label">Theme</span>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`btn ${
                      theme === 'light' ? 'btn-primary' : 'btn-secondary'
                    } flex items-center justify-center`}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`btn ${
                      theme === 'dark' ? 'btn-primary' : 'btn-secondary'
                    } flex items-center justify-center`}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Notifications
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="monthly-reminder"
                      type="checkbox"
                      checked={notifyMonthlyReminder}
                      onChange={(e) => setNotifyMonthlyReminder(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="monthly-reminder" className="font-medium text-gray-700 dark:text-gray-300">
                      Monthly Album Reminder
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive a reminder to create your monthly photo album
                    </p>
                  </div>
                </div>

                {notifyMonthlyReminder && (
                  <div className="mt-4 ml-7">
                    <label htmlFor="reminder-day" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Remind me on day
                    </label>
                    <div className="mt-1 flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <select
                        id="reminder-day"
                        value={reminderDay}
                        onChange={(e) => setReminderDay(Number(e.target.value))}
                        className="input py-1"
                      >
                        {[...Array(31)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">of each month</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email-notifications"
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                      Email Notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive email notifications for reminders and account updates
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="btn btn-primary">Save Notification Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;