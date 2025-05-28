import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Tag, X, Camera } from 'lucide-react';
import { usePhotoStore } from '../stores/photoStore';
import PhotoUploader from '../components/photos/PhotoUploader';

const UploadPhotos: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [event, setEvent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { uploadPhotos, isLoading } = usePhotoStore();
  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handlePhotoUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Upload the photos with metadata
      await uploadPhotos(files, {
        title: title || undefined,
        description: description || undefined,
        tags: tags.length > 0 ? tags : undefined,
        event: event || undefined,
      });
      
      setUploadSuccess(true);
      
      // Reset form after successful upload
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setEvent('');
        setTags([]);
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Photos</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add photos to your collection with metadata
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {uploadSuccess ? (
            <div className="text-center py-8">
              <div className="bg-success-100 dark:bg-success-900/20 p-3 rounded-full inline-flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-success-600 dark:text-success-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Photos Uploaded Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your photos have been added to your collection.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/gallery')}
                  className="btn btn-primary"
                >
                  View Gallery
                </button>
                <button
                  onClick={() => setUploadSuccess(false)}
                  className="btn btn-secondary"
                >
                  Upload More
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className="label">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Family Vacation"
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="event" className="label">
                    Event (optional)
                  </label>
                  <input
                    type="text"
                    id="event"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    placeholder="e.g., Summer Vacation 2023"
                    className="input"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="label">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for these photos..."
                  rows={3}
                  className="input"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="label">Tags (optional)</label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}

                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Add a tag"
                      className="input py-1 text-sm w-32 sm:w-auto"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="ml-2 p-1 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-400 dark:hover:bg-primary-800"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Press Enter or click the + button to add a tag
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Upload Photos
                </h3>
                <PhotoUploader onUpload={handlePhotoUpload} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPhotos;