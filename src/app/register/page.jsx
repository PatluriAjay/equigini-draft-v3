"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Select from "react-select";
import AuthNavbar from "@/components/common/AuthNavbar";
import ModalMessage from "@/components/investor/ModalMessage";
import { registerInvestor, loginInvestor, getAllSectors, getAllTicketSizes } from "@/services/api";
import { FaUser, FaCog, FaInfoCircle, FaShieldAlt, FaRegFileAlt, FaUpload, FaUserPlus } from "react-icons/fa";

const investorTypes = [
  "HNWI",
  "Family Office",
  "Angel",
  "Other",
];
const sources = ["Referral", "LinkedIn", "Twitter", "Event", "Other"];
const countries = [
  { value: "India", label: "India" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "Singapore", label: "Singapore" },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
].sort();

const steps = [
  { name: "Basic Details", icon: FaInfoCircle },
  { name: "Deal Details", icon: FaRegFileAlt },
  { name: "Additional Information", icon: FaUserPlus },
  { name: "Verification", icon: FaShieldAlt },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    panNumber: "",
    investorType: null,
    geography: null,
    investmentRange: null,
    sectors: [],
    source: null,
    referralInput: "",
    address1: "",
    country: null,
    state: null,
    city: "",
    postalCode: "",
    otp: ["", "", "", "", "", ""],
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });
  const [agree, setAgree] = useState(false);
  const [showPasswordStep, setShowPasswordStep] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState({
    sectors: [],
    investmentRanges: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch dropdown options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [sectorsRes, ticketSizesRes] = await Promise.all([
          getAllSectors(),
          getAllTicketSizes(),
        ]);

        setDropdownOptions({
          sectors: sectorsRes.status === "S" ? sectorsRes.result_info.map(s => ({ value: s.name, label: s.name })) : [],
          investmentRanges: ticketSizesRes.status === "S" ? ticketSizesRes.result_info.map(t => ({ 
            value: t._id, 
            label: `${t.ticket_min || ''} - ${t.ticket_max || ''}` 
          })) : [],
        });
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, maxLength } = e.target;
    if (name === "sectors") {
      setForm((prev) => ({
        ...prev,
        sectors: checked
          ? [...prev.sectors, value]
          : prev.sectors.filter((s) => s !== value),
      }));
    } else if (name.startsWith("otp")) {
      // OTP input handling
      const idx = parseInt(name.replace("otp", ""), 10);
      let otpArr = [...form.otp];
      otpArr[idx] = value.slice(0, 1); // Only allow 1 digit per box
      setForm((prev) => ({ ...prev, otp: otpArr }));
      // Auto-focus next box if value entered
      if (value && maxLength === 1 && idx < 5) {
        const next = document.querySelector(`input[name=otp${idx + 1}]`);
        if (next) next.focus();
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (selectedOption, { name }) => {
    console.log(`handleSelectChange called for ${name}:`, selectedOption);
    setForm((prev) => {
      const newForm = {
        ...prev,
        [name]: selectedOption,
      };
      console.log(`Updated form state for ${name}:`, newForm[name]);
      return newForm;
    });
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.fullName || !form.email || !form.mobile) {
        setModalMessage({ show: true, type: "error", message: "Please fill all required fields." });
        return false;
      }
    } else if (step === 1) {
      if (!form.investmentRange || !form.sectors || form.sectors.length === 0) {
        setModalMessage({ show: true, type: "error", message: "Please fill all required fields." });
        return false;
      }
    } // Step 2: all fields optional
    else if (step === 3) {
      if (form.otp.some((d) => !d)) {
        setModalMessage({ show: true, type: "error", message: "Please enter the 6-digit OTP sent to your email." });
        return false;
      }
    }
    setModalMessage({ show: false, type: "success", message: "" });
    return true;
  };

  const validatePasswordStep = () => {
    if (!form.password || !form.confirmPassword) {
      setModalMessage({ show: true, type: "error", message: "Please fill all required fields." });
      return false;
    }
    if (form.password.length < 6) {
      setModalMessage({ show: true, type: "error", message: "Password must be at least 6 characters long." });
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setModalMessage({ show: true, type: "error", message: "Passwords do not match." });
      return false;
    }
    setModalMessage({ show: false, type: "success", message: "" });
    return true;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      // OTP submit, show password step
      setShowPasswordStep(true);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordStep()) return;
    
    setSubmitting(true);
    setModalMessage({ show: false, type: "success", message: "" });
    
    // Debug: Log current form state
    console.log("Current form state:", form);
    
    try {
      // Prepare investor data for registration
      const investorData = {
        full_name: form.fullName,
        email: form.email,
        mobile_number: form.mobile,
        pan_number: form.panNumber,
        password: form.password,
        investor_type: form.investorType?.value || "Other",
        geography: form.geography?.value || "India",
        investment_range: form.investmentRange?.label || null,
        preferred_sectors: form.sectors?.map(sector => sector.value) || [],
        source_of_discovery: form.source?.value === "Referral" ? form.referralInput : (form.source?.value || "Other"),
        address1: form.address1,
        city: form.city,
        state: form.state?.value || form.state || "",
        postal_code: form.postalCode,
        country: form.country?.value || "",
      };

      // Debug: Log the data being sent
      console.log("Form data being sent:", {
        investmentRange: form.investmentRange,
        sectors: form.sectors,
        investment_range: investorData.investment_range,
        preferred_sectors: investorData.preferred_sectors
      });

      // Register the investor
      const registrationResult = await registerInvestor(investorData);
      
      if (registrationResult.status === "S") {
        // Show success message
        setModalMessage({ show: true, type: "success", message: "Account created successfully! Click close to continue to login page." });
      } else {
        // Handle API error responses (like email already exists)
        const errorMessage = registrationResult.error_info || registrationResult.message || "Registration failed. Please try again.";
        setModalMessage({ show: true, type: "error", message: errorMessage });
      }
    } catch (error) {
      console.log("Caught error:", error);
      console.log("Error message:", error.message);
      setModalMessage({ show: true, type: "error", message: error.message || "Registration failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      // Clear any existing modal messages when going back
      setModalMessage({ show: false, type: "success", message: "" });
    }
  };

  const handleCancel = () => {
    router.push("/login");
  };

  // If showing password step, render different UI
  if (showPasswordStep) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF4]">
        <AuthNavbar rightText="Already have an account?" rightLink="/login" rightLinkText="Sign In" className="fixed top-0 left-0 right-0 z-10" />
        <div className="w-full flex flex-col items-center py-8 justify-center flex-1">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-card p-8">
            <h1 className="heading-main text-center text-primarycolor mb-6">
              Set Your Password
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Create a secure password to complete your registration
            </p>
            
            <form className="space-y-6" onSubmit={handlePasswordSubmit} autoComplete="off">
              <div>
                <label htmlFor="password" className="form-label mb-4-override ">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  className="form-input"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="form-label mb-4-override ">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  className="form-input"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                              </div>
                
                <div className="flex gap-4">
                <button
                  className="btn-secondary flex-1"
                  type="button"
                  onClick={() => {
                    setShowPasswordStep(false);
                    // Clear any existing modal messages when going back
                    setModalMessage({ show: false, type: "success", message: "" });
                  }}
                >
                  Back
                </button>
                <button
                  className={`btn-primary flex-1 ${
                    submitting ? "btn-disabled" : ""
                  }`}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Modal Message */}
        <ModalMessage
          show={modalMessage.show}
          type={modalMessage.type}
          message={modalMessage.message}
          onClose={() => {
            setModalMessage({ show: false, type: "success", message: "" });
            // Redirect when user clicks close on success modal
            if (modalMessage.type === "success" && modalMessage.message.includes("Account created successfully")) {
              router.push("/login");
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF4]">
      <AuthNavbar rightText="Already have an account?" rightLink="/login" rightLinkText="Sign In" className="fixed top-0 left-0 right-0 z-10" />
      <div className="w-full flex flex-col items-center py-8 justify-center flex-1">
        <div className="w-full max-w-5xl  bg-white rounded-2xl shadow-card p-8 py-12">
          <h1 className="heading-main text-center text-primarycolor mb-2-override">Investor Registration</h1>
          {/* Stepper */}
          <div className="flex justify-center items-center mb-8 w-full flex-1">
            {steps.map((stepObj, idx) => {
              const isActive = idx === step;
              const isCompleted = idx < step;
              const Icon = stepObj.icon;
              return (
                <>
                  <div key={stepObj.name} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-200
                        ${isActive || isCompleted ? "border-primarycolor" : "border-gray-300"}
                        bg-white`}
                    >
                      <Icon
                        className={`w-6 h-6
                          ${isActive || isCompleted ? "text-primarycolor" : "text-gray-400"}
                        `}
                      />
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium text-center
                        ${isActive ? "text-primarycolor" : "text-gray-500"}
                      `}
                    >
                      {stepObj.name}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-0 sm:mx-2 rounded-full transition-all duration-200"
                        ${idx < step ? "bg-primarycolor" : "bg-gray-300"}`}
                      style={{  alignSelf: 'center' }}
                    />
                  )}
                </>
              );
            })}
          </div>
          <form className="space-y-8" onSubmit={handleNext} autoComplete="off">
            {step === 0 && (
              <div>
                {/* <h2 className="heading-section mb-4">Basic Information</h2> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="fullName" className="form-label mb-4-override">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      className="form-input"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label mb-4-override ">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      className="form-input"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile" className="form-label mb-4-override ">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="mobile"
                      className="form-input"
                      name="mobile"
                      type="tel"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="panNumber" className="form-label mb-4-override ">
                      PAN Number
                    </label>
                    <input
                      id="panNumber"
                      className="form-input"
                      name="panNumber"
                      value={form.panNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="investorType" className="form-label mb-4-override ">
                      Investor Type
                    </label>
                    <Select
                      id="investorType"
                      name="investorType"
                      value={form.investorType}
                      onChange={(option) => handleSelectChange(option, { name: "investorType" })}
                      options={investorTypes.map(type => ({ value: type, label: type }))}
                      placeholder="Select investor type"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isClearable
                    />
                  </div>
                  <div>
                    <label htmlFor="geography" className="form-label mb-4-override ">
                      Geography
                    </label>
                    <Select
                      id="geography"
                      name="geography"
                      value={form.geography}
                      onChange={(option) => handleSelectChange(option, { name: "geography" })}
                      options={countries}
                      placeholder="Select country"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isClearable
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                {/* <h2 className="heading-section mb-4">Preferences</h2> */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="investmentRange" className="form-label mb-4-override ">
                      Investment Range  <span className="text-red-500">*</span>
                    </label>
                    <Select
                      id="investmentRange"
                      name="investmentRange"
                      value={form.investmentRange}
                      onChange={(option) => handleSelectChange(option, { name: "investmentRange" })}
                      options={dropdownOptions.investmentRanges}
                      placeholder={loading ? "Loading..." : "Select investment range"}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isClearable
                      isLoading={loading}
                      isDisabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="sectors" className="form-label mb-4-override ">Preferred Sectors <span className="text-red-500">*</span></label>
                    <Select
                      id="sectors"
                      name="sectors"
                      value={form.sectors}
                      onChange={(option) => handleSelectChange(option, { name: "sectors" })}
                      options={dropdownOptions.sectors}
                      placeholder={loading ? "Loading..." : "Select preferred sectors"}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isMulti
                      isLoading={loading}
                      isDisabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                {/* <h2 className="heading-section mb-4">Additional Information</h2> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="source" className="form-label mb-4-override ">
                      Source of Discovery
                    </label>
                    <Select
                      id="source"
                      name="source"
                      value={form.source}
                      onChange={(option) => handleSelectChange(option, { name: "source" })}
                      options={sources.map(source => ({ value: source, label: source }))}
                      placeholder="Select source of discovery"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isClearable
                    />
                  </div>
                  {form.source?.value === "Referral" && (
                    <div>
                      <label htmlFor="referralInput" className="form-label mb-4-override ">
                        Referral Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="referralInput"
                        className="form-input"
                        name="referralInput"
                        value={form.referralInput}
                        onChange={handleChange}
                        placeholder="Enter the name"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="address1" className="form-label mb-4-override ">
                      Address Line 1
                    </label>
                    <input
                      id="address1"
                      className="form-input"
                      name="address1"
                      value={form.address1}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="form-label mb-4-override ">
                      Country
                    </label>
                    <Select
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={(option) => handleSelectChange(option, { name: "country" })}
                      options={countries}
                      placeholder="Select country"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isClearable
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="form-label mb-4-override ">
                      State
                    </label>
                    {form.country?.value === "India" ? (
                      <Select
                        id="state"
                        name="state"
                        value={form.state}
                        onChange={(option) => handleSelectChange(option, { name: "state" })}
                        options={indianStates.map(state => ({ value: state, label: state }))}
                        placeholder="Select state"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        isClearable
                      />
                    ) : (
                      <input
                        id="state"
                        className="form-input"
                        name="state"
                        value={form.state || ""}
                        onChange={handleChange}
                        placeholder="Enter state"
                      />
                    )}
                  </div>
                  <div>
                    <label htmlFor="city" className="form-label mb-4-override ">
                      City
                    </label>
                    <input
                      id="city"
                      className="form-input"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="form-label mb-4-override ">
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      className="form-input"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                {/* <h2 className="heading-section mb-4">OTP Verification</h2> */}
                <p className="mb-4 text-sm text-gray-600">Please enter the 6-digit OTP sent to your email.</p>
                <div className="flex gap-2 justify-center mb-4">
                  {form.otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      name={`otp${idx}`}
                      maxLength={1}
                      className="w-10 h-12 text-center border-2 rounded text-lg font-bold focus:ring-2 focus:ring-primarycolor"
                      value={digit}
                      onChange={handleChange}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
              </div>
                          )}
              <div className="flex gap-4 mt-6">
              {step > 0 && (
                <button
                  className="btn-secondary flex-1"
                  type="button"
                  onClick={handleBack}
                >
                  Back
                </button>
              )}
              {step === 0 && (
                <button
                  className="btn-secondary flex-1"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
              <button
                className={`btn-primary flex-1 ${
                  submitting ? "btn-disabled" : ""
                }`}
                type="submit"
                disabled={submitting}
              >
                {step < 3 ? (
                  "Next"
                ) : (
                  <>
                    <span className="mr-2">📝</span> Verify OTP
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Modal Message */}
      <ModalMessage
        show={modalMessage.show}
        type={modalMessage.type}
        message={modalMessage.message}
        onClose={() => {
          setModalMessage({ show: false, type: "success", message: "" });
          // Redirect when user clicks close on success modal
          if (modalMessage.type === "success" && modalMessage.message.includes("Account created successfully")) {
            router.push("/login");
          }
        }}
      />
    </div>
  );
}
