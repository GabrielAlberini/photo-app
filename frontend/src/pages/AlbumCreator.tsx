import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Tag, Sparkles, FileText } from 'lucide-react';
import { usePhotoStore, Photo } from '../stores/photoStore';
import PhotoGrid from '../components/photos/PhotoGrid';
import AlbumPreview from '../components/album/AlbumPreview';

const AlbumCreator: React.FC = () => {
  const { photos, fetchPhotos } = usePhotoStore();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState(`My Album - ${format(new Date(), 'MMMM yyyy')}`);
  const [subtitle, setSubtitle] = useState('');
  const [includePhotoTitles, setIncludePhotoTitles] = useState(true);
  const [includePhotoDescriptions, setIncludePhotoDescriptions] = useState(true);
  const [includeDateTaken, setIncludeDateTaken] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'month' | 'tag' | 'event'>('month');
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [step, setStep] = useState<1 | 2>(1);

  // Fetch photos on component mount
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Get unique tags and events for filters
  const allTags = Array.from(new Set(photos.flatMap(photo => photo.tags)));
  const allEvents = Array.from(new Set(photos.filter(photo => photo.event).map(photo => photo.event as string)));

  // Update filtered photos when filters or photos change
  useEffect(() => {
    let result = [...photos];

    switch (filterType) {
      case 'month':
        const [year, month] = selectedMonth.split('-').map(Number);
        result = photos.filter(photo => {
          const dateTaken = new Date(photo.dateTaken);
          return (
            dateTaken.getFullYear() === year &&
            dateTaken.getMonth() === month - 1
          );
        });
        // Update album title based on month
        setTitle(`My Album - ${format(new Date(selectedMonth), 'MMMM yyyy')}`);
        break;
      case 'tag':
        if (selectedTag) {
          result = photos.filter(photo => photo.tags.includes(selectedTag));
          setTitle(`My Album - ${selectedTag}`);
        }
        break;
      case 'event':
        if (selectedEvent) {
          result = photos.filter(photo => photo.event === selectedEvent);
          setTitle(`My Album - ${selectedEvent}`);
        }
        break;
      default:
        // All photos, already set
        break;
    }

    setFilteredPhotos(result);
    
    // Clear selected photos when filter changes
    setSelectedPhotos([]);
  }, [photos, filterType, selectedMonth, selectedTag, selectedEvent]);

  // Handle filter changes
  const handleFilterChange = (type: 'all' | 'month' | 'tag' | 'event') => {
    setFilterType(type);
  };

  // Handle photo selection
  const handleSelectPhoto = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedPhotos(prev => [...prev, id]);
    } else {
      setSelectedPhotos(prev => prev.filter(photoId => photoId !== id));
    }
  };

  // Get selected photos objects for preview
  const getSelectedPhotosObjects = (): Photo[] => {
    return filteredPhotos.filter(photo => selectedPhotos.includes(photo._id));
  };

  // Handle moving to step 2
  const handleContinue = () => {
    if (selectedPhotos.length === 0) {
      alert('Please select at least one photo');
      return;
    }
    setStep(2);
  };

  // Handle selecting all photos
  const handleSelectAll = () => {
    setSelectedPhotos(filteredPhotos.map(photo => photo._id));
  };

  // Handle deselecting all photos
  const handleDeselectAll = () => {
    setSelectedPhotos([]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Photo Album</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate a beautiful PDF album from your photos
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Step indicator */}
        <div className="bg-gray-100 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-2 ${
              step === 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 dark:bg-gray-500 text-gray-700 dark:text-gray-300'
            }`}>
              1
            </div>
            <div className="mr-4">
              <span className={`text-sm font-medium ${
                step === 1 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                Select Photos
              </span>
            </div>
            
            <div className="flex-grow h-0.5 bg-gray-300 dark:bg-gray-600 mx-2"></div>
            
            <div className="ml-4">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-2 ${
                step === 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 dark:bg-gray-500 text-gray-700 dark:text-gray-300'
              }`}>
                2
              </div>
            </div>
            <div>
              <span className={`text-sm font-medium ${
                step === 2 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                Create Album
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Step 1: Select Photos for Your Album
                </h2>
                
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-primary-500 mr-1.5" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Filter by Month
                      </h3>
                    </div>
                    <button
                      className={`btn ${
                        filterType === 'month' ? 'btn-primary' : 'btn-secondary'
                      } w-full mb-2`}
                      onClick={() => handleFilterChange('month')}
                    >
                      By Month
                    </button>
                    {filterType === 'month' && (
                      <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="input"
                      />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Tag className="h-5 w-5 text-primary-500 mr-1.5" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Filter by Tag
                      </h3>
                    </div>
                    <button
                      className={`btn ${
                        filterType === 'tag' ? 'btn-primary' : 'btn-secondary'
                      } w-full mb-2`}
                      onClick={() => handleFilterChange('tag')}
                    >
                      By Tag
                    </button>
                    {filterType === 'tag' && (
                      <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="input"
                      >
                        <option value="">Select a tag</option>
                        {allTags.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-primary-500 mr-1.5" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Filter by Event
                      </h3>
                    </div>
                    <button
                      className={`btn ${
                        filterType === 'event' ? 'btn-primary' : 'btn-secondary'
                      } w-full mb-2`}
                      onClick={() => handleFilterChange('event')}
                    >
                      By Event
                    </button>
                    {filterType === 'event' && (
                      <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="input"
                      >
                        <option value="">Select an event</option>
                        {allEvents.map((event) => (
                          <option key={event} value={event}>
                            {event}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Selection controls */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedPhotos.length} of {filteredPhotos.length} photos selected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="btn btn-secondary text-sm py-1"
                      disabled={filteredPhotos.length === 0}
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleDeselectAll}
                      className="btn btn-secondary text-sm py-1"
                      disabled={selectedPhotos.length === 0}
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Photo grid with selection */}
                <PhotoGrid
                  selectable={true}
                  selectedPhotos={selectedPhotos}
                  onSelectPhoto={handleSelectPhoto}
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end">
                <button
                  onClick={handleContinue}
                  disabled={selectedPhotos.length === 0}
                  className={`btn btn-primary ${
                    selectedPhotos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Step 2: Create Your Album
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="title" className="label">
                        Album Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label htmlFor="subtitle" className="label">
                        Subtitle (optional)
                      </label>
                      <input
                        type="text"
                        id="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="e.g., A collection of memories"
                        className="input"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        PDF Options
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={includePhotoTitles}
                            onChange={(e) => setIncludePhotoTitles(e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Include photo titles
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={includePhotoDescriptions}
                            onChange={(e) => setIncludePhotoDescriptions(e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Include photo descriptions
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={includeDateTaken}
                            onChange={(e) => setIncludeDateTaken(e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Include date taken
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
                      <div className="flex items-start">
                        <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300">
                            Preview Your Album
                          </h3>
                          <p className="text-sm text-primary-700 dark:text-primary-400 mt-1">
                            Your album includes {selectedPhotos.length} photos. Use the preview to see how your album will look before generating the PDF.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="btn btn-secondary"
                    >
                      Back
                    </button>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Album Preview
                    </h3>
                    
                    <AlbumPreview
                      photos={getSelectedPhotosObjects()}
                      title={title}
                      subtitle={subtitle}
                      includePhotoTitles={includePhotoTitles}
                      includePhotoDescriptions={includePhotoDescriptions}
                      includeDateTaken={includeDateTaken}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumCreator;