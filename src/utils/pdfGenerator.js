import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Generate EOI PDF
export const generateEOIPDF = async (eoiData) => {
  try {
    // Create a temporary div to render the EOI content
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.padding = '40px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '12px';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#333';

    // Create the EOI content HTML
    tempDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: bold;">Expression of Interest</h1>
        <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">Equigini Investment Platform</p>
      </div>

      <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
          Deal Information
        </h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #374151;">Deal Title:</strong>
            <p style="margin: 5px 0; color: #1f2937;">${eoiData.deal_title || 'N/A'}</p>
          </div>
          <div>
            <strong style="color: #374151;">Deal ID:</strong>
            <p style="margin: 5px 0; color: #1f2937;">${eoiData.deal_id || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
          Investor Information
        </h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #374151;">Investor Name:</strong>
            <p style="margin: 5px 0; color: #1f2937;">${eoiData.investor_name || 'N/A'}</p>
          </div>
          <div>
            <strong style="color: #374151;">Mobile Number:</strong>
            <p style="margin: 5px 0; color: #1f2937;">${eoiData.investor_mobile || 'N/A'}</p>
          </div>
          <div>
            <strong style="color: #374151;">Investor ID:</strong>
            <p style="margin: 5px 0; color: #1f2937;">${eoiData.investor_id || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
          Investment Details
        </h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #374151;">Intended Ticket Size:</strong>
            <p style="margin: 5px 0; color: #1f2937;">${eoiData.intended_ticket_size || 'N/A'}</p>
          </div>
          <div>
            <strong style="color: #374151;">Timeline to Invest:</strong>
            <p style="margin: 5px 0; color: #1f2937;">${eoiData.timeline_to_invest || 'N/A'}</p>
          </div>
          <div>
            <strong style="color: #374151;">Preferred Contact Method:</strong>
            <p style="margin: 5px 0; color: #1f2937;">${eoiData.preferred_contact_method || 'N/A'}</p>
          </div>
        </div>
        ${eoiData.comments ? `
          <div style="margin-top: 15px;">
            <strong style="color: #374151;">Comments/Rationale:</strong>
            <p style="margin: 5px 0; color: #1f2937; white-space: pre-wrap;">${eoiData.comments}</p>
          </div>
        ` : ''}
      </div>

      <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
          Submission Details
        </h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #374151;">Submission Date:</strong>
            <p style="margin: 5px 0; color: #1f2937;">${new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <strong style="color: #374151;">Submission Time:</strong>
            <p style="margin: 5px 0; color: #1f2937;">${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 11px; margin: 0;">
          This document was generated automatically by the Equigini Investment Platform.<br>
          For any queries, please contact our support team.
        </p>
      </div>
    `;

    // Add the div to the document
    document.body.appendChild(tempDiv);

    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempDiv.scrollHeight
    });

    // Remove the temporary div
    document.body.removeChild(tempDiv);

    // Convert canvas to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Convert PDF to base64 string
export const pdfToBase64 = (pdf) => {
  return pdf.output('datauristring').split(',')[1];
};

// Generate and return base64 PDF string
export const generateEOIPDFBase64 = async (eoiData) => {
  try {
    const pdf = await generateEOIPDF(eoiData);
    return pdfToBase64(pdf);
  } catch (error) {
    console.error('Error generating PDF base64:', error);
    throw error;
  }
};

// Download PDF
export const downloadEOIPDF = async (eoiData, filename = 'EOI_Submission.pdf') => {
  try {
    const pdf = await generateEOIPDF(eoiData);
    pdf.save(filename);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}; 