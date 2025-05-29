import React, { useState } from 'react';
import { Photo } from '../../stores/photoStore';
import { Tag, Edit, Trash2, Info } from 'lucide-react';
import PhotoDetailModal from './PhotoDetailModal';

interface PhotoGridProps {
  photos: Photo[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  selectable?: boolean;
  selectedPhotos?: string[];
  onSelectPhoto?: (id: string, selected: boolean) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  onDelete,
  onEdit,
  selectable = false,
  selectedPhotos = [],
  onSelectPhoto,
}) => {
  const [detailPhoto, setDetailPhoto] = useState<Photo | null>(null);

  const handlePhotoClick = (photo: Photo) => {
    if (selectable && onSelectPhoto) {
      const isSelected = selectedPhotos.includes(photo._id);
      onSelectPhoto(photo._id, !isSelected);
    } else {
      setDetailPhoto(photo);
    }
  };

  const closeDetailModal = () => {
    setDetailPhoto(null);
  };

  return (
    <div className="w-full">
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
            <Info className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No photos found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            There are no photos matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => {
            console.log(photo)
            return (

              <div
                key={photo._id}
                className={`group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 ${selectable ? 'cursor-pointer' : ''
                  } ${selectedPhotos.includes(photo._id) ? 'ring-4 ring-primary-500' : ''}`}
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                  />

                  {/* Selection Overlay */}
                  {selectable && (
                    <div className={`absolute inset-0 bg-primary-500 bg-opacity-20 flex items-center justify-center transition-opacity ${selectedPhotos.includes(photo._id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
                      }`}>
                      <div className={`h-8 w-8 rounded-full border-2 ${selectedPhotos.includes(photo._id)
                        ? 'bg-primary-500 border-white'
                        : 'border-white bg-transparent'
                        } flex items-center justify-center transition-colors`}>
                        {selectedPhotos.includes(photo._id) && (
                          <svg className="h-5 w-5 text-white\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor">
                            a
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{photo.title}</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(photo.dateTaken).toLocaleDateString()}
                  </p>

                  {/* Tags */}
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

                {/* Action buttons */}
                {!selectable && (onEdit || onDelete) && (
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(photo._id);
                        }}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(photo._id);
                        }}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-900 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Photo detail modal */}
      {detailPhoto && (
        <PhotoDetailModal photo={detailPhoto} onClose={closeDetailModal} />
      )}
    </div>
  );
};

export default PhotoGrid;