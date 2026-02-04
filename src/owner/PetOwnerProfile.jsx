import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Lock, Mail, Phone, Heart, 
  LogOut, Edit3, Save, X, CheckCircle, XCircle, 
  Clock, Image as ImageIcon, AlertCircle,
  PawPrint, MapPin, Calendar, FileText, MessageSquare, Trash2
} from 'lucide-react';
import { 
  getMyProfileAPI, 
  updatePetInfoAPI, 
  updateOwnerInfoAPI,
  updatePasswordAPI,
  getMyAdoptionRequestsAPI,
  updateAdoptionRequestStatusAPI,
  logoutOwnerAPI,
  deleteMyRegistrationAPI
} from "../services/allAPI";
import Footer from '../Home/components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PetOwnerProfile() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, adoptions, settings
  
  // Profile state
  const [profile, setProfile] = useState(null);
  const [editingPet, setEditingPet] = useState(false);
  const [editingOwner, setEditingOwner] = useState(false);
  
  // Edit forms
  const [petEditData, setPetEditData] = useState({});
  const [ownerEditData, setOwnerEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Adoption requests
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loadingAdoptions, setLoadingAdoptions] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  
  // Image upload
  const [uploadingImages, setUploadingImages] = useState(false);

  // Helper function to format age display
  const formatAge = (age) => {
    if (!age) return 'Not specified';
    const ageNum = parseFloat(age);
    if (ageNum < 1) {
      const months = Math.round(ageNum * 12);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
    return `${ageNum} ${ageNum === 1 ? 'year' : 'years'}`;
  };

  // Check if user is logged in as pet owner
  useEffect(() => {
    const savedToken = sessionStorage.getItem('petOwnerToken');
    if (savedToken) {
      setToken(savedToken);
      fetchProfile(savedToken);
    } else {
      toast.warning('Please login as pet owner to access this page');
      setTimeout(() => {
        navigate('/petreg');
      }, 2000);
    }
  }, [navigate]);

  // Fetch profile data
  const fetchProfile = async (authToken) => {
    try {
      const response = await getMyProfileAPI(authToken);
      if (response.status === 200) {
        const registration = response.data.data.registration;
        
        // Check if pet has been adopted and profile is inactive
        if (!registration.isActive && registration.pet.adoptionStatus === 'adopted') {
          toast.success('🎉 Congratulations! Your pet has been successfully adopted!');
          setTimeout(() => {
            handleLogout();
            navigate('/');
          }, 2000);
          return;
        }
        
        setProfile(registration);
        setPetEditData(registration.pet);
        setOwnerEditData({
          phone: registration.owner.phone
        });
        
        // Immediately fetch adoption requests after profile loads
        fetchAdoptionRequests(authToken);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Fetch adoption requests
  const fetchAdoptionRequests = async (authToken = token) => {
    if (!authToken) return;
    
    setLoadingAdoptions(true);
    try {
      const response = await getMyAdoptionRequestsAPI(authToken);
      if (response.status === 200) {
        const adoptions = response.data.data.adoptions;
        setAdoptionRequests(adoptions);
        
        // Count pending requests
        const pending = adoptions.filter(a => a.adoptionStatus === 'pending').length;
        setPendingCount(pending);
      }
    } catch (error) {
      console.error('Error fetching adoption requests:', error);
    } finally {
      setLoadingAdoptions(false);
    }
  };

  useEffect(() => {
    if (token && activeTab === 'adoptions') {
      fetchAdoptionRequests();
    }
  }, [token, activeTab]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutOwnerAPI();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    sessionStorage.removeItem('petOwnerToken');
    setToken(null);
    setProfile(null);
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please upload only JPG, PNG, or WEBP images');
      return;
    }

    const currentPhotos = petEditData.photos || [];
    if (currentPhotos.length + files.length > 5) {
      toast.warning('Maximum 5 images allowed');
      return;
    }

    setUploadingImages(true);

    try {
      const base64Images = await Promise.all(
        files.map(file => convertToBase64(file))
      );

      setPetEditData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...base64Images]
      }));

      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error uploading images');
    } finally {
      setUploadingImages(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeImage = (index) => {
    setPetEditData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Handle pet info update
  const handleUpdatePet = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await updatePetInfoAPI({ pet: petEditData }, token);
      if (response.status === 200) {
        toast.success('Pet information updated successfully!');
        setEditingPet(false);
        fetchProfile(token);
      }
    } catch (error) {
      console.error('Error updating pet info:', error);
      toast.error(error.response?.data?.message || 'Failed to update pet information');
    } finally {
      setLoading(false);
    }
  };

  // Handle owner info update
  const handleUpdateOwner = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await updateOwnerInfoAPI(ownerEditData, token);
      if (response.status === 200) {
        toast.success('Contact information updated successfully!');
        setEditingOwner(false);
        fetchProfile(token);
      }
    } catch (error) {
      console.error('Error updating owner info:', error);
      toast.error(error.response?.data?.message || 'Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    
    try {
      const response = await updatePasswordAPI({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, token);
      
      if (response.status === 200) {
        toast.success('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Handle adoption status update
  const handleAdoptionStatus = async (adoptionId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this adoption request?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await updateAdoptionRequestStatusAPI(adoptionId, { adoptionStatus: status }, token);
      if (response.status === 200) {
        toast.success(`Adoption request ${status} successfully!`);
        
        // Refresh adoption requests and profile
        await fetchAdoptionRequests();
        await fetchProfile(token);
      }
    } catch (error) {
      console.error('Error updating adoption status:', error);
      toast.error(error.response?.data?.message || 'Failed to update adoption status');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete registration
  const handleDeleteRegistration = async () => {
    const confirmMessage = `⚠️ WARNING: This action cannot be undone!\n\nAre you absolutely sure you want to delete your pet registration?\n\nThis will:\n✗ Remove your pet from the adoption listings\n✗ Delete all pet information and photos\n✗ Remove your account permanently\n\nType "DELETE" to confirm:`;
    
    const userInput = window.prompt(confirmMessage);
    
    if (userInput !== "DELETE") {
      if (userInput !== null) {
        toast.error('Deletion cancelled. You must type "DELETE" to confirm.');
      }
      return;
    }

    setLoading(true);
    try {
      const response = await deleteMyRegistrationAPI(token);
      if (response.status === 200) {
        toast.success('Pet registration deleted successfully. Goodbye! 👋');
        
        // Clear session and redirect
        sessionStorage.removeItem('petOwnerToken');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast.error(error.response?.data?.message || 'Failed to delete registration');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border-2 border-purple-500/30 mb-6">
              <PawPrint className="w-12 h-12 text-purple-400" />
            </div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4 animate-gradient">
              Pet Owner Dashboard
            </h1>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Manage your pet's profile and track adoption requests
            </p>
          </div>

          {/* Status Alert */}
          {profile.status === 'pending' && (
            <div className="mb-8 p-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl animate-fade-in">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">Registration Pending Approval</h3>
                  <p className="text-yellow-200">
                    Your pet registration is currently under review by our admin team. 
                    Once approved, your pet will appear on the public adoption page.
                  </p>
                </div>
              </div>
            </div>
          )}

          {profile.status === 'approved' && profile.pet.adoptionStatus === 'available' && (
            <div className="mb-8 p-6 bg-green-500/10 border-2 border-green-500/30 rounded-2xl animate-fade-in">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">Registration Approved! 🎉</h3>
                  <p className="text-green-200">
                    Your pet is now visible on the adoption page. People can view and submit adoption requests!
                  </p>
                </div>
              </div>
            </div>
          )}

          {profile.status === 'rejected' && (
            <div className="mb-8 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-2xl animate-fade-in">
              <div className="flex items-start gap-4">
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">Registration Rejected</h3>
                  <p className="text-red-200">
                    Your pet registration was rejected by the admin. Please contact support for more information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-4 mb-8 bg-slate-800/50 backdrop-blur-sm p-2 rounded-2xl border-2 border-purple-500/30">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-700/50 text-purple-200 hover:bg-slate-700'
              }`}
            >
              <User className="w-5 h-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('adoptions')}
              className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 relative ${
                activeTab === 'adoptions'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-700/50 text-purple-200 hover:bg-slate-700'
              }`}
            >
              <Heart className="w-5 h-5" />
              Adoption Requests
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-700/50 text-purple-200 hover:bg-slate-700'
              }`}
            >
              <Lock className="w-5 h-5" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-4 rounded-xl font-bold bg-red-500/20 text-red-400 border-2 border-red-500/30 hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Pet Information Section */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-3">
                      <PawPrint className="w-8 h-8 text-purple-400" />
                      Pet Information
                    </h2>
                    {!editingPet ? (
                      <button
                        onClick={() => setEditingPet(true)}
                        className="px-6 py-3 bg-purple-500/20 border-2 border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-all flex items-center gap-2 font-semibold"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Pet Info
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingPet(false);
                            setPetEditData(profile.pet);
                          }}
                          className="px-6 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-all flex items-center gap-2 font-semibold"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdatePet}
                          disabled={loading}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2 font-semibold disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>

                  {!editingPet ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pet Photos */}
                      {profile.pet.photos && profile.pet.photos.length > 0 && (
                        <div className="md:col-span-2">
                          <label className="block text-purple-200 mb-3 font-semibold text-lg">Pet Photos</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {profile.pet.photos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={photo}
                                  alt={`${profile.pet.name} ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-xl border-2 border-purple-500/30 hover:border-purple-400 transition-all"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Pet Name</label>
                        <p className="text-white text-xl font-bold">{profile.pet.name}</p>
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Type</label>
                        <p className="text-white text-xl font-bold">{profile.pet.type}</p>
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Breed</label>
                        <p className="text-white text-xl font-bold">{profile.pet.breed}</p>
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Age</label>
                        <p className="text-white text-xl font-bold">{formatAge(profile.pet.age)}</p>
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Gender</label>
                        <p className="text-white text-xl font-bold">{profile.pet.gender}</p>
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Location</label>
                        <p className="text-white text-xl font-bold flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-purple-400" />
                          {profile.pet.location}
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-purple-200 mb-2 font-semibold">Description</label>
                        <p className="text-white text-lg leading-relaxed">{profile.pet.description}</p>
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Vaccinated</label>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                          profile.pet.vaccinated 
                            ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                            : 'bg-red-500/20 border-red-500/30 text-red-400'
                        }`}>
                          {profile.pet.vaccinated ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                          <span className="font-bold">{profile.pet.vaccinated ? 'Yes' : 'No'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Trained</label>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                          profile.pet.trained 
                            ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                            : 'bg-red-500/20 border-red-500/30 text-red-400'
                        }`}>
                          {profile.pet.trained ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                          <span className="font-bold">{profile.pet.trained ? 'Yes' : 'No'}</span>
                        </div>
                      </div>

                      {/* Pet License */}
                      {profile.pet.license && (
                        <div className="md:col-span-2">
                          <label className="block text-purple-200 mb-3 font-semibold text-lg">Pet License Document</label>
                          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400 transition-all">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <FileText className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-yellow-300 font-bold text-xl mb-2 flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5" />
                                  License Verified
                                </p>
                                <p className="text-yellow-200/80 mb-4">
                                  This pet has a valid license document on file, verified by the admin team.
                                </p>
                                {profile.pet.license.startsWith('data:image') ? (
                                  <div className="mt-4">
                                    <img
                                      src={profile.pet.license}
                                      alt="Pet License"
                                      className="w-full max-h-96 object-contain rounded-lg border-2 border-yellow-500/30"
                                    />
                                  </div>
                                ) : profile.pet.license.startsWith('data:application/pdf') ? (
                                  <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                                    <FileText className="w-6 h-6 text-yellow-400" />
                                    <div>
                                      <p className="text-white font-semibold">PDF License Document</p>
                                      <p className="text-yellow-300/60 text-sm">License file is available (PDF format)</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                    <p className="text-green-300">License document verified and on file</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleUpdatePet} className="space-y-6">
                      {/* Image Upload */}
                      <div className="mb-6">
                        <label className="block text-purple-200 mb-3 font-semibold text-lg">Pet Photos (Max 5)</label>
                        <label className="cursor-pointer">
                          <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 rounded-xl hover:border-cyan-400 transition-all">
                            <ImageIcon className="w-6 h-6 text-cyan-400" />
                            <span className="text-cyan-200 font-semibold">
                              {uploadingImages ? 'Uploading...' : 'Add More Photos'}
                            </span>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImages || (petEditData.photos?.length || 0) >= 5}
                          />
                        </label>
                        <p className="text-sm text-purple-300 mt-2">
                          JPG, PNG, or WEBP • Max 5MB each • Up to 5 images
                        </p>
                        
                        {petEditData.photos && petEditData.photos.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                            {petEditData.photos.map((img, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={img}
                                  alt={`Pet ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-xl border-2 border-purple-500/30"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-purple-200 mb-2 font-semibold">Pet Name *</label>
                          <input
                            type="text"
                            value={petEditData.name || ''}
                            onChange={(e) => setPetEditData({ ...petEditData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-purple-200 mb-2 font-semibold">Type *</label>
                          <select
                            value={petEditData.type || 'Dog'}
                            onChange={(e) => setPetEditData({ ...petEditData, type: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                          >
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-purple-200 mb-2 font-semibold">Breed *</label>
                          <input
                            type="text"
                            value={petEditData.breed || ''}
                            onChange={(e) => setPetEditData({ ...petEditData, breed: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-purple-200 mb-2 font-semibold">Age (in years) *</label>
                          <input
                            type="number"
                            step="0.1"
                            value={petEditData.age || ''}
                            onChange={(e) => setPetEditData({ ...petEditData, age: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                            placeholder="e.g. 2 or 0.5 for 6 months"
                            required
                            min="0"
                          />
                          <p className="text-sm text-purple-300 mt-1">Use decimals for months (0.5 = 6 months)</p>
                        </div>

                        <div>
                          <label className="block text-purple-200 mb-2 font-semibold">Gender *</label>
                          <select
                            value={petEditData.gender || 'Male'}
                            onChange={(e) => setPetEditData({ ...petEditData, gender: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-purple-200 mb-2 font-semibold">Location *</label>
                          <input
                            type="text"
                            value={petEditData.location || ''}
                            onChange={(e) => setPetEditData({ ...petEditData, location: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                            placeholder="e.g. New York, NY"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-purple-200 mb-2 font-semibold">Description *</label>
                          <textarea
                            value={petEditData.description || ''}
                            onChange={(e) => setPetEditData({ ...petEditData, description: e.target.value })}
                            rows="4"
                            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white resize-none"
                            placeholder="Tell us about your pet..."
                            required
                          />
                        </div>

                        <div className="md:col-span-2 flex gap-6">
                          <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={petEditData.vaccinated || false}
                              onChange={(e) => setPetEditData({ ...petEditData, vaccinated: e.target.checked })}
                              className="w-5 h-5 rounded border-2 border-purple-500/30 bg-slate-700/50 checked:bg-purple-500"
                            />
                            <span className="font-semibold">Vaccinated</span>
                          </label>
                          
                          <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={petEditData.trained || false}
                              onChange={(e) => setPetEditData({ ...petEditData, trained: e.target.checked })}
                              className="w-5 h-5 rounded border-2 border-purple-500/30 bg-slate-700/50 checked:bg-purple-500"
                            />
                            <span className="font-semibold">Trained</span>
                          </label>
                        </div>

                        {/* Pet License Document - Read Only in Edit Mode */}
                        {petEditData.license && (
                          <div className="md:col-span-2">
                            <label className="block text-purple-200 mb-3 font-semibold text-lg">Pet License Document</label>
                            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                  <FileText className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-yellow-300 font-bold text-xl mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    License Document Uploaded
                                  </p>
                                  <p className="text-yellow-200/80 mb-4">
                                    License document is verified and on file. Contact admin if you need to update it.
                                  </p>
                                  {petEditData.license.startsWith('data:image') && (
                                    <div className="mt-4">
                                      <img
                                        src={petEditData.license}
                                        alt="Pet License"
                                        className="w-full max-h-64 object-contain rounded-lg border-2 border-yellow-500/30"
                                      />
                                    </div>
                                  )}
                                  {petEditData.license.startsWith('data:application/pdf') && (
                                    <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                                      <FileText className="w-6 h-6 text-yellow-400" />
                                      <div>
                                        <p className="text-white font-semibold">PDF License Document</p>
                                        <p className="text-yellow-300/60 text-sm">License file is available (PDF format)</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-purple-300 mt-2 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              License documents cannot be updated here. Contact admin support for changes.
                            </p>
                          </div>
                        )}
                      </div>
                    </form>
                  )}
                </div>

                {/* Owner Contact Information Section */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-3">
                      <User className="w-8 h-8 text-cyan-400" />
                      Contact Information
                    </h2>
                    {!editingOwner ? (
                      <button
                        onClick={() => setEditingOwner(true)}
                        className="px-6 py-3 bg-cyan-500/20 border-2 border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-all flex items-center gap-2 font-semibold"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Contact
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingOwner(false);
                            setOwnerEditData({ phone: profile.owner.phone });
                          }}
                          className="px-6 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-all flex items-center gap-2 font-semibold"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateOwner}
                          disabled={loading}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2 font-semibold disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>

                  {!editingOwner ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Email</label>
                        <p className="text-white text-xl font-bold flex items-center gap-2">
                          <Mail className="w-5 h-5 text-cyan-400" />
                          {profile.owner.email}
                        </p>
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Phone</label>
                        <p className="text-white text-xl font-bold flex items-center gap-2">
                          <Phone className="w-5 h-5 text-cyan-400" />
                          {profile.owner.phone}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateOwner} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Email (Cannot be changed)</label>
                        <input
                          type="email"
                          value={profile.owner.email}
                          disabled
                          className="w-full px-4 py-3 bg-slate-700/30 border-2 border-purple-500/20 rounded-xl text-slate-400 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2 font-semibold">Phone *</label>
                        <input
                          type="tel"
                          value={ownerEditData.phone || ''}
                          onChange={(e) => setOwnerEditData({ ...ownerEditData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'adoptions' && (
              <div className="space-y-8">
                {loadingAdoptions ? (
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-16 text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-200 text-lg">Loading adoption requests...</p>
                  </div>
                ) : (
                  (() => {
                  const pendingRequests = adoptionRequests.filter(a => a.adoptionStatus === 'pending');
                  const approvedRequests = adoptionRequests.filter(a => a.adoptionStatus === 'approved');
                  const rejectedRequests = adoptionRequests.filter(a => a.adoptionStatus === 'rejected');

                  const AdoptionCard = ({ adoption }) => (
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-6 hover:border-purple-400 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                            <User className="w-6 h-6 text-purple-400" />
                            {adoption.adopterName}
                          </h3>
                          <div className="space-y-2">
                            <p className="text-purple-200 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-cyan-400" />
                              <span className="font-semibold">Email:</span> {adoption.adopterEmail}
                            </p>
                            <p className="text-purple-200 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-green-400" />
                              <span className="font-semibold">Phone:</span> {adoption.adopterPhone}
                            </p>
                            <p className="text-purple-200/60 flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span className="font-semibold">Requested:</span> {new Date(adoption.adoptionDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-xl border-2 text-sm font-bold capitalize whitespace-nowrap ${
                          adoption.adoptionStatus === 'pending' ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' :
                          adoption.adoptionStatus === 'approved' ? 'text-green-400 bg-green-500/20 border-green-500/30' :
                          'text-red-400 bg-red-500/20 border-red-500/30'
                        }`}>
                          {adoption.adoptionStatus}
                        </span>
                      </div>

                      {adoption.adopterMessage && (
                        <div className="mb-4 p-4 bg-slate-700/50 rounded-xl border border-purple-500/20">
                          <p className="text-purple-200 text-sm font-semibold mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Message from Adopter:
                          </p>
                          <p className="text-white leading-relaxed">{adoption.adopterMessage}</p>
                        </div>
                      )}

                      {adoption.adoptionStatus === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAdoptionStatus(adoption._id, 'approved')}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-green-500/20 border-2 border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/30 transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-50"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAdoptionStatus(adoption._id, 'rejected')}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-red-500/20 border-2 border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-50"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );

                  return (
                    <>
                      {/* Pending Requests */}
                      {pendingRequests.length > 0 && (
                        <div>
                          <h2 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                            <Clock className="w-8 h-8" />
                            Pending Requests ({pendingRequests.length})
                          </h2>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {pendingRequests.map(adoption => (
                              <AdoptionCard key={adoption._id} adoption={adoption} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Approved Requests */}
                      {approvedRequests.length > 0 && (
                        <div>
                          <h2 className="text-3xl font-bold text-green-400 mb-6 flex items-center gap-3">
                            <CheckCircle className="w-8 h-8" />
                            Approved ({approvedRequests.length})
                          </h2>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {approvedRequests.map(adoption => (
                              <AdoptionCard key={adoption._id} adoption={adoption} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rejected Requests */}
                      {rejectedRequests.length > 0 && (
                        <div>
                          <h2 className="text-3xl font-bold text-red-400 mb-6 flex items-center gap-3">
                            <XCircle className="w-8 h-8" />
                            Rejected ({rejectedRequests.length})
                          </h2>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {rejectedRequests.map(adoption => (
                              <AdoptionCard key={adoption._id} adoption={adoption} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No Requests */}
                      {adoptionRequests.length === 0 && (
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-16 text-center">
                          <Heart className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                          <h3 className="text-3xl font-bold text-white mb-3">No Adoption Requests Yet</h3>
                          <p className="text-purple-200 text-lg max-w-md mx-auto">
                            When someone requests to adopt your pet, you'll see their details here.
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 flex items-center gap-3">
                  <Lock className="w-8 h-8 text-purple-400" />
                  Change Password
                </h2>

                <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-purple-200 mb-2 font-semibold text-lg">Current Password *</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2 font-semibold text-lg">New Password *</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                      placeholder="Enter new password"
                      required
                      minLength={8}
                    />
                    <p className="text-purple-300 text-sm mt-2">Minimum 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2 font-semibold text-lg">Confirm New Password *</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                      placeholder="Confirm new password"
                      required
                      minLength={8}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Update Password
                      </>
                    )}
                  </button>
                </form>

                {/* Danger Zone - Delete Registration */}
                <div className="mt-12 pt-8 border-t-2 border-red-500/30">
                  <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-2xl font-bold text-red-400 mb-2">Danger Zone</h3>
                        <p className="text-red-200 mb-4">
                          Once you delete your registration, there is no going back. This action will:
                        </p>
                        <ul className="text-red-200 space-y-2 mb-4">
                          <li className="flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Remove your pet from all adoption listings
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Delete all pet photos and information permanently
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Remove your account and all associated data
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Cancel all adoption requests (if no pending requests exist)
                          </li>
                        </ul>
                        {pendingCount > 0 && (
                          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
                            <p className="text-yellow-200 font-semibold flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              You have {pendingCount} pending adoption request(s). Please resolve them before deleting.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleDeleteRegistration}
                      disabled={loading || pendingCount > 0}
                      className="w-full px-8 py-4 bg-red-500/20 border-2 border-red-500 text-red-400 rounded-xl font-bold text-lg hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin" />
                          Deleting Registration...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          Delete Pet Registration Permanently
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-fade-in { 
            animation: fade-in 0.6s ease-out forwards; 
          }
          .animate-gradient { 
            background-size: 200% 200%; 
            animation: gradient 3s ease infinite; 
          }
        `}</style>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default PetOwnerProfile;