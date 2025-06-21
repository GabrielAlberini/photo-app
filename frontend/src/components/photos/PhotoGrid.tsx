import React, { useEffect, useState } from 'react';
import { usePhotoStore, Photo } from '../../stores/photoStore';
import { Tag, Trash2, Info } from 'lucide-react';
import PhotoDetailModal from './PhotoDetailModal';

interface PhotoGridProps {
  photos?: Photo[];
  selectable?: boolean;
  selectedPhotos?: string[];
  onSelectPhoto?: (id: string, selected: boolean) => void;
  onDelete?: (id: string) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos: propPhotos,
  selectable = false,
  selectedPhotos = [],
  onSelectPhoto,
  onDelete,
}) => {
  const storePhotos = usePhotoStore((state) => state.photos);
  const isLoading = usePhotoStore((state) => state.isLoading);
  const fetchPhotos = usePhotoStore((state) => state.fetchPhotos);
  const deletePhoto = usePhotoStore((state) => state.deletePhoto);

  const [detailPhoto, setDetailPhoto] = useState<Photo | null>(null);

  // Use prop photos if provided, otherwise use store photos
  const photos = propPhotos || storePhotos;

  useEffect(() => {
    // Only fetch photos if we're not using prop photos and store is empty
    if (!propPhotos && storePhotos.length === 0) {
      fetchPhotos();
    }
  }, [fetchPhotos, propPhotos, storePhotos.length]);

  const handlePhotoClick = (photo: Photo) => {
    if (selectable && onSelectPhoto) {
      const isSelected = selectedPhotos.includes(photo._id);
      onSelectPhoto(photo._id, !isSelected);
    } else {
      setDetailPhoto(photo);
    }
  };

  const closeDetailModal = () => setDetailPhoto(null);

  const handleDelete = async (id: string) => {
    if (onDelete) {
      onDelete(id);
    } else {
      await deletePhoto(id);
    }
    setDetailPhoto(null);
  };

  if (isLoading && !propPhotos) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
            <Info className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No photos found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectable 
              ? "There are no photos matching your criteria. Try adjusting your filters."
              : "Upload some photos to get started."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo._id}
              className={`group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 ${
                selectable ? 'cursor-pointer' : ''
              } ${
                selectedPhotos.includes(photo._id) ? 'ring-4 ring-primary-500' : ''
              }`}
              onClick={() => handlePhotoClick(photo)}
            >
              <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                  loading="lazy"
                />

                {selectable && (
                  <div
                    className={`absolute inset-0 bg-primary-500 bg-opacity-20 flex items-center justify-center transition-opacity ${
                      selectedPhotos.includes(photo._id)
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-70'
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full border-2 ${
                        selectedPhotos.includes(photo._id)
                          ? 'bg-primary-500 border-white'
                          : 'border-white bg-transparent'
                      } flex items-center justify-center transition-colors`}
                    >
                      {selectedPhotos.includes(photo._id) && (
                        <svg
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {photo.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(photo.dateTaken).toLocaleDateString()}
                </p>

                {photo.tags && photo.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {photo.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                    {photo.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        +{photo.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!selectable && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailPhoto(photo);
                    }}
                    className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo._id);
                    }}
                    className="p-1 bg-white rounded-full shadow-md hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-900 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {detailPhoto && <PhotoDetailModal photo={detailPhoto} onClose={closeDetailModal} />}
    </div>
  );
};

export default PhotoGrid;