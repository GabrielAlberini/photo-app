import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Filter, Upload, Tag, Calendar } from 'lucide-react';
import { usePhotoStore } from '../stores/photoStore';
import PhotoGrid from '../components/photos/PhotoGrid';

type FilterType = 'all' | 'month' | 'tag' | 'event';

const Gallery: React.FC = () => {
  // Zustand selectors
  const photos = usePhotoStore(state => state.photos);
  const deletePhoto = usePhotoStore(state => state.deletePhoto);
  const getPhotosByMonth = usePhotoStore(state => state.getPhotosByMonth);
  const getPhotosByTag = usePhotoStore(state => state.getPhotosByTag);
  const getPhotosByEvent = usePhotoStore(state => state.getPhotosByEvent);

  // Local UI state
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [filteredPhotos, setFilteredPhotos] = useState(photos);
  const [showFilters, setShowFilters] = useState(false);

  // Compute unique tags & events
  const allTags = Array.from(new Set(photos.flatMap(photo => photo.tags)));
  const allEvents = Array.from(
    new Set(photos.filter(photo => photo.event).map(photo => photo.event as string))
  );

  // Update filteredPhotos when dependencies change
  useEffect(() => {
    let result;

    switch (filterType) {
      case 'month': {
        const [year, month] = selectedMonth.split('-').map(Number);
        result = getPhotosByMonth(year, month);
        break;
      }

      case 'tag': {
        result = selectedTag ? getPhotosByTag(selectedTag) : photos;
        break;
      }

      case 'event': {
        result = selectedEvent ? getPhotosByEvent(selectedEvent) : photos;
        break;
      }

      default:
        result = photos;
    }

    setFilteredPhotos(result);
  }, [photos, filterType, selectedMonth, selectedTag, selectedEvent, getPhotosByMonth, getPhotosByTag, getPhotosByEvent]);

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
    setShowFilters(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Photo Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Browse and manage your photo collection
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/upload" className="btn btn-primary">
            <Upload className="mr-1.5 h-4 w-4" />
            Upload Photos
          </Link>

          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(prev => !prev)}
          >
            <Filter className="mr-1.5 h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Month Filter */}
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-primary-500 mr-1.5" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Filter by Month
                </h3>
              </div>
              <button
                className={`btn ${filterType === 'month' ? 'btn-primary' : 'btn-secondary'} w-full mb-2`}
                onClick={() => handleFilterChange('month')}
              >
                By Month
              </button>
              {filterType === 'month' && (
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="input"
                />
              )}
            </div>

            {/* Tag Filter */}
            <div>
              <div className="flex items-center mb-2">
                <Tag className="h-5 w-5 text-primary-500 mr-1.5" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Filter by Tag
                </h3>
              </div>
              <button
                className={`btn ${filterType === 'tag' ? 'btn-primary' : 'btn-secondary'} w-full mb-2`}
                onClick={() => handleFilterChange('tag')}
              >
                By Tag
              </button>
              {filterType === 'tag' && (
                <select
                  value={selectedTag}
                  onChange={e => setSelectedTag(e.target.value)}
                  className="input"
                >
                  <option value="">Select a tag</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Event Filter */}
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-primary-500 mr-1.5" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Filter by Event
                </h3>
              </div>
              <button
                className={`btn ${filterType === 'event' ? 'btn-primary' : 'btn-secondary'} w-full mb-2`}
                onClick={() => handleFilterChange('event')}
              >
                By Event
              </button>
              {filterType === 'event' && (
                <select
                  value={selectedEvent}
                  onChange={e => setSelectedEvent(e.target.value)}
                  className="input"
                >
                  <option value="">Select an event</option>
                  {allEvents.map(event => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <button className="btn btn-secondary" onClick={() => handleFilterChange('all')}>
              Show All Photos
            </button>
            <button className="btn btn-secondary" onClick={() => setShowFilters(false)}>
              Close Filters
            </button>
          </div>
        </div>
      )}

      {/* Filter Indicator */}
      {filterType !== 'all' && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-md p-3 flex items-center">
          <div className="text-primary-700 dark:text-primary-400 mr-2">
            {filterType === 'month' && <Calendar className="h-5 w-5" />}
            {filterType === 'tag' && <Tag className="h-5 w-5" />}
            {filterType === 'event' && <Calendar className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary-700 dark:text-primary-400">
              {filterType === 'month' && `Showing photos from ${format(new Date(selectedMonth), 'MMMM yyyy')}`}
              {filterType === 'tag' && `Showing photos tagged with "${selectedTag}"`}
              {filterType === 'event' && `Showing photos from "${selectedEvent}"`}
            </p>
          </div>
          <button
            className="text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
            onClick={() => handleFilterChange('all')}
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Photo Grid */}
      <PhotoGrid photos={filteredPhotos} onDelete={deletePhoto} />

      {/* Photo Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
        {filterType !== 'all' && ' (filtered)'}
      </p>
    </div>
  );
};

export default Gallery;