"use client";
import React, { useState, useEffect } from "react";
import ModalMessage from "@/components/investor/ModalMessage";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";
import { getAllSignedNDAs } from "../../../services/api";
import { FaEye } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function NDAReviewPanel() {
  const [ndas, setNdas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Set to 6 items per page for NDA
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pdfLoading, setPdfLoading] = useState({});

  // Fetch NDA agreements on component mount
  useEffect(() => {
    fetchNDAs();
  }, []);

  const fetchNDAs = async () => {
    try {
      setLoading(true);
      const response = await getAllSignedNDAs();
      if (response.result_info && response.result_info.signed_agreements) {
        setNdas(response.result_info.signed_agreements);
        console.log( response.result_info.signed_agreements);
        console.log(response.result_info.signed_agreements[0]?.pdf_content);
      } else {
        setNdas([]);
      }
    } catch (error) {
      console.error("Error fetching NDA agreements:", error);
      setErrorMessage("Failed to fetch NDA agreements. Please try again.");
      setShowError(true);
      setNdas([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  // Generate PDF from NDA HTML content
  const generatePDF = async (nda) => {
    if (!nda.pdf_content) {
      setErrorMessage("No PDF content available for this NDA");
      setShowError(true);
      return;
    }

    try {
      // Parse the HTML content to extract sections
      const parser = new DOMParser();
      const doc = parser.parseFromString(nda.pdf_content, 'text/html');
      
      // Helper to get next tag of a certain type
      function getNextTag(el, tagName) {
        let next = el?.nextSibling;
        while (next) {
          if (next.nodeType === 1 && next.tagName.toLowerCase() === tagName.toLowerCase()) return next;
          next = next.nextSibling;
        }
        return null;
      }
      // Extract deal details table
      const dealDetailsSection = Array.from(doc.querySelectorAll('h2')).find(h2 => h2.textContent.includes('Deal Details'));
      const dealDetailsTable = getNextTag(dealDetailsSection, 'table');
      // Extract investor details table
      const investorDetailsSection = Array.from(doc.querySelectorAll('h2')).find(h2 => h2.textContent.includes('Investor Details'));
      const investorDetailsTable = getNextTag(investorDetailsSection, 'table');
      // Extract agreement content
      const agreementSection = Array.from(doc.querySelectorAll('h2')).find(h2 => h2.textContent.includes('Agreement Content'));
      const agreementContent = getNextTag(agreementSection, 'div');

      // Create separate containers for each page
      const page1Container = document.createElement('div');
      const page2Container = document.createElement('div');
      const page3Container = document.createElement('div');

      // Page 1: Deal Details
      page1Container.innerHTML = `
        <div style="page-break-after: always;">
          <h1 style="text-align: center; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 30px;">
            NON-DISCLOSURE AGREEMENT
          </h1>
          <h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #3498db; padding-left: 10px;">
            Deal Details
          </h2>
          ${dealDetailsTable?.outerHTML || ''}
        </div>
      `;

      // Page 2: Investor Details
      page2Container.innerHTML = `
        <div style="page-break-after: always;">
          <h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #3498db; padding-left: 10px;">
            Investor Details
          </h2>
          ${investorDetailsTable?.outerHTML || ''}
        </div>
      `;

      // Page 3+: Agreement Content
      page3Container.innerHTML = `
        <div>
          <h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #3498db; padding-left: 10px;">
            Agreement Content
          </h2>
          ${agreementContent?.innerHTML || ''}
        </div>
      `;

      // Add CSS styling for better PDF output
      const style = document.createElement('style');
      style.textContent = `
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        h1 {
          color: #2c3e50;
          text-align: center;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        h2 {
          color: #34495e;
          margin-top: 30px;
          margin-bottom: 15px;
          border-left: 4px solid #3498db;
          padding-left: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #2c3e50;
        }
        p {
          margin: 10px 0;
          text-align: justify;
        }
        ol, ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        li {
          margin: 5px 0;
        }
        strong {
          color: #2c3e50;
        }
        small {
          color: #7f8c8d;
          font-style: italic;
        }
        @media print {
          .page-break { page-break-after: always; }
        }
      `;

      // Create main container with all pages
      const mainContainer = document.createElement('div');
      mainContainer.appendChild(style);
      // Add a wrapper with padding for all content
      const paddedWrapper = document.createElement('div');
      paddedWrapper.style.padding = '32px';
      paddedWrapper.style.background = 'white';
      paddedWrapper.appendChild(page1Container);
      paddedWrapper.appendChild(page2Container);
      paddedWrapper.appendChild(page3Container);
      mainContainer.appendChild(paddedWrapper);
      mainContainer.style.position = 'absolute';
      mainContainer.style.left = '-9999px';
      mainContainer.style.top = '-9999px';
      mainContainer.style.width = '800px';
      mainContainer.style.backgroundColor = 'white';
      document.body.appendChild(mainContainer);

      // Convert HTML to canvas using html2canvas
      const canvas = await html2canvas(mainContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: mainContainer.scrollHeight
      });

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add image to PDF
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate PDF blob and open in new tab
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const newWindow = window.open(blobUrl, '_blank');
      
      if (!newWindow) {
        setErrorMessage("Popup blocked. Please allow popups for this site to view the PDF.");
        setShowError(true);
      }

      // Clean up blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);

      // Clean up temporary container
      document.body.removeChild(mainContainer);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      setErrorMessage("Failed to generate PDF. Please try again.");
      setShowError(true);
    }
  };

  function filteredNdas() {
    let data = [...ndas];
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (nda) =>
          (nda.investor_name && nda.investor_name.toLowerCase().includes(s)) ||
          (nda.deal_name && nda.deal_name.toLowerCase().includes(s)) ||
          (nda.investor_mobile && nda.investor_mobile.includes(s)) ||
          (nda.signed_date && formatDate(nda.signed_date).toLowerCase().includes(s))
      );
    }
    return data;
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleExport = () => {
    const headers = ["Investor Name", "Deal Name", "NDA Signed Date", "Mobile Number"];
    const rows = filteredNdas().map((nda) => [
      nda.investor_name || "N/A",
      nda.deal_name || "N/A",
      nda.signed_date ? formatDate(nda.signed_date) : "N/A",
      nda.investor_mobile || "N/A",
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((x) => `"${x}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nda-agreements.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const ndasList = filteredNdas();
  const totalPages = Math.max(1, Math.ceil(ndasList.length / itemsPerPage));
  const paginatedNdas = ndasList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader 
          text="Loading..." 
          size="large" 
          showBackground={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="heading-main">NDA Management</h1>
      </div>

      {/* Search & Export */}
      <div className="flex flex-row items-center w-full justify-between py-3 mb-2">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="search-input w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="btn-primary btn-inline text-sm px-4 py-2 sm:w-auto"
          onClick={handleExport}
          disabled={paginatedNdas.length === 0}
        >
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full max-w-xs sm:max-w-sm md:max-w-full">
        <table className="table-main">
          <thead className="table-header-row">
            <tr>
              <th className="table-th">INVESTOR NAME</th>
              <th className="table-th">DEAL NAME</th>
              <th className="table-th">NDA SIGNED DATE</th>
              <th className="table-th">MOBILE NUMBER</th>
              <th className="table-th">VIEW DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedNdas.map((nda) => (
              <tr
                key={nda._id}
                className="table-row hover:bg-white cursor-pointer"
              >
                <td className="table-td whitespace-nowrap">
                  <span className="font-medium text-primarycolor">
                    {nda.investor_name || "N/A"}
                  </span>
                </td>
                <td className="table-td whitespace-nowrap">
                  <span className="font-medium">
                    {nda.deal_name || "N/A"}
                  </span>
                </td>
                <td className="table-td whitespace-nowrap">
                  {nda.signed_date ? formatDate(nda.signed_date) : "N/A"}
                </td>
                <td className="table-td whitespace-nowrap">
                  {nda.investor_mobile || "N/A"}
                </td>
                <td className="table-td whitespace-nowrap ">
                  <button
                    className="text-primarycolor hover:text-blue-700 transition-colors"
                    title="Generate PDF"
                    onClick={e => {
                      e.stopPropagation();
                      generatePDF(nda);
                    }}
                  >
                    <FaEye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedNdas.length === 0 && (
              <tr>
                <td colSpan={5} className="table-empty">
                  {ndas.length === 0 
                    ? "No NDA agreements found." 
                    : "No NDA agreements found for selected filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={ndasList.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Success Message Modal */}
      <ModalMessage
        show={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        type="success"
        message="NDA updated successfully!"
      />

      {/* Error Message Modal */}
      <ModalMessage
        show={showError}
        onClose={() => setShowError(false)}
        type="error"
        message={errorMessage}
      />
    </div>
  )
}