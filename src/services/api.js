const base_URL = "http://localhost:4000/api/";

// Fetch all sectors
export const getAllSectors = async () => {
  try {
    const response = await fetch(`${base_URL}getAllSectors`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getAllSectors:", error);
    throw error;
  }
};

// Fetch all stages
export const getAllStages = async () => {
  try {
    const response = await fetch(`${base_URL}getAllStages`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getAllStages:", error);
    throw error;
  }
};

// Fetch all ticket sizes
export const getAllTicketSizes = async () => {
  try {
    const response = await fetch(`${base_URL}getAllTicketSizes`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getAllTicketSizes:", error);
    throw error;
  }
};

// Fetch all statuses
export const getAllStatuses = async () => {
  try {
    const response = await fetch(`${base_URL}getAllStatuses`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getAllStatuses:", error);
    throw error;
  }
};

export const createDeal = async (data) => {
  try {
    let options = {
      method: "POST",
    };
    if (data instanceof FormData) {
      // Do not set Content-Type header for FormData; browser will set it
      options.body = data;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`${base_URL}createDeal`, options);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to create deal");
    }
    
    return result;
  } catch (error) {
    console.error("Error in createDeal:", error);
    throw error;
  }
};

// Register new investor
export const registerInvestor = async (investorData) => {
  try {
    const response = await fetch(`${base_URL}createInvestor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(investorData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to register investor");
    }
    
    return result;
  } catch (error) {
    console.error("Error in registerInvestor:", error);
    throw error;
  }
};

// Login investor
export const loginInvestor = async (email, password) => {
  try {
    const response = await fetch(`${base_URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Login failed");
    }
    
    return result;
  } catch (error) {
    console.error("Error in loginInvestor:", error);
    throw error;
  }
};

// Get pending investors (not approved)
export const getPendingInvestors = async () => {
  try {
    const response = await fetch(`${base_URL}getPendingInvestors`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch pending investors");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getPendingInvestors:", error);
    throw error;
  }
};

// Approve investor
export const approveInvestor = async (investorId) => {
  try {
    const response = await fetch(`${base_URL}approveInvestor/${investorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to approve investor");
    }
    
    return result;
  } catch (error) {
    console.error("Error in approveInvestor:", error);
    throw error;
  }
};

export const getInvestorDashboard = async (investorId) => {
  try {
    const response = await fetch(`${base_URL}getInvestorDashboard/${investorId}`);
    const result = await response.json();
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch investor dashboard");
    }
    return result;
  } catch (error) {
    console.error("Error in getInvestorDashboard:", error);
    throw error;
  }
};

// Reject investor
export const rejectInvestor = async (investorId, rejectionReason = "") => {
  try {
    const response = await fetch(`${base_URL}rejectInvestor/${investorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rejection_reason: rejectionReason }),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to reject investor");
    }
    
    return result;
  } catch (error) {
    console.error("Error in rejectInvestor:", error);
    throw error;
  }
};

// Toggle investor activation (activate/deactivate)
export const toggleInvestorActivation = async (investorId, isActive) => {
  try {
    const response = await fetch(`${base_URL}toggleInvestorActivation/${investorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_active: isActive }),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to toggle investor activation");
    }
    
    return result;
  } catch (error) {
    console.error("Error in toggleInvestorActivation:", error);
    throw error;
  }
};

// Delete investor
export const deleteInvestor = async (investorId) => {
  try {
    const response = await fetch(`${base_URL}deleteInvestor/${investorId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to delete investor");
    }
    
    return result;
  } catch (error) {
    console.error("Error in deleteInvestor:", error);
    throw error;
  }
};

// Get all EOIs
export const getAllEOIs = async () => {
  try {
    const response = await fetch(`${base_URL}getAllEOIs`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch EOIs");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getAllEOIs:", error);
    throw error;
  }
};

// Get EOIs by investor ID
export const getEOIsByInvestor = async (investorId) => {
  try {
    const response = await fetch(`${base_URL}getEOIsByInvestor/${investorId}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch investor EOIs");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getEOIsByInvestor:", error);
    throw error;
  }
};

// Get investor watchlist
export const getInvestorWatchlist = async (investorId) => {
  try {
    const response = await fetch(`${base_URL}getInvestorWatchlist/${investorId}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch investor watchlist");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getInvestorWatchlist:", error);
    throw error;
  }
};

// Get all NDA agreements
export const getAllSignedNDAs = async () => {
  try {
    const response = await fetch(`${base_URL}getAllSignedNDAs`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch NDA agreements");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getAllSignedNDAs:", error);
    throw error;
  }
};

// Get all deals
export const getAllDeals = async () => {
  try {
    const response = await fetch(`${base_URL}getAllDeals`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch deals");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getAllDeals:", error);
    throw error;
  }
};

// Get deal by ID
export const getDealById = async (dealId) => {
  try {
    const response = await fetch(`${base_URL}getDealInfo/${dealId}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch deal");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getDealById:", error);
    throw error;
  }
};

// Update deal
export const updateDeal = async (dealId, dealData) => {
  try {
    let options = {
      method: "PUT",
    };
    if (dealData instanceof FormData) {
      // Do not set Content-Type header for FormData; browser will set it
      options.body = dealData;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(dealData);
    }
    const response = await fetch(`${base_URL}updateDeal/${dealId}`, options);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to update deal");
    }
    
    return result;
  } catch (error) {
    console.error("Error in updateDeal:", error);
    throw error;
  }
};

// Delete a deal
export const deleteDeal = async (dealId) => {
  try {
    const response = await fetch(`${base_URL}deleteDeal/${dealId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to delete deal");
    }
    
    return result;
  } catch (error) {
    console.error("Error in deleteDeal:", error);
    throw error;
  }
};

// Get investor by ID
export const getInvestorById = async (investorId) => {
  try {
    const response = await fetch(`${base_URL}getInvestorInfo/${investorId}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch investor");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getInvestorById:", error);
    throw error;
  }
};

// Get approved investors
export const getApprovedInvestors = async () => {
  try {
    const response = await fetch(`${base_URL}getApprovedInvestors`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch approved investors");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getApprovedInvestors:", error);
    throw error;
  }
};

// Update investor profile
export const updateInvestor = async (investorId, investorData) => {
  try {
    const response = await fetch(`${base_URL}updateInvestor/${investorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(investorData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to update investor profile");
    }
    
    return result;
  } catch (error) {
    console.error("Error in updateInvestor:", error);
    throw error;
  }
};

// Get deal by slug
export const getDealBySlug = async (slug) => {
  try {
    const response = await fetch(`${base_URL}getDealBySlug/${slug}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch deal");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getDealBySlug:", error);
    throw error;
  }
};

// Check if EOI is submitted for a deal
export const checkEOIStatus = async (investorId, dealId) => {
  try {
    const response = await fetch(`${base_URL}checkEOIStatus?investor_id=${investorId}&deal_id=${dealId}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to check EOI status");
    }
    
    return result;
  } catch (error) {
    console.error("Error in checkEOIStatus:", error);
    throw error;
  }
};

// Check if NDA is signed for a deal
export const checkNDAStatus = async (investorId, dealId) => {
  try {
    const response = await fetch(`${base_URL}isNDASigned?investor_id=${investorId}&deal_id=${dealId}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to check NDA status");
    }
    
    return result;
  } catch (error) {
    console.error("Error in checkNDAStatus:", error);
    throw error;
  }
};

// Create EOI
export const createEOI = async (eoiData) => {
  try {
    const response = await fetch(`${base_URL}createEOI`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eoiData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to create EOI");
    }
    
    return result;
  } catch (error) {
    console.error("Error in createEOI:", error);
    throw error;
  }
};

// Sign NDA
export const signNDA = async (ndaData) => {
  try {
    const response = await fetch(`${base_URL}signNDA`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ndaData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to sign NDA");
    }
    
    return result;
  } catch (error) {
    console.error("Error in signNDA:", error);
    throw error;
  }
};

// Toggle deal in watchlist
export const toggleDealInWatchlist = async (investorId, dealId) => {
  try {
    const response = await fetch(`${base_URL}toggleDealInWatchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ investor_id: investorId, deal_id: dealId, created_by: 1 }),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to toggle deal in watchlist");
    }
    
    return result;
  } catch (error) {
    console.error("Error in toggleDealInWatchlist:", error);
    throw error;
  }
};

// Check if deal is in watchlist
export const isDealInWatchlist = async (investorId, dealId) => {
  try {
    const response = await fetch(`${base_URL}isDealInWatchlist?investor_id=${investorId}&deal_id=${dealId}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to check watchlist status");
    }
    
    return result;
  } catch (error) {
    console.error("Error in isDealInWatchlist:", error);
    throw error;
  }
};

// Blog API functions
export const getAllBlogs = async () => {
  try {
    const response = await fetch(`${base_URL}getAllBlogs`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch blogs");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getAllBlogs:", error);
    throw error;
  }
};

export const getBlogById = async (blogId) => {
  try {
    const response = await fetch(`${base_URL}getBlogById/${blogId}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch blog");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getBlogById:", error);
    throw error;
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await fetch(`${base_URL}getBlogBySlug/${slug}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch blog");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getBlogBySlug:", error);
    throw error;
  }
};

export const createBlog = async (data) => {
  try {
    let options = {
      method: "POST",
    };
    if (data instanceof FormData) {
      // Do not set Content-Type header for FormData; browser will set it
      options.body = data;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`${base_URL}createBlog`, options);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to create blog");
    }
    
    return result;
  } catch (error) {
    console.error("Error in createBlog:", error);
    throw error;
  }
};

// Save blog as draft
export const saveBlogDraft = async (data) => {
  try {
    let options = {
      method: "POST",
    };
    if (data instanceof FormData) {
      // Do not set Content-Type header for FormData; browser will set it
      options.body = data;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`${base_URL}saveBlogDraft`, options);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to save blog draft");
    }
    
    return result;
  } catch (error) {
    console.error("Error in saveBlogDraft:", error);
    throw error;
  }
};

export const updateBlog = async (blogId, data) => {
  try {
    let options = {
      method: "PUT",
    };
    if (data instanceof FormData) {
      // Do not set Content-Type header for FormData; browser will set it
      options.body = data;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`${base_URL}updateBlog/${blogId}`, options);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to update blog");
    }
    
    return result;
  } catch (error) {
    console.error("Error in updateBlog:", error);
    throw error;
  }
};

export const publishBlog = async (blogId) => {
  try {
    const response = await fetch(`${base_URL}publishBlog/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to publish blog");
    }
    
    return result;
  } catch (error) {
    console.error("Error in publishBlog:", error);
    throw error;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const response = await fetch(`${base_URL}deleteBlog/${blogId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to delete blog");
    }
    
    return result;
  } catch (error) {
    console.error("Error in deleteBlog:", error);
    throw error;
  }
};

// Testimonial API functions
export const getAllTestimonials = async () => {
  try {
    const response = await fetch(`${base_URL}getAllTestimonials`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch testimonials");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getAllTestimonials:", error);
    throw error;
  }
};

export const createTestimonial = async (data) => {
  try {
    let options = {
      method: "POST",
    };
    if (data instanceof FormData) {
      // Do not set Content-Type header for FormData; browser will set it
      options.body = data;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`${base_URL}createTestimonial`, options);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to create testimonial");
    }
    
    return result;
  } catch (error) {
    console.error("Error in createTestimonial:", error);
    throw error;
  }
};

export const getTestimonialById = async (testimonialId) => {
  try {
    const response = await fetch(`${base_URL}getTestimonialById/${testimonialId}`);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to fetch testimonial");
    }
    
    return result;
  } catch (error) {
    console.error("Error in getTestimonialById:", error);
    throw error;
  }
};

export const updateTestimonial = async (testimonialId, data) => {
  try {
    let options = {
      method: "PUT",
    };
    if (data instanceof FormData) {
      // Do not set Content-Type header for FormData; browser will set it
      options.body = data;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`${base_URL}updateTestimonial/${testimonialId}`, options);
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to update testimonial");
    }
    
    return result;
  } catch (error) {
    console.error("Error in updateTestimonial:", error);
    throw error;
  }
};

export const deleteTestimonial = async (testimonialId) => {
  try {
    const response = await fetch(`${base_URL}deleteTestimonial/${testimonialId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to delete testimonial");
    }
    
    return result;
  } catch (error) {
    console.error("Error in deleteTestimonial:", error);
    throw error;
  }
};

// Sector Management APIs
export const createSector = async (sectorData) => {
  try {
    const response = await fetch(`${base_URL}createSector`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sectorData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to create sector");
    }
    
    return result;
  } catch (error) {
    console.error("Error in createSector:", error);
    throw error;
  }
};

export const updateSector = async (sectorId, sectorData) => {
  try {
    const response = await fetch(`${base_URL}updateSector/${sectorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sectorData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to update sector");
    }
    
    return result;
  } catch (error) {
    console.error("Error in updateSector:", error);
    throw error;
  }
};

export const deleteSector = async (sectorId) => {
  try {
    const response = await fetch(`${base_URL}deleteSector/${sectorId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to delete sector");
    }
    
    return result;
  } catch (error) {
    console.error("Error in deleteSector:", error);
    throw error;
  }
};

// Stage Management APIs
export const createStage = async (stageData) => {
  try {
    const response = await fetch(`${base_URL}createStage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stageData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to create stage");
    }
    
    return result;
  } catch (error) {
    console.error("Error in createStage:", error);
    throw error;
  }
};

export const updateStage = async (stageId, stageData) => {
  try {
    const response = await fetch(`${base_URL}updateStage/${stageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stageData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to update stage");
    }
    
    return result;
  } catch (error) {
    console.error("Error in updateStage:", error);
    throw error;
  }
};

export const deleteStage = async (stageId) => {
  try {
    const response = await fetch(`${base_URL}deleteStage/${stageId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to delete stage");
    }
    
    return result;
  } catch (error) {
    console.error("Error in deleteStage:", error);
    throw error;
  }
};

// Status Management APIs
export const createStatus = async (statusData) => {
  try {
    const response = await fetch(`${base_URL}createStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to create status");
    }
    
    return result;
  } catch (error) {
    console.error("Error in createStatus:", error);
    throw error;
  }
};

export const updateStatus = async (statusId, statusData) => {
  try {
    const response = await fetch(`${base_URL}updateStatus/${statusId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to update status");
    }
    
    return result;
  } catch (error) {
    console.error("Error in updateStatus:", error);
    throw error;
  }
};

export const deleteStatus = async (statusId) => {
  try {
    const response = await fetch(`${base_URL}deleteStatus/${statusId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to delete status");
    }
    
    return result;
  } catch (error) {
    console.error("Error in deleteStatus:", error);
    throw error;
  }
};

// Ticket Size Management APIs
export const createTicketSize = async (ticketSizeData) => {
  try {
    const response = await fetch(`${base_URL}createTicketSize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketSizeData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to create ticket size");
    }
    
    return result;
  } catch (error) {
    console.error("Error in createTicketSize:", error);
    throw error;
  }
};

export const updateTicketSize = async (ticketSizeId, ticketSizeData) => {
  try {
    const response = await fetch(`${base_URL}updateTicketSize/${ticketSizeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketSizeData),
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to update ticket size");
    }
    
    return result;
  } catch (error) {
    console.error("Error in updateTicketSize:", error);
    throw error;
  }
};

export const deleteTicketSize = async (ticketSizeId) => {
  try {
    const response = await fetch(`${base_URL}deleteTicketSize/${ticketSizeId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    
    if (result.status === "E") {
      throw new Error(result.error_info || "Failed to delete ticket size");
    }
    
    return result;
  } catch (error) {
    console.error("Error in deleteTicketSize:", error);
    throw error;
  }
};


