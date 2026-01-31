import React, { useEffect, useMemo, useState } from 'react';
import { Heart, Camera, Check, X, User, Mail, Phone, FileText, Sparkles, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from "../Home/components/Header";
import Footer from "../Home/components/Footer";
import { registerPetWithOwnerAPI } from '../services/allAPI';

function PetReg() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    owner: {
      email: '',
      password: '',
      phone: ''
    },
    pet: {
      name: '',
      type: 'Dog',
      breed: '',
      age: '',
      gender: 'Male',
      location: '',
      description: '',
      vaccinated: false,
      trained: false,
      photos: [],
      license: []
    }
  });

  const [photoFiles, setPhotoFiles] = useState([]);
  const [licenseFile, setLicenseFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const photoPreviews = useMemo(
    () => photoFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [photoFiles]
  );

  useEffect(() => {
    return () => {
      photoPreviews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [photoPreviews]);

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      owner: { ...prev.owner, [name]: value }
    }));
    if (errors[`owner.${name}`]) setErrors(prev => ({ ...prev, [`owner.${name}`]: '' }));
  };

  const handlePetChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      pet: { ...prev.pet, [name]: type === 'checkbox' ? checked : value }
    }));
    if (errors[`pet.${name}`]) setErrors(prev => ({ ...prev, [`pet.${name}`]: '' }));
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const imageFiles = files.filter(f => f.type?.startsWith('image/'));
    setPhotoFiles(prev => {
      const next = [...prev, ...imageFiles];
      return next.slice(0, 10);
    });

    if (errors['pet.photos']) setErrors(prev => ({ ...prev, 'pet.photos': '' }));
  };

  const removePhoto = (index) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files?.[0] || null;
    setLicenseFile(file);
    if (errors['pet.license']) setErrors(prev => ({ ...prev, 'pet.license': '' }));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Owner validation
    if (!formData.owner.email.trim()) {
      newErrors['owner.email'] = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.owner.email)) {
      newErrors['owner.email'] = 'Please enter a valid email';
    }

    if (!formData.owner.password) {
      newErrors['owner.password'] = 'Password is required';
    } else if (formData.owner.password.length < 8) {
      newErrors['owner.password'] = 'Password must be at least 8 characters';
    }

    if (!formData.owner.phone.trim()) {
      newErrors['owner.phone'] = 'Phone number is required';
    }

    // Pet validation
    if (!formData.pet.name.trim()) newErrors['pet.name'] = 'Pet name is required';
    if (!formData.pet.breed.trim()) newErrors['pet.breed'] = 'Breed is required';
    if (!formData.pet.age.trim()) newErrors['pet.age'] = 'Age is required';
    if (!formData.pet.location.trim()) newErrors['pet.location'] = 'Location is required';

    if (!photoFiles.length) {
      newErrors['pet.photos'] = 'Please upload at least 3 photos';
    } else if (photoFiles.length < 3) {
      newErrors['pet.photos'] = `Please upload at least 3 photos (selected: ${photoFiles.length})`;
    }

    if (!licenseFile) {
      newErrors['pet.license'] = 'Please upload the license file';
    }

    if (!formData.pet.description.trim()) {
      newErrors['pet.description'] = 'Description is required';
    } else if (formData.pet.description.trim().length < 10) {
      newErrors['pet.description'] = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION STARTED ===');
    
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      console.log('Converting files to base64...');
      
      // Convert photos to base64
      const photoPromises = photoFiles.map(file => fileToBase64(file));
      const photoBase64Array = await Promise.all(photoPromises);
      console.log(`Converted ${photoBase64Array.length} photos`);

      // Convert license to base64
      const licenseBase64 = await fileToBase64(licenseFile);
      console.log('License file converted');

      // Prepare registration data
      const registrationData = {
        owner: {
          email: formData.owner.email.trim(),
          password: formData.owner.password,
          phone: formData.owner.phone.trim()
        },
        pet: {
          name: formData.pet.name.trim(),
          type: formData.pet.type,
          breed: formData.pet.breed.trim(),
          age: formData.pet.age.trim(),
          gender: formData.pet.gender,
          location: formData.pet.location.trim(),
          description: formData.pet.description.trim(),
          vaccinated: formData.pet.vaccinated,
          trained: formData.pet.trained,
          photos: photoBase64Array,
          license: licenseBase64
        }
      };

      console.log('Registration data prepared:', {
        ownerEmail: registrationData.owner.email,
        petName: registrationData.pet.name,
        photosCount: registrationData.pet.photos.length,
        hasLicense: !!registrationData.pet.license
      });

      console.log('Sending API request...');
      const response = await registerPetWithOwnerAPI(registrationData);
      
      console.log('API Response:', {
        status: response?.status,
        data: response?.data
      });

      // Handle successful response
      if (response && response.status === 201) {
        console.log('✅ Registration successful!');
        setSubmitSuccess(true);
        
        // Store token if provided
        if (response.data?.token) {
          sessionStorage.setItem('petToken', response.data.token);
          console.log('Token stored');
        }
        
        // Store registration data if provided
        if (response.data?.data?.registration) {
          sessionStorage.setItem('petRegistration', JSON.stringify(response.data.data.registration));
          console.log('Registration data stored');
        }

        // Reset form
        setFormData({
          owner: { email: '', password: '', phone: '' },
          pet: {
            name: '', type: 'Dog', breed: '', age: '', gender: 'Male',
            location: '', description: '', vaccinated: false, trained: false,
            photos: [], license: []
          }
        });
        setPhotoFiles([]);
        setLicenseFile(null);

        // Navigate after delay
        setTimeout(() => {
          console.log('Navigating to home...');
          navigate('/');
        }, 2000);

      } else if (response && response.status === 400) {
        // Handle 400 Bad Request
        console.error('❌ 400 Bad Request:', response.data);
        const errorMessage = response.data?.message || response.data || 'Registration failed. Please check your inputs.';
        setErrors({ submit: errorMessage });
      } else if (response && response.status === 409) {
        // Handle conflict (email already exists)
        console.error('❌ 409 Conflict:', response.data);
        const errorMessage = response.data?.message || response.data || 'Email already registered';
        setErrors({ submit: errorMessage });
      } else {
        console.error('❌ Unexpected response:', response);
        setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      }

    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (error.response) {
        // Server responded with error
        console.error('Server error response:', {
          status: error.response.status,
          data: error.response.data
        });
        
        const errorMessage = error.response.data?.message || error.response.data || 'Registration failed';
        setErrors({ submit: errorMessage });
        
      } else if (error.request) {
        // Request made but no response
        console.error('Network error - no response received');
        setErrors({ submit: 'Network error. Please check your connection and try again.' });
        
      } else {
        // Something else went wrong
        console.error('Error during request setup:', error.message);
        setErrors({ submit: 'An error occurred while preparing the request.' });
      }
    } finally {
      setIsSubmitting(false);
      console.log('=== FORM SUBMISSION ENDED ===');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 animate-gradient">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
          {submitSuccess && (
            <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 shadow-2xl animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">Registration Successful!</h3>
                  <p className="text-white/90 text-sm">Your pet has been registered. Redirecting...</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-2xl">
              <Heart className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text mb-3">
              PetZone
            </h1>
            <p className="text-purple-200 text-lg">Find your companion</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                Register Pet & Create Account
              </h2>
              <p className="text-purple-100 mt-2">Join our community and find the perfect match</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {/* Owner Information */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Owner Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.owner.email}
                        onChange={handleOwnerChange}
                        placeholder="your.email@example.com"
                        className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 ${errors['owner.email'] ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder-purple-300/50`}
                      />
                    </div>
                    {errors['owner.email'] && <p className="text-red-400 text-sm mt-1">{errors['owner.email']}</p>}
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.owner.password}
                        onChange={handleOwnerChange}
                        placeholder="Min. 8 characters"
                        className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 ${errors['owner.password'] ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder-purple-300/50`}
                      />
                    </div>
                    {errors['owner.password'] && <p className="text-red-400 text-sm mt-1">{errors['owner.password']}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-purple-200 font-semibold mb-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.owner.phone}
                        onChange={handleOwnerChange}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 ${errors['owner.phone'] ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder-purple-300/50`}
                      />
                    </div>
                    {errors['owner.phone'] && <p className="text-red-400 text-sm mt-1">{errors['owner.phone']}</p>}
                  </div>
                </div>
              </div>

              {/* Pet Information */}
              <div>
                <h3 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  Pet Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Pet Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.pet.name}
                      onChange={handlePetChange}
                      placeholder="e.g., Max, Bella"
                      className={`w-full px-5 py-3 bg-slate-700/50 border-2 ${errors['pet.name'] ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder-purple-300/50`}
                    />
                    {errors['pet.name'] && <p className="text-red-400 text-sm mt-1">{errors['pet.name']}</p>}
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Type *</label>
                    <select
                      name="type"
                      value={formData.pet.type}
                      onChange={handlePetChange}
                      className="w-full px-5 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Breed *</label>
                    <input
                      type="text"
                      name="breed"
                      value={formData.pet.breed}
                      onChange={handlePetChange}
                      placeholder="e.g., Golden Retriever"
                      className={`w-full px-5 py-3 bg-slate-700/50 border-2 ${errors['pet.breed'] ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder-purple-300/50`}
                    />
                    {errors['pet.breed'] && <p className="text-red-400 text-sm mt-1">{errors['pet.breed']}</p>}
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Age *</label>
                    <input
                      type="text"
                      name="age"
                      value={formData.pet.age}
                      onChange={handlePetChange}
                      placeholder="e.g., 2 years, 6 months"
                      className={`w-full px-5 py-3 bg-slate-700/50 border-2 ${errors['pet.age'] ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder-purple-300/50`}
                    />
                    {errors['pet.age'] && <p className="text-red-400 text-sm mt-1">{errors['pet.age']}</p>}
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Gender *</label>
                    <select
                      name="gender"
                      value={formData.pet.gender}
                      onChange={handlePetChange}
                      className="w-full px-5 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.pet.location}
                      onChange={handlePetChange}
                      placeholder="City, State"
                      className={`w-full px-5 py-3 bg-slate-700/50 border-2 ${errors['pet.location'] ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder-purple-300/50`}
                    />
                    {errors['pet.location'] && <p className="text-red-400 text-sm mt-1">{errors['pet.location']}</p>}
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="mt-6">
                  <label className="block text-purple-200 font-semibold mb-2">Pet Photos * (minimum 3)</label>
                  
                  <label className={`block w-full cursor-pointer border-2 border-dashed rounded-2xl p-6 bg-slate-700/30 transition-all
                    ${errors['pet.photos'] ? 'border-red-500' : 'border-purple-500/30 hover:border-purple-400'}
                  `}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotosChange}
                      className="hidden"
                    />
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold">Click to upload photos</p>
                        <p className="text-purple-200/80 text-sm">PNG, JPG • {photoFiles.length} selected</p>
                      </div>
                    </div>
                  </label>

                  {errors['pet.photos'] && <p className="text-red-400 text-sm mt-2">{errors['pet.photos']}</p>}

                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {photoPreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={preview.url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-xl border-2 border-purple-500/30"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* License Upload */}
                <div className="mt-6">
                  <label className="block text-purple-200 font-semibold mb-2">License File *</label>

                  <label className={`block w-full cursor-pointer border-2 border-dashed rounded-2xl p-6 bg-slate-700/30 transition-all
                    ${errors['pet.license'] ? 'border-red-500' : 'border-purple-500/30 hover:border-purple-400'}
                  `}>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleLicenseChange}
                      className="hidden"
                    />

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold">Click to upload license</p>
                        <p className="text-purple-200/80 text-sm">
                          PDF or Image • {licenseFile ? `Selected: ${licenseFile.name}` : 'No file selected'}
                        </p>
                      </div>
                    </div>
                  </label>

                  {errors['pet.license'] && <p className="text-red-400 text-sm mt-2">{errors['pet.license']}</p>}
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-purple-200 font-semibold mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.pet.description}
                    onChange={handlePetChange}
                    placeholder="Tell us about your pet's personality, habits, and what makes them special..."
                    rows="4"
                    className={`w-full px-5 py-3 bg-slate-700/50 border-2 ${errors['pet.description'] ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder-purple-300/50 resize-none`}
                  />
                  {errors['pet.description'] && <p className="text-red-400 text-sm mt-1">{errors['pet.description']}</p>}
                </div>

                {/* Checkboxes */}
                <div className="mt-6 flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="vaccinated" checked={formData.pet.vaccinated} onChange={handlePetChange} className="sr-only" />
                      <div className={`w-6 h-6 border-2 rounded-lg transition-all ${formData.pet.vaccinated ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500' : 'border-purple-500/30 bg-slate-700/50'}`}>
                        {formData.pet.vaccinated && <Check className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                    <span className="text-purple-200 font-semibold group-hover:text-purple-100 transition-colors">Vaccinated</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="trained" checked={formData.pet.trained} onChange={handlePetChange} className="sr-only" />
                      <div className={`w-6 h-6 border-2 rounded-lg transition-all ${formData.pet.trained ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500' : 'border-purple-500/30 bg-slate-700/50'}`}>
                        {formData.pet.trained && <Check className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                    <span className="text-purple-200 font-semibold group-hover:text-purple-100 transition-colors">Trained</span>
                  </label>
                </div>
              </div>

              {errors.submit && (
                <div className="mt-6 bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-300 font-semibold mb-1">Registration Failed</p>
                      <p className="text-red-200 text-sm">{errors.submit}</p>
                      <p className="text-red-200/70 text-xs mt-2">Check the console for more details.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    isSubmitting
                      ? 'bg-slate-700 text-purple-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Register Pet & Create Account
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-purple-200/70 text-sm mt-4">
                Already have an account?{' '}
                <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>

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
            opacity: 0;
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}

export default PetReg;