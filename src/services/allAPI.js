import commonAPI from "./commonAPI"
import serverURL from "./serverURL"

// ==================== USER/ADMIN APIS (users collection) ====================

// Register API - Regular user registration
export const registerAPI = async (userDetails)=>{
   return await commonAPI("POST",`${serverURL}/register`,userDetails)
}

// Login API - Regular user login
export const loginAPI = async (userDetails)=>{
   return await commonAPI("POST",`${serverURL}/login`,userDetails)
}

// ✅ Admin Login API - Admin login (users collection)
export const adminLoginAPI = async (adminCredentials) => {
   return await commonAPI("POST", `${serverURL}/admin/login`, adminCredentials)
}

// ✅ Create Admin Account API - Create admin in users collection
export const createAdminAccountAPI = async (adminDetails) => {
   return await commonAPI("POST", `${serverURL}/admin/create`, adminDetails)
}

// Get All Users API - Admin only
export const getAllUsersAPI = async (token) => {
   return await commonAPI("GET", `${serverURL}/users`, {}, {
      "Authorization": `Bearer ${token}`
   })
}

// ==================== PET OWNER APIS (petregistrations collection) ====================

// Register API - Register pet with owner details (PUBLIC - no login required)
export const registerPetWithOwnerAPI = async (registrationDetails) => {
   return await commonAPI("POST", `${serverURL}/api/pets/register`, registrationDetails)
}

// Login API - Owner login
export const loginOwnerAPI = async (userDetails) => {
   return await commonAPI("POST", `${serverURL}/api/pets/login`, userDetails)
}

// Logout API - Owner logout
export const logoutOwnerAPI = async () => {
   return await commonAPI("GET", `${serverURL}/api/pets/logout`, {})
}

// ==================== PUBLIC APIS ====================

// ✅ Get Approved Pets API - Public endpoint (no authentication required)
export const getApprovedPetsAPI = async () => {
   return await commonAPI("GET", `${serverURL}/api/pets/approved-pets`, {})
}

// ✅ NEW: Submit Adoption Request API - PUBLIC (anyone can request to adopt)
export const submitAdoptionRequestAPI = async (petId, adopterData) => {
   return await commonAPI("POST", `${serverURL}/api/pets/adopt/${petId}`, adopterData)
}

// ✅ NEW: Get User's Adoption Requests by Email - PUBLIC (track adoption status)
export const getUserAdoptionRequestsAPI = async (adopterEmail) => {
   return await commonAPI("GET", `${serverURL}/api/pets/user-adoption-requests?email=${encodeURIComponent(adopterEmail)}`, {})
}

// ==================== PROTECTED APIS (require token) ====================

// Get My Profile API - Get logged-in owner's complete registration (owner + pet info)
export const getMyProfileAPI = async (token) => {
   return await commonAPI("GET", `${serverURL}/api/pets/my-profile`, {}, {
      "Authorization": `Bearer ${token}`
   })
}

// Update Pet Information API - Update pet details
export const updatePetInfoAPI = async (petData, token) => {
   return await commonAPI("PATCH", `${serverURL}/api/pets/update-pet`, petData, {
      "Authorization": `Bearer ${token}`
   })
}

// Update Owner Information API - Update owner phone number
export const updateOwnerInfoAPI = async (ownerData, token) => {
   return await commonAPI("PATCH", `${serverURL}/api/pets/update-owner`, ownerData, {
      "Authorization": `Bearer ${token}`
   })
}

// Update Password API - Change password
export const updatePasswordAPI = async (passwordData, token) => {
   return await commonAPI("PATCH", `${serverURL}/api/pets/update-password`, passwordData, {
      "Authorization": `Bearer ${token}`
   })
}

// ✅ NEW: Delete Pet Registration API - Owner can delete their registration
export const deleteMyRegistrationAPI = async (token) => {
   return await commonAPI("DELETE", `${serverURL}/api/pets/delete-registration`, {}, {
      "Authorization": `Bearer ${token}`
   })
}

// ✅ NEW: Get My Adoption Requests API - Owner can see adoption requests
export const getMyAdoptionRequestsAPI = async (token) => {
   return await commonAPI("GET", `${serverURL}/api/pets/my-adoption-requests`, {}, {
      "Authorization": `Bearer ${token}`
   })
}

// ✅ NEW: Update Adoption Request Status API - Owner can approve/reject requests
export const updateAdoptionRequestStatusAPI = async (adoptionId, statusData, token) => {
   return await commonAPI("PATCH", `${serverURL}/api/pets/adoption-request/${adoptionId}`, statusData, {
      "Authorization": `Bearer ${token}`
   })
}

// ==================== PRODUCT APIS ====================

// Register a new product
export const registerProductAPI = async (productData, token) => {
  return await commonAPI("POST", `${serverURL}/api/products`, productData, {
    "Authorization": token ? `Bearer ${token}` : '',
    "Content-Type": "application/json"
  });
};

// Get all products
export const getAllProductsAPI = async (filters = {}) => {
  const token = sessionStorage.getItem('token');
  const queryParams = new URLSearchParams(filters).toString();
  return await commonAPI("GET", `${serverURL}/api/products${queryParams ? `?${queryParams}` : ""}`, {}, {
    "Authorization": token ? `Bearer ${token}` : ''
  });
};

// Get single product by ID
export const getProductByIdAPI = async (productId) => {
  const token = sessionStorage.getItem('token');
  return await commonAPI("GET", `${serverURL}/api/products/${productId}`, {}, {
    "Authorization": token ? `Bearer ${token}` : ''
  });
};

// Update product
export const updateProductAPI = async (productId, updateData, token) => {
  return await commonAPI("PUT", `${serverURL}/api/products/${productId}`, updateData, {
    "Authorization": token ? `Bearer ${token}` : '',
    "Content-Type": "application/json"
  });
};

// Delete product (soft delete)
export const deleteProductAPI = async (productId, token) => {
  return await commonAPI("DELETE", `${serverURL}/api/products/${productId}`, {}, {
    "Authorization": token ? `Bearer ${token}` : ''
  });
};

// Update product stock
export const updateProductStockAPI = async (productId, stock, token) => {
  return await commonAPI("PATCH", `${serverURL}/api/products/${productId}/stock`, { stock }, {
    "Authorization": token ? `Bearer ${token}` : '',
    "Content-Type": "application/json"
  });
};

// Get products by category
export const getProductsByCategoryAPI = async (category) => {
  const token = sessionStorage.getItem('token');
  return await commonAPI("GET", `${serverURL}/api/products/category/${category}`, {}, {
    "Authorization": token ? `Bearer ${token}` : ''
  });
};

// Get featured products
export const getFeaturedProductsAPI = async () => {
  const token = sessionStorage.getItem('token');
  return await commonAPI("GET", `${serverURL}/api/products/featured/list`, {}, {
    "Authorization": token ? `Bearer ${token}` : ''
  });
};

// ==================== ADMIN PROTECTED APIS (Pet Registrations Management) ====================

// Get All Pet Registrations API - Admin only
export const getAllRegistrationsAPI = async (token) => {
   return await commonAPI("GET", `${serverURL}/api/admin/all-registrations`, {}, {
      "Authorization": `Bearer ${token}`
   })
}

// Update Registration Status API - Admin only
export const updateRegistrationStatusAPI = async (registrationId, statusData, token) => {
   return await commonAPI("PATCH", `${serverURL}/api/admin/status/${registrationId}`, statusData, {
      "Authorization": `Bearer ${token}`
   })
}