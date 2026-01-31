import commonAPI from "./commonAPI"
import serverURL from "./serverURL"

// register API - called bu auth when register button is clicked

export const registerAPI = async (userDetails)=>{
   return await commonAPI("POST",`${serverURL}/register`,userDetails)
}

// login api
export const loginAPI = async (userDetails)=>{
   return await commonAPI("POST",`${serverURL}/login`,userDetails)
}

// Register API - Register pet with owner details
export const registerPetWithOwnerAPI = async (registrationDetails) => {
   return await commonAPI("POST", `${serverURL}/api/pets/register`, registrationDetails)
}

// Login API - Owner login
export const loginOwnerAPI = async (userDetails) => {
   return await commonAPI("POST", `${serverURL}/api/pets/login`, userDetails)
}

// Logout API - Owner logout
export const logoutAPI = async () => {
   return await commonAPI("GET", `${serverURL}/api/pets/logout`, {})
}

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

// Get All Registrations API - Admin only
export const getAllRegistrationsAPI = async (token) => {
   return await commonAPI("GET", `${serverURL}/api/pets/all-registrations`, {}, {
      "Authorization": `Bearer ${token}`
   })
}

// Update Registration Status API - Admin only
export const updateRegistrationStatusAPI = async (registrationId, statusData, token) => {
   return await commonAPI("PATCH", `${serverURL}/api/pets/status/${registrationId}`, statusData, {
      "Authorization": `Bearer ${token}`
   })
}