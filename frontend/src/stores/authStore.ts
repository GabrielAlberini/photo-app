import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

// This is a mock implementation for the frontend demo
// In a real app, these functions would communicate with a backend API
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (email, password) => {
    // Simulate API call
    set({ isLoading: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        const user = {
          id: '1',
          name: 'Demo User',
          email,
          avatar: 'https://i.pravatar.cc/150?u=demouser',
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (name, email, password) => {
    // Simulate API call
    set({ isLoading: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      if (name && email && password) {
        const user = {
          id: '1',
          name,
          email,
          avatar: 'https://i.pravatar.cc/150?u=newuser',
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error('Invalid registration data');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser) as User;
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },
}));