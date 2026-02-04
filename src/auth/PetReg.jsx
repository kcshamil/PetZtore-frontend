import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Upload, AlertCircle, CheckCircle, X, Image as ImageIcon, FileText } from 'lucide-react';
import { registerPetWithOwnerAPI } from "../services/allAPI";
import Header from '../Home/components/Header';
import Footer from '../Home/components/Footer';

function PetReg() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    // Owner information
    owner: {
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    },
    // Pet information
    pet: {
      name: '',
      type: 'Dog',
      breed: '',
      age: '',
      ageUnit: 'years', // 'months' or 'years'
      gender: 'Male',
      location: '',
      description: '',
      vaccinated: false,
      trained: false,
      photos: [], // Array of base64 image strings
      license: '' // Base64 string of license document
    }
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]); // For displaying uploaded images
  const [licensePreview, setLicensePreview] = useState(null); // For displaying license
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);

  // Handle input changes
  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      owner: { ...prev.owner, [name]: value }
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePetChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      pet: { 
        ...prev.pet, 
        [name]: type === 'checkbox' ? checked : value 
      }
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image upload (multiple images)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert('Please upload only JPG, PNG, or WEBP images');
      return;
    }

    // Validate file sizes (max 5MB per image)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Each image must be less than 5MB');
      return;
    }

    // Limit to 5 images total
    if (formData.pet.photos.length + files.length > 5) {
      alert('You can upload maximum 5 images');
      return;
    }

    setUploadingImages(true);

    try {
      const base64Images = await Promise.all(
        files.map(file => convertToBase64(file))
      );

      setFormData(prev => ({
        ...prev,
        pet: {
          ...prev.pet,
          photos: [...prev.pet.photos, ...base64Images]
        }
      }));

      setImagePreview(prev => [...prev, ...base64Images]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle license document upload
  const handleLicenseUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type (images or PDFs)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload JPG, PNG, WEBP, or PDF file for license');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('License file must be less than 10MB');
      return;
    }

    setUploadingLicense(true);

    try {
      const base64 = await convertToBase64(file);
      
      setFormData(prev => ({
        ...prev,
        pet: {
          ...prev.pet,
          license: base64
        }
      }));

      setLicensePreview({
        base64,
        name: file.name,
        type: file.type
      });
    } catch (error) {
      console.error('Error uploading license:', error);
      alert('Error uploading license. Please try again.');
    } finally {
      setUploadingLicense(false);
    }
  };

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Remove image from preview
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      pet: {
        ...prev.pet,
        photos: prev.pet.photos.filter((_, i) => i !== index)
      }
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  // Remove license
  const removeLicense = () => {
    setFormData(prev => ({
      ...prev,
      pet: {
        ...prev.pet,
        license: ''
      }
    }));
    setLicensePreview(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Owner validation
    if (!formData.owner.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.owner.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.owner.password) newErrors.password = 'Password is required';
    else if (formData.owner.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.owner.password !== formData.owner.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.owner.phone) newErrors.phone = 'Phone number is required';

    // Pet validation
    if (!formData.pet.name) newErrors.name = 'Pet name is required';
    if (!formData.pet.breed) newErrors.breed = 'Breed is required';
    if (!formData.pet.age) newErrors.age = 'Age is required';
    if (!formData.pet.location) newErrors.location = 'Location is required';
    if (!formData.pet.description) newErrors.description = 'Description is required';
    if (!formData.pet.license) newErrors.license = 'License document is required';

    // Image validation (at least 1 image recommended but not required)
    // if (formData.pet.photos.length === 0) newErrors.photos = 'At least one pet photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API (exclude confirmPassword)
      const { confirmPassword, ...ownerData } = formData.owner;
      
      // Convert age to years (decimal format) based on unit
      let ageInYears = parseFloat(formData.pet.age);
      if (formData.pet.ageUnit === 'months') {
        ageInYears = (ageInYears / 12).toFixed(2); // Convert months to years
      }
      
      // Prepare pet data without ageUnit (backend doesn't need it)
      const { ageUnit, ...petData } = formData.pet;
      const registrationData = {
        owner: ownerData,
        pet: {
          ...petData,
          age: ageInYears // Store as decimal years
        }
      };

      console.log('Submitting registration with images and license');

      const response = await registerPetWithOwnerAPI(registrationData);

      if (response.data.success) {
        setSuccess(true);
        
        // Show success message for 3 seconds then navigate
        setTimeout(() => {
          navigate('/pets');
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.status === 409) {
        setErrors({ email: 'Email already registered. Please login instead.' });
      } else {
        alert(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Success message component
  if (success) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Registration Successful! 🎉</h2>
            <p className="text-purple-200 mb-6">
              Your pet registration has been submitted for admin approval. 
              Once approved, your pet will appear on the public pets page.
            </p>
            <p className="text-sm text-purple-300">
              Redirecting to pets page...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
        {/* Background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <span className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
                🐾 Register Your Pet for Adoption
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                Pet Registration
              </span>
            </h1>
            <p className="text-xl text-purple-200">
              Submit your pet for adoption approval
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20">
            {/* Owner Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                Owner Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.owner.email}
                    onChange={handleOwnerChange}
                    className={`w-full px-4 py-3 bg-slate-700/50 border-2 ${errors.email ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 text-white`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.owner.phone}
                    onChange={handleOwnerChange}
                    className={`w-full px-4 py-3 bg-slate-700/50 border-2 ${errors.phone ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 text-white`}
                    placeholder="+1234567890"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.owner.password}
                    onChange={handleOwnerChange}
                    className={`w-full px-4 py-3 bg-slate-700/50 border-2 ${errors.password ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 text-white`}
                    placeholder="Min 8 characters"
                  />
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.owner.confirmPassword}
                    onChange={handleOwnerChange}
                    className={`w-full px-4 py-3 bg-slate-700/50 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 text-white`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Pet Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6">
                Pet Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pet Name */}
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold">Pet Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.pet.name}
                    onChange={handlePetChange}
                    className={`w-full px-4 py-3 bg-slate-700/50 border-2 ${errors.name ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 text-white`}
                    placeholder="e.g. Max"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold">Type *</label>
                  <select
                    name="type"
                    value={formData.pet.type}
                    onChange={handlePetChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                  </select>
                </div>

                {/* Breed */}
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold">Breed *</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.pet.breed}
                    onChange={handlePetChange}
                    className={`w-full px-4 py-3 bg-slate-700/50 border-2 ${errors.breed ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 text-white`}
                    placeholder="e.g. Golden Retriever"
                  />
                  {errors.breed && <p className="text-red-400 text-sm mt-1">{errors.breed}</p>}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold">Age *</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      name="age"
                      value={formData.pet.age}
                      onChange={handlePetChange}
                      className={`flex-1 px-4 py-3 bg-slate-700/50 border-2 ${errors.age ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 text-white`}
                      placeholder="e.g. 2"
                      min="0"
                      step="0.1"
                    />
                    <select
                      name="ageUnit"
                      value={formData.pet.ageUnit}
                      onChange={handlePetChange}
                      className="px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                    >
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                  {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
                  <p className="text-purple-300/60 text-xs mt-1">
                    {formData.pet.ageUnit === 'months' ? 'For pets under 1 year old' : 'For pets 1 year and older'}
                  </p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold">Gender *</label>
                  <select
                    name="gender"
                    value={formData.pet.gender}
                    onChange={handlePetChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.pet.location}
                    onChange={handlePetChange}
                    className={`w-full px-4 py-3 bg-slate-700/50 border-2 ${errors.location ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 text-white`}
                    placeholder="e.g. New York, NY"
                  />
                  {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-purple-200 mb-2 font-semibold">Description *</label>
                  <textarea
                    name="description"
                    value={formData.pet.description}
                    onChange={handlePetChange}
                    rows="4"
                    className={`w-full px-4 py-3 bg-slate-700/50 border-2 ${errors.description ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 text-white resize-none`}
                    placeholder="Tell us about your pet..."
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Checkboxes */}
                <div className="md:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                    <input
                      type="checkbox"
                      name="vaccinated"
                      checked={formData.pet.vaccinated}
                      onChange={handlePetChange}
                      className="w-5 h-5 rounded border-2 border-purple-500/30 bg-slate-700/50 checked:bg-purple-500"
                    />
                    <span className="font-semibold">Vaccinated</span>
                  </label>
                  
                  <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                    <input
                      type="checkbox"
                      name="trained"
                      checked={formData.pet.trained}
                      onChange={handlePetChange}
                      className="w-5 h-5 rounded border-2 border-purple-500/30 bg-slate-700/50 checked:bg-purple-500"
                    />
                    <span className="font-semibold">Trained</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Pet Photos Upload Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
                Pet Photos (Optional - Max 5 images)
              </h2>

              {/* Upload Button */}
              <div className="mb-4">
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 rounded-xl hover:border-cyan-400 transition-all">
                    <ImageIcon className="w-6 h-6 text-cyan-400" />
                    <span className="text-cyan-200 font-semibold">
                      {uploadingImages ? 'Uploading...' : 'Upload Pet Photos'}
                    </span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImages || formData.pet.photos.length >= 5}
                  />
                </label>
                <p className="text-sm text-purple-300 mt-2">
                  JPG, PNG, or WEBP • Max 5MB each • Up to 5 images
                </p>
              </div>

              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imagePreview.map((img, index) => (
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

            {/* License Document Upload Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-6">
                Pet License Document *
              </h2>

              {/* Upload Button */}
              {!licensePreview ? (
                <div>
                  <label className="cursor-pointer">
                    <div className={`flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 ${errors.license ? 'border-red-500' : 'border-orange-500/30'} rounded-xl hover:border-orange-400 transition-all`}>
                      <FileText className="w-6 h-6 text-orange-400" />
                      <span className="text-orange-200 font-semibold">
                        {uploadingLicense ? 'Uploading...' : 'Upload License Document'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      onChange={handleLicenseUpload}
                      className="hidden"
                      disabled={uploadingLicense}
                    />
                  </label>
                  <p className="text-sm text-purple-300 mt-2">
                    JPG, PNG, WEBP, or PDF • Max 10MB
                  </p>
                  {errors.license && <p className="text-red-400 text-sm mt-1">{errors.license}</p>}
                </div>
              ) : (
                <div className="p-4 bg-slate-700/50 border-2 border-green-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        {licensePreview.type === 'application/pdf' ? (
                          <FileText className="w-6 h-6 text-green-400" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{licensePreview.name}</p>
                        <p className="text-sm text-green-400">License uploaded successfully</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeLicense}
                      className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-all"
                    >
                      <X className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                  {licensePreview.type !== 'application/pdf' && (
                    <img
                      src={licensePreview.base64}
                      alt="License"
                      className="mt-4 w-full max-h-64 object-contain rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Info Alert */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-200 text-sm">
                  <strong>Note:</strong> Your pet registration will be submitted for admin approval. 
                  Once approved, your pet will appear on the public adoption page.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Submit for Approval
                </>
              )}
            </button>
          </form>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        `}</style>
      </div>
      <Footer />
    </>
  );
}

export default PetReg;