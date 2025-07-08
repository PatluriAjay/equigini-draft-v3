import React, { useState } from "react";
import { signNDA } from "../../services/api";
import ModalMessage from "./ModalMessage";

export default function NDAModal({ show, onClose, onSubmit, dealTitle, dealId }) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) {
      setShowValidationModal(true);
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Get investor data from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error("User data not found. Please login again.");
      }

      const user = JSON.parse(userData);
      
      // Prepare NDA data according to backend model
      const ndaData = {
        investor_id: user._id || user.id,
        investor_name: user.full_name || user.name || "",
        investor_email: user.email || "",
        investor_mobile: user.mobile_number || user.mobile || user.phone || user.contact_number || "",
        deal_id: dealId,
        deal_name: dealTitle,
        nda_signed: true,
        signed_date: new Date().toISOString(),
      };

      // Validate required fields
      if (!ndaData.investor_mobile) {
        throw new Error("Investor mobile number is required. Please update your profile.");
      }

      if (!ndaData.investor_email) {
        throw new Error("Investor email is required. Please update your profile.");
      }

      // Submit NDA to backend
      const result = await signNDA(ndaData);
      
      if (result.status === "S") {
        // Call parent onSubmit
        onSubmit();
      } else {
        throw new Error(result.error_info || "Failed to sign NDA");
      }
    } catch (err) {
      setError(err.message || "Failed to sign NDA");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
            onClick={onClose}
            aria-label="Close"
            disabled={loading}
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-4 text-primarycolor text-center tracking-wide">NON-DISCLOSURE AGREEMENT</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="text-base text-secondary3 mb-6 max-h-[60vh] overflow-y-auto" style={{fontFamily: 'Book Antiqua, serif'}}>
            <div dangerouslySetInnerHTML={{ __html: NDA_CONTENT }} />
            <div className="mt-8 border-t pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-16">
                <div className="flex-1 flex flex-col items-start">
                  <div className="font-semibold mb-1">SIGNED:</div>
                  <div className="mb-1">For and on behalf of</div>
                  <div className="font-bold mb-4">Pantomath Fund Advisors Private Limited</div>
                  <div className="w-full flex flex-col items-start">
                    <div className="h-8 border-b border-gray-400 w-56 mb-1"></div>
                    <div className="flex flex-col gap-3 w-full">
                      <div className="text-xs text-gray-500">Name:</div>
                      <div className="text-xs text-gray-500">Title:</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-start justify-between">
                  <div className="font-semibold mb-1">SIGNED:</div>
                  <div className="mb-1">For and on behalf of</div>
                  {/* <div className="font-bold mb-4">Pantomath</div> */}
                  <div className="w-full flex flex-col items-start">
                    <div className="h-8 border-b border-gray-400 w-56 mb-1"></div>
                    <div className="flex flex-col gap-3 w-full">
                      <div className="text-xs text-gray-500">Name:</div>
                      <div className="text-xs text-gray-500">Title:</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4 mb-2">
            <input 
              id="nda-agree" 
              type="checkbox" 
              className="mr-2" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="nda-agree" className="text-sm text-gray-700">
              I agree to the terms and conditions as set out by the user agreement. By clicking here, I state that I have read and understood the terms and conditions.
              <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button 
              className="btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Signing..." : "Sign NDA"}
            </button>
          </div>
        </div>
      </div>

      {/* Validation Modal */}
      <ModalMessage
        show={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        type="error"
        message="You must agree to the terms and conditions to proceed."
      />
    </>
  );
}
{/* <p style = 'text-align:center'><strong>NON-DISCLOSURE AGREEMENT</strong></p> */}
const NDA_CONTENT = `

<p>This Non-Disclosure Agreement (“Agreement”) is made on this 19 day of Jun 2025 (“Effective Date”)</p>
<p><strong>BETWEEN</strong></p>
<p><strong>Pantomath Fund Advisors Private Limited</strong>, a company incorporated in India under the Companies Act, 1956 and having its office at 406-408 Keshava Premises, Bandra Kurla Complex, Bandra-East, Mumbai, Maharashtra, India (hereinafter referred to as the <strong>“Disclosing Party”</strong>, which expression shall, unless repugnant to the context or meaning thereof, mean and include its successors and permitted assigns) of the First Part.</p>
<p><strong>AND</strong></p>
<p><strong>Raven</strong>, a Limited Partnership incorporated under the laws of United States of America having its headquarters at Mumbai (hereinafter referred to as the <strong>“Receiving Party”</strong>, which expression shall, unless repugnant to the context or meaning thereof, mean and include its directors, promoters, successors and permitted assigns) of the Second Part.</p>
<p>Collectively referred to as “Parties” and, individually a “Party”.</p>
<p><strong>WHEREAS:</strong></p>
<ol type="A"><li style='margin-bottom:10px;'>The Parties intend to enter into discussions with each other for a possible investment in Disclosing Party’s client.  (hereinafter referred to as the “Purpose”).</li>
<li>In order to proceed with the Purpose, the Disclosing Party has agreed to provide certain Confidential Information (hereinafter defined) concerning the Purpose and the Receiving Party has agreed to accept such Confidential Information on a strictly confidential basis and on the terms and conditions set out below.</li></ol>
<p><strong>IN CONSIDERATION</strong> of the Receiving Party having access to the Disclosing Party’s Confidential Information and for other good and valuable consideration (the receipt and sufficiency of which is hereby acknowledged), each Party agrees to the following terms and conditions:</p>
<p>1. The term “Confidential Information” for the purpose of this Agreement shall mean any and all information and/or data which is obtained, whether in writing, pictorially, in machine readable form, orally or by observation during their visits, in connection with the Purpose or otherwise, including but not limited to, all tangible information, documents, data, papers, statements, any business/ customer information and trade secrets relating to its business practices in connection with the above mentioned purpose or otherwise, and includes proprietary information.</p>
<p>2. Notwithstanding any other provision of this Agreement, the Parties acknowledge that Confidential Information shall not include any information that:</p>
<ol type="a">
<li style='margin-bottom:10px;'>is or becomes publicly available without breach of this Agreement;</li>
<li style='margin-bottom:10px;'>becomes lawfully available to either Party from a third party free from any confidentiality restriction;</li>
<li style='margin-bottom:10px;'>is required to be disclosed under any relevant law, regulation or order of court, provided the effected Party is given prompt notice of such requirement or such order and (where possible) provided the opportunity to contest it, and the scope of such disclosure is limited to the extent possible; or</li>
<li style='margin-bottom:10px;'>was previously in the possession of the Receiving Party and which was not acquired directly or indirectly from the Disclosing Party as evidenced by written records.</li>
</ol>
<p>3. The Receiving Party shall use the Confidential Information only for the Purpose and not disclose any of the Confidential Information to any third party without the Disclosing Party’s prior written consent.</p>
<p>4. The Receiving Party shall hold and keep in strictest confidence any and all Confidential Information and shall treat the Confidential Information with at least the same degree of care and protection as it would treat its own Confidential Information. </p>
<p>5. The Receiving Party shall not copy or reproduce in any way (including without limitation, store in any computer or electronic system) any Confidential Information or any documents containing Confidential Information without the Disclosing Party’s prior written consent.</p>
<p>6. The Receiving Party shall immediately upon request by the Disclosing Party deliver to the Disclosing Party all Confidential Information disclosed to the Receiving Party, including all copies (if any) made under clause 4.</p>
<p>7. The Receiving Party shall not use the Confidential Information to procure a commercial advantage over the Disclosing Party. 
<ol type="a"><li>The parties acknowledge that neither party has given consent to enter into an agreement for commercial advantage. Until such time as the parties may agree to enter into such agreement, use of information shall be strictly limited to evaluating confidential information for the Purpose</li></ol></p>
<p>8. The Receiving Party acknowledges that damages are not a sufficient remedy for the Disclosing Party for any breach of any of the Receiving Party’s undertakings herein provided and the Receiving Party further acknowledges that the Disclosing Party is entitled to specific performance or injunctive relief (as appropriate) as a remedy for any breach or threatened breach of those undertakings by the Receiving Party, in addition to any other remedies available to the Disclosing Party in law or in equity.</p>
<p>9. The Receiving Party does not acquire any intellectual property rights under this Agreement or through any disclosure hereunder, except the limited right to use such Confidential Information in accordance with the Purpose under this Agreement.  </p>
<p>10. Receiving Party shall not modify or erase the logos, trademarks etc., of Disclosing Party or any third party present on the Confidential Information. Neither party shall use or display the logos, trademarks etc., of the other party in any advertisement, press etc., without the prior written consent of the other party.</p>
<p>11. The receiving party shall not use the confidential data for its own business advantage or the advantage any of its portfolio companies that amounts to loss of profits or loss of business directly or indirectly to the Disclosing Party’s client.</p>
<p>12. No failure or delay by either Party in exercising or enforcing any right, remedy or power hereunder shall operate as a waiver thereof, nor shall any single or partial exercise or enforcement of any right, remedy or power preclude any further exercise or enforcement thereof or the exercise or enforcement of any other right, remedy or power.</p>
<p>13. This Agreement shall be governed by the laws of India and subject to the jurisdiction of the courts in Mumbai.</p>
<p>14. This Agreement supersedes all prior discussions and writings with respect to the subject matter hereof, and constitutes the entire agreement between the parties with respect to the subject matter hereof. No waiver or modification of this Agreement will be binding upon either Party unless made in writing and signed by a duly authorized representative of each Party.  </p>
<p>15. In the event that any of the provisions of this Agreement shall be held by a court or other tribunal of competent jurisdiction to be unenforceable, the remaining portions hereof shall remain in full force and effect.</p>
<p>16. Nothing in this Agreement shall preclude either party from engaging in discussions with any third party (ies) regarding the Purpose, provided that the terms of this Agreement are strictly complied with during such discussions.</p>
<p>17. The Receiving Party hereby agrees for itself and any of its related parties, group entities and portfolio companies, to not directly contact and bypass the Disclosing Party and reach out to the Client introduced by the Disclosing Party, directly or indirectly, by or through any other party for the Purpose or any other commercial interest related to the Purpose, without the specific written consent and approval of the Disclosing Party.</p>
<p>18. All obligations respecting the Confidential Information already provided hereunder shall survive for a period of one year (1 year) after the date that the specific Confidential Information was first disclosed.</p>
<p>19. This Agreement is valid for a period of 1 year from the above-mentioned date or till signing of Share Purchase Agreement, whichever is earlier.</p>
<p>20. This Agreement is valid and binding on the successors-in-title and permitted assigns of the respective Parties.</p>
<p>IN WITNESS WHEREOF this Agreement has been executed by the duly authorized representative of each Party on the day and year first above written.</p>
`;
