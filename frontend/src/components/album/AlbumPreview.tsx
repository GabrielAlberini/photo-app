import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Download, Mail } from 'lucide-react';
import { Photo } from '../../stores/photoStore';
import { generateMonthlyPdf, downloadPdf, emailPdf } from '../../utils/pdfGenerator';

interface AlbumPreviewProps {
  photos: Photo[];
  title: string;
  subtitle?: string;
  includePhotoTitles: boolean;
  includePhotoDescriptions: boolean;
  includeDateTaken: boolean;
}

const AlbumPreview: React.FC<AlbumPreviewProps> = ({
  photos,
  title,
  subtitle,
  includePhotoTitles,
  includePhotoDescriptions,
  includeDateTaken,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Calculate total pages (cover + photos)
  useEffect(() => {
    // 1 cover page + 1 page for every 2 photos (rounded up)
    const photoPages = Math.ceil(photos.length / 2);
    setTotalPages(1 + photoPages);
  }, [photos]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handleGeneratePdf = async () => {
    if (photos.length === 0) return;

    setIsGeneratingPdf(true);
    try {
      const blob = await generateMonthlyPdf(photos, {
        title,
        subtitle,
        includePhotoTitles,
        includePhotoDescriptions,
        includeDateTaken,
      });
      setPdfBlob(blob);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfBlob) return;
    
    const filename = `${title.replace(/\s+/g, '_')}.pdf`;
    downloadPdf(pdfBlob, filename);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfBlob || !email) return;
    
    setIsSending(true);
    try {
      await emailPdf(
        pdfBlob,
        email,
        `Your Photo Album: ${title}`,
        `Here's your photo album "${title}" created with PhotoChronicle.`
      );
      setEmailSent(true);
      setTimeout(() => {
        setShowEmailForm(false);
        setEmailSent(false);
        setEmail('');
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Render mock preview pages
  const renderPagePreview = () => {
    if (currentPage === 0) {
      // Cover page
      return (
        <div className="aspect-w-3 aspect-h-4 bg-primary-600 rounded-lg shadow-lg p-8 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          {subtitle && <p className="text-lg mb-6">{subtitle}</p>}
          <p className="text-sm mt-auto">Created with PhotoChronicle</p>
        </div>
      );
    } else {
      // Photo pages (2 photos per page)
      const startIdx = (currentPage - 1) * 2;
      const pagePhotos = photos.slice(startIdx, startIdx + 2);
      
      return (
        <div className="aspect-w-3 aspect-h-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col space-y-4">
          {pagePhotos.map((photo, idx) => (
            <div key={photo.id} className="flex-1 flex flex-col">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                <img 
                  src={photo.thumbnailUrl} 
                  alt={photo.title} 
                  className="w-full h-full object-contain"
                />
              </div>
              {includePhotoTitles && photo.title && (
                <h3 className="text-sm font-medium mt-2 text-gray-900 dark:text-white">{photo.title}</h3>
              )}
              {includeDateTaken && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {new Date(photo.dateTaken).toLocaleDateString()}
                </p>
              )}
              {includePhotoDescriptions && photo.description && (
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{photo.description}</p>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-sm mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="btn btn-secondary p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="btn btn-secondary p-2"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Page preview */}
        {renderPagePreview()}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleGeneratePdf}
          disabled={isGeneratingPdf || photos.length === 0}
          className="btn btn-primary"
        >
          {isGeneratingPdf ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : pdfBlob ? (
            'Regenerate PDF'
          ) : (
            'Generate PDF'
          )}
        </button>
        
        {pdfBlob && (
          <>
            <button onClick={handleDownloadPdf} className="btn btn-secondary">
              <Download className="mr-1.5 h-4 w-4" />
              Download PDF
            </button>
            
            <button 
              onClick={() => setShowEmailForm(!showEmailForm)} 
              className="btn btn-secondary"
            >
              <Mail className="mr-1.5 h-4 w-4" />
              Email PDF
            </button>
          </>
        )}
      </div>
      
      {/* Email form */}
      {showEmailForm && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Send album via email
          </h3>
          
          {emailSent ? (
            <div className="flex items-center text-success-600 dark:text-success-400">
              <Check className="h-5 w-5 mr-1.5" />
              <p>Email sent successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recipient@example.com"
                required
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={isSending || !email}
                className="btn btn-primary"
              >
                {isSending ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  'Send'
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default AlbumPreview;