import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import type { Photo } from '../stores/photoStore';

interface PdfOptions {
  title: string;
  subtitle?: string;
  coverImageUrl?: string;
  includePhotoTitles: boolean;
  includePhotoDescriptions: boolean;
  includeDateTaken: boolean;
}

// Helper function to load image and convert to base64
async function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS if needed
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };
    
    img.src = url;
  });
}

// Helper function to calculate image dimensions to fit within bounds
function calculateImageDimensions(
  imgWidth: number,
  imgHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = imgWidth / imgHeight;
  
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  return { width, height };
}

export async function generateMonthlyPdf(photos: Photo[], options: PdfOptions): Promise<Blob> {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Create cover page
  doc.setFillColor(40, 116, 166); // Blue background for cover
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Add title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.text(options.title, pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
  
  // Add subtitle if provided
  if (options.subtitle) {
    doc.setFontSize(16);
    doc.text(options.subtitle, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
  }
  
  // Add date at bottom
  doc.setFontSize(12);
  doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, pageHeight - 20, { align: 'center' });

  // Load all images first
  const loadedImages: { [key: string]: string } = {};
  
  for (const photo of photos) {
    try {
      const base64Image = await loadImageAsBase64(photo.url);
      loadedImages[photo._id] = base64Image;
    } catch (error) {
      console.warn(`Failed to load image for photo ${photo._id}:`, error);
      // Continue without this image
    }
  }

  // Add photos
  let currentPage = 1;
  const photosPerPage = 2; // Number of photos per page
  
  for (let i = 0; i < photos.length; i++) {
    // Add a new page for each set of photos (except for first set which goes after cover)
    if (i % photosPerPage === 0 && i > 0) {
      doc.addPage();
      currentPage++;
    } else if (i === 0) {
      // First photo goes on new page after cover
      doc.addPage();
      currentPage++;
    }
    
    const photo = photos[i];
    const isFirstOnPage = i % photosPerPage === 0;
    
    // Calculate position for this photo
    const photoHeight = 80; // Height allocated for each photo
    const yPosition = isFirstOnPage ? margin : (pageHeight / 2) + 10;
    
    // Add the actual image if it was loaded successfully
    if (loadedImages[photo._id]) {
      try {
        // Create a temporary image to get dimensions
        const tempImg = new Image();
        tempImg.src = loadedImages[photo._id];
        
        // Calculate dimensions to fit within the allocated space
        const maxImageHeight = photoHeight - 10; // Leave some space for text
        const { width: imgWidth, height: imgHeight } = calculateImageDimensions(
          tempImg.width || 400,
          tempImg.height || 300,
          contentWidth,
          maxImageHeight
        );
        
        // Center the image horizontally
        const imgX = margin + (contentWidth - imgWidth) / 2;
        
        doc.addImage(
          loadedImages[photo._id],
          'JPEG',
          imgX,
          yPosition,
          imgWidth,
          imgHeight
        );
      } catch (error) {
        console.warn(`Failed to add image to PDF for photo ${photo._id}:`, error);
        // Fall back to placeholder
        doc.setFillColor(200, 200, 200);
        doc.rect(margin, yPosition, contentWidth, photoHeight - 10, 'F');
        
        // Add "Image not available" text
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text('Image not available', pageWidth / 2, yPosition + (photoHeight - 10) / 2, { align: 'center' });
      }
    } else {
      // Fallback: gray placeholder
      doc.setFillColor(200, 200, 200);
      doc.rect(margin, yPosition, contentWidth, photoHeight - 10, 'F');
      
      // Add "Image not available" text
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.text('Image not available', pageWidth / 2, yPosition + (photoHeight - 10) / 2, { align: 'center' });
    }
    
    // Add photo metadata if requested
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let textY = yPosition + photoHeight - 5;
    
    if (options.includePhotoTitles && photo.title) {
      doc.setFont(undefined, 'bold');
      doc.text(photo.title, margin, textY);
      textY += 6;
    }
    
    if (options.includeDateTaken) {
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.text(`Taken: ${format(new Date(photo.dateTaken), 'MMMM d, yyyy')}`, margin, textY);
      textY += 5;
    }
    
    if (options.includePhotoDescriptions && photo.description) {
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      // Split long descriptions into multiple lines
      const lines = doc.splitTextToSize(photo.description, contentWidth);
      doc.text(lines, margin, textY);
    }
  }
  
  // Return the PDF as a blob
  return doc.output('blob');
}

export function previewPdf(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

export function downloadPdf(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up
}

// Mock function for email sending - in a real app this would connect to a backend
export function emailPdf(blob: Blob, recipientEmail: string, subject: string, message: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Email would be sent to ${recipientEmail} with subject: ${subject}`);
      resolve(true);
    }, 2000);
  });
}