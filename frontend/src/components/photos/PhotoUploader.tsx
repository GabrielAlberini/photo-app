import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, Image } from 'lucide-react';

interface PhotoUploaderProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string[];
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onUpload,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = ['image/jpeg', 'image/png', 'image/jpg'],
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errorMessages = rejectedFiles.map((rejected) => {
          const file = rejected.file;
          const errors = rejected.errors.map((error: any) => error.message).join(', ');
          return `${file.name}: ${errors}`;
        });
        setError(errorMessages.join('\n'));
        return;
      }

      // Check if adding these would exceed the limit
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }

      setError(null);

      // Create previews
      const newPreviews = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setFiles((prev) => [...prev, ...acceptedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    [files.length, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((obj, curr) => ({ ...obj, [curr]: [] }), {}),
    maxSize,
    maxFiles,
  });

  const removeFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
    setPreviews((prev) => {
      // Revoke the object URL to prevent memory leaks
      const previewToRemove = prev.find((p) => p.file === fileToRemove);
      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove.preview);
      }
      return prev.filter((p) => p.file !== fileToRemove);
    });
  };

  const handleUpload = () => {
    if (files.length === 0) {
      setError('Please select at least one file to upload.');
      return;
    }
    
    onUpload(files);
    
    // Clear files after upload
    setPreviews((prev) => {
      // Revoke all object URLs
      prev.forEach((p) => URL.revokeObjectURL(p.preview));
      return [];
    });
    setFiles([]);
  };

  // Clean up previews on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, [previews]);

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
        }`}
      >
        <input {...getInputProps()} />
        <Upload
          className={`h-10 w-10 mb-3 ${
            isDragActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'
          }`}
        />
        <p className="text-sm text-center text-gray-700 dark:text-gray-300">
          {isDragActive
            ? 'Drop the photos here...'
            : 'Drag & drop photos here, or click to select files'}
        </p>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
          {`Accepts ${accept.join(', ')} up to ${maxSize / (1024 * 1024)}MB each (max ${maxFiles} files)`}
        </p>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {previews.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected photos ({previews.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {previews.map((item, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={item.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(item.file)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                  {item.file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={files.length === 0}
          className={`btn btn-primary ${
            files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Image className="mr-1.5 h-4 w-4" />
          Upload {files.length > 0 ? `(${files.length})` : ''}
        </button>
      </div>
    </div>
  );
};

export default PhotoUploader;