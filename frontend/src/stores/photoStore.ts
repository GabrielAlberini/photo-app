import { create } from 'zustand';

export interface Photo {
  _id: string;
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
  fetchPhotos: () => Promise<void>;
  uploadPhotos: (
    files: File[],
    metadata: {
      title?: string;
      description?: string;
      tags?: string[];
      event?: string;
      expiration?: number;
    }
  ) => Promise<void>;
  getPhotosByMonth: (year: number, month: number) => Photo[];
  getPhotosByTag: (tag: string) => Photo[];
  getPhotosByEvent: (event: string) => Photo[];
  deletePhoto: (id: string) => Promise<void>;
  updatePhotoMetadata: (
    id: string,
    metadata: Partial<
      Omit<Photo, 'id' | 'url' | 'thumbnailUrl' | 'uploadDate'>
    >
  ) => Promise<void>;
}

const API_BASE = 'http://localhost:3000/api/photos';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
};

export const usePhotoStore = create<PhotoState>((set, get) => {
  const fetchPhotos = async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(API_BASE, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const { data } = await res.json();
      set({ photos: data, isLoading: false });
    } catch (err: any) {
      console.error('Error fetching photos:', err);
      set({ isLoading: false });
    }
  };

  fetchPhotos();

  return {
    photos: [],
    isLoading: false,
    fetchPhotos,

    uploadPhotos: async (files, metadata) => {
      set({ isLoading: true });
      try {
        const uploaded: Photo[] = await Promise.all(
          files.map(async (file) => {
            const formData = new FormData();
            formData.append('image', file);
            if (metadata.title) formData.append('title', metadata.title);
            if (metadata.description)
              formData.append('description', metadata.description);
            if (metadata.tags)
              formData.append('tags', JSON.stringify(metadata.tags));
            if (metadata.event) formData.append('event', metadata.event);
            if (metadata.expiration)
              formData.append('expiration', String(metadata.expiration));

            const res = await fetch(API_BASE, {
              method: 'POST',
              headers: getAuthHeaders(),
              body: formData,
            });
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const { data } = await res.json();
            return data as Photo;
          })
        );

        set((state) => ({
          photos: [...state.photos, ...uploaded],
          isLoading: false,
        }));
      } catch (err: any) {
        console.error('Error uploading photos:', err);
        set({ isLoading: false });
      }
    },

    getPhotosByMonth: (year, month) =>
      get().photos.filter((photo) => {
        const d = new Date(photo.dateTaken);
        return d.getFullYear() === year && d.getMonth() === month - 1;
      }),

    getPhotosByTag: (tag) =>
      get().photos.filter((photo) => photo.tags.includes(tag)),

    getPhotosByEvent: (event) =>
      get().photos.filter((photo) => photo.event === event),

    deletePhoto: async (id) => {
      set((state) => ({ photos: state.photos.filter((p) => p._id !== id) }));
      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
      } catch (err) {
        console.error('Error deleting photo:', err);
        get().fetchPhotos();
      }
    },

    updatePhotoMetadata: async (id, metadata) => {
      set((state) => ({
        photos: state.photos.map((photo) =>
          photo._id === id ? { ...photo, ...metadata } : photo
        ),
      }));
      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(metadata),
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
      } catch (err) {
        console.error('Error updating photo metadata:', err);
        get().fetchPhotos();
      }
    },
  };
});
