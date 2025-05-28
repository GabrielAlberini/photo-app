import React from 'react';
import { Photo } from '../../stores/photoStore';
import { X, Calendar, Tag, Info } from 'lucide-react';
import { format } from 'date-fns';

interface PhotoDetailModalProps {
  photo: Photo;
  onClose: () => void;
}

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({ photo, onClose }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={handleModalClick}
      >
        <button
          className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 dark:bg-gray-800 dark:bg-opacity-80 dark:hover:bg-opacity-100 transition-all"
          onClick={onClose}
        >
          <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Photo */}
          <div className="h-[50vh] md:h-[80vh] bg-gray-900 flex items-center justify-center overflow-hidden">
            <img
              src={photo.url}
              alt={photo.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Details */}
          <div className="p-6 overflow-y-auto h-[30vh] md:h-[80vh]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{photo.title}</h2>
            
            {photo.description && (
              <p className="text-gray-700 dark:text-gray-300 mb-4">{photo.description}</p>
            )}

            <div className="space-y-4">
              {/* Date information */}
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Taken: {format(new Date(photo.dateTaken), 'MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Uploaded: {format(new Date(photo.uploadDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Tags</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {photo.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Event */}
              {photo.event && (
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Event</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{photo.event}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailModal;