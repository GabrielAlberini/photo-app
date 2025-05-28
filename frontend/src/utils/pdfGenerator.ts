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
    
    // For demo purposes, we'll just simulate adding images
    // In a real implementation, we'd load and add actual images
    const yPosition = isFirstOnPage ? margin : (pageHeight / 2) + 10;
    
    // Placeholder for image (gray rectangle)
    doc.setFillColor(200, 200, 200);
    doc.rect(margin, yPosition, contentWidth, 80, 'F');
    
    // Add photo metadata if requested
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let textY = yPosition + 85;
    
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
      doc.text(photo.description, margin, textY, { maxWidth: contentWidth });
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