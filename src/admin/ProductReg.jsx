import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Upload, DollarSign, Tag, FileText, Image as ImageIcon, Save, AlertCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerProductAPI } from '../services/allAPI';

function ProductReg() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    brand: '',
    image: null
  });

  const categories = [
    'Food & Treats',
    'Toys',
    'Grooming',
    'Health & Wellness',
    'Beds & Furniture',
    'Collars & Leashes',
    'Bowls & Feeders',
    'Carriers & Crates',
    'Clothing & Accessories',
    'Training & Behavior'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.productName || !formData.category || !formData.price || formData.stock === '') {
      toast.error('Please fill in all required fields');
      return;
    }

    const priceNum = parseFloat(formData.price);
    const stockNum = parseInt(formData.stock);

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Price must be a valid number greater than 0');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('Stock must be a valid number (0 or greater)');
      return;
    }

    setLoading(true);

    try {
      // Get token from session storage
      const token = sessionStorage.getItem('token');
      
      // Prepare product data with proper types
      const productData = {
        productName: formData.productName.trim(),
        category: formData.category,
        description: formData.description.trim() || '',
        price: priceNum,
        stock: stockNum,
        brand: formData.brand.trim() || '',
        image: formData.image || null
      };

      console.log('Sending product data:', { ...productData, image: productData.image ? 'base64_data' : null });
      
      // Make API call to save the product
      const response = await registerProductAPI(productData, token);
      
      console.log('Registration response:', response);
      
      if (response.data.success) {
        toast.success('Product registered successfully!');
        
        // Reset form
        setFormData({
          productName: '',
          category: '',
          description: '',
          price: '',
          stock: '',
          brand: '',
          image: null
        });
        setImagePreview(null);

        // Navigate back after a short delay
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Failed to register product');
      }
      
    } catch (error) {
      console.error('Error registering product:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Failed to register product. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error('Server error details:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Please check if the server is running.';
      } else {
        // Error in request setup
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-8 border-2 border-purple-500/50 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Package className="w-10 h-10 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Pet Product Registration</h1>
                  <p className="text-purple-200 mt-1">Add new products to your pet store inventory</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-purple-500/30 shadow-2xl">
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-400" />
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium Dog Food, Cat Toy Set"
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-all"
                  required
                />
              </div>

              {/* Category and Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-400" />
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-purple-400" />
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Purina, Kong, Pedigree"
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Price ($) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5 text-cyan-400" />
                    Stock Quantity <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="1"
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about the product, features, benefits, etc."
                  rows="5"
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-all resize-none"
                />
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-yellow-400" />
                  Product Image
                </label>
                
                <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-6 bg-slate-700/30 hover:bg-slate-700/50 transition-all">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="w-full h-64 object-contain rounded-lg bg-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                        className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-3">
                      <Upload className="w-12 h-12 text-purple-400" />
                      <div className="text-center">
                        <p className="text-white font-semibold">Click to upload product image</p>
                        <p className="text-purple-300 text-sm mt-1">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-300 font-semibold mb-1">Product Registration Guidelines</p>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Ensure all required fields are filled accurately</li>
                    <li>• Use clear product names and descriptions</li>
                    <li>• Upload high-quality product images</li>
                    <li>• Set competitive and accurate pricing</li>
                  </ul>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t-2 border-purple-500/30">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all font-semibold text-lg"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      Register Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default ProductReg;