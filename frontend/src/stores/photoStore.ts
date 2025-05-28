import { create } from 'zustand';
import { format } from 'date-fns';

export interface Photo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  uploadDate: string;
  dateTaken: string;
  tags: string[];
  event?: string;
}

interface PhotoState {
  photos: Photo[];
  isLoading: boolean;
  uploadPhotos: (files: File[], metadata: { title?: string, description?: string, tags?: string[], event?: string }) => Promise<void>;
  getPhotosByMonth: (year: number, month: number) => Photo[];
  getPhotosByTag: (tag: string) => Photo[];
  getPhotosByEvent: (event: string) => Photo[];
  deletePhoto: (id: string) => void;
  updatePhotoMetadata: (id: string, metadata: Partial<Omit<Photo, 'id' | 'url' | 'thumbnailUrl' | 'uploadDate'>>) => void;
}

// Mock implementation for demo purposes
export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [
    {
      id: '1',
      title: 'Family Picnic',
      description: 'Sunday picnic at the lake',
      url: 'https://images.pexels.com/photos/1153976/pexels-photo-1153976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      thumbnailUrl: 'https://images.pexels.com/photos/1153976/pexels-photo-1153976.jpeg?auto=compress&cs=tinysrgb&w=300',
      uploadDate: '2023-06-15T14:30:00Z',
      dateTaken: '2023-06-10T12:00:00Z',
      tags: ['family', 'summer', 'lake'],
      event: 'Summer Vacation',
    },
    {
      id: '2',
      title: 'Mountain Hike',
      description: 'Hiking in the mountains',
      url: 'https://images.pexels.com/photos/917494/pexels-photo-917494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      thumbnailUrl: 'https://images.pexels.com/photos/917494/pexels-photo-917494.jpeg?auto=compress&cs=tinysrgb&w=300',
      uploadDate: '2023-06-20T10:15:00Z',
      dateTaken: '2023-06-18T09:30:00Z',
      tags: ['hiking', 'nature', 'mountains'],
      event: 'Summer Vacation',
    },
    {
      id: '3',
      title: 'Beach Day',
      description: 'Relaxing day at the beach',
      url: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      thumbnailUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=300',
      uploadDate: '2023-07-05T16:45:00Z',
      dateTaken: '2023-07-04T13:20:00Z',
      tags: ['beach', 'summer', 'vacation'],
      event: 'Summer Vacation',
    },
  ],
  isLoading: false,

  uploadPhotos: async (files, metadata) => {
    set({ isLoading: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPhotos = files.map((file, index) => {
        // Create a blob URL for the demo
        const url = URL.createObjectURL(file);
        
        // In a real app, we'd upload to a server and get back URLs
        return {
          id: `temp-${Date.now()}-${index}`,
          title: metadata.title || file.name.split('.')[0],
          description: metadata.description || '',
          url,
          thumbnailUrl: url,
          uploadDate: new Date().toISOString(),
          dateTaken: new Date().toISOString(), // Would extract from EXIF in real app
          tags: metadata.tags || [],
          event: metadata.event,
        };
      });
      
      set(state => ({
        photos: [...state.photos, ...newPhotos],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error uploading photos:', error);
      set({ isLoading: false });
    }
  },

  getPhotosByMonth: (year, month) => {
    const { photos } = get();
    return photos.filter(photo => {
      const dateTaken = new Date(photo.dateTaken);
      return dateTaken.getFullYear() === year && dateTaken.getMonth() === month - 1;
    });
  },

  getPhotosByTag: (tag) => {
    const { photos } = get();
    return photos.filter(photo => photo.tags.includes(tag));
  },

  getPhotosByEvent: (event) => {
    const { photos } = get();
    return photos.filter(photo => photo.event === event);
  },

  deletePhoto: (id) => {
    set(state => ({
      photos: state.photos.filter(photo => photo.id !== id)
    }));
  },

  updatePhotoMetadata: (id, metadata) => {
    set(state => ({
      photos: state.photos.map(photo => 
        photo.id === id ? { ...photo, ...metadata } : photo
      )
    }));
  },
}));