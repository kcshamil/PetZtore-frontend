import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaStar, FaHeart, FaPlus, FaMinus, FaCheck, FaTimes, FaFilter, FaSpinner, FaLock } from "react-icons/fa";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getAllProductsAPI } from "../services/allAPI";
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Categories matching the backend model
  const categories = [
    'All',
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

  // ✅ Check if user is logged in
  const isUserLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    return !!token;
  };

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllProductsAPI();
      
      if (response.data.success) {
        setProducts(response.data.products);
        // Initialize quantities object for all products
        const initialQuantities = {};
        response.data.products.forEach(product => {
          initialQuantities[product._id] = 0;
        });
        setQuantities(initialQuantities);
        console.log(`✅ Loaded ${response.data.products.length} products`);
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const increment = (productId, maxStock) => {
    setQuantities(prev => {
      const currentQty = prev[productId] || 0;
      if (currentQty < maxStock) {
        return { ...prev, [productId]: currentQty + 1 };
      } else {
        showToast(`Only ${maxStock} items available in stock!`);
        return prev;
      }
    });
  };

  const decrement = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }));
  };

  // ✅ Modified addToCart function with login check
  const addToCart = (product) => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      setSelectedProduct(product);
      setShowLoginPrompt(true);
      return;
    }

    const quantity = quantities[product._id] || 0;
    
    if (quantity > 0) {
      // Check if product is in stock
      if (!product.inStock || product.stock === 0) {
        showToast("This product is out of stock!");
        return;
      }

      // Check if requested quantity is available
      if (quantity > product.stock) {
        showToast(`Only ${product.stock} items available!`);
        return;
      }

      const existingItem = cart.find(item => item._id === product._id);
      if (existingItem) {
        // Check if adding more won't exceed stock
        const totalQuantity = existingItem.quantity + quantity;
        if (totalQuantity > product.stock) {
          showToast(`Cannot add more. Only ${product.stock} items in stock!`);
          return;
        }

        setCart(cart.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        setCart([...cart, { ...product, quantity }]);
      }
      
      // Reset quantity for this product
      setQuantities(prev => ({ ...prev, [product._id]: 0 }));
      
      showToast(`Added ${quantity} x ${product.productName} to cart!`);
    } else {
      showToast("Please select quantity!");
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
    showToast("Removed from cart");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Get color gradient based on category
  const getCategoryColor = (category) => {
    const colors = {
      'Food & Treats': 'from-orange-500 to-red-500',
      'Toys': 'from-purple-500 to-pink-500',
      'Grooming': 'from-cyan-500 to-blue-500',
      'Health & Wellness': 'from-green-500 to-emerald-500',
      'Beds & Furniture': 'from-amber-500 to-orange-500',
      'Collars & Leashes': 'from-indigo-500 to-purple-500',
      'Bowls & Feeders': 'from-teal-500 to-cyan-500',
      'Carriers & Crates': 'from-slate-500 to-gray-500',
      'Clothing & Accessories': 'from-pink-500 to-rose-500',
      'Training & Behavior': 'from-violet-500 to-purple-500'
    };
    return colors[category] || 'from-purple-500 to-pink-500';
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="text-6xl text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-xl">Loading products...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <FaTimes className="text-6xl text-red-400 mx-auto mb-4" />
            <p className="text-white text-xl mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-6 animate-gradient">
              Pet Store 🐾
            </h1>
            <p className="text-purple-200 text-xl max-w-2xl mx-auto">
              Everything your furry friends need! Browse our premium collection of pet products.
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg p-6 rounded-3xl border border-purple-500/20 shadow-2xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FaFilter className="text-purple-400 text-xl" />
              <h3 className="text-white font-bold text-lg">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                      : 'bg-slate-700/50 text-purple-300 hover:bg-slate-700 border-2 border-purple-500/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Button (Fixed Position) */}
          <button 
            onClick={() => setShowCart(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center transform hover:scale-110 transition-all duration-300 z-40"
          >
            <FaShoppingCart className="text-2xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-4 border-slate-900">
                {cart.length}
              </span>
            )}
          </button>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <FaShoppingCart className="text-6xl text-purple-500/30 mx-auto mb-4" />
              <p className="text-purple-300 text-xl">No products found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredProducts.map((product, index) => {
                const colorGradient = getCategoryColor(product.category);
                const productQty = quantities[product._id] || 0;
                
                return (
                  <div
                    key={product._id}
                    className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg rounded-2xl overflow-hidden border-2 border-purple-500/20 hover:border-purple-500/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-700">
                      <img
                        src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${colorGradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                      
                      {/* Stock Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                        product.inStock ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
                      } backdrop-blur-sm`}>
                        {product.inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </div>

                      {/* Rating */}
                      {product.rating > 0 && (
                        <div className="absolute top-4 left-4 px-2 py-1 bg-yellow-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white flex items-center gap-1">
                          <FaStar className="text-yellow-500" size={10} />
                          {product.rating || 0}
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className={`absolute bottom-4 left-4 px-3 py-1 bg-gradient-to-r ${colorGradient} backdrop-blur-lg rounded-full text-xs font-semibold text-white`}>
                        {product.category}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{product.productName}</h3>
                      {product.brand && (
                        <p className="text-purple-400 text-sm mb-2 font-semibold">{product.brand}</p>
                      )}
                      <p className="text-purple-300 text-sm mb-3 line-clamp-2">{product.description || 'No description available'}</p>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className={`text-sm font-semibold ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                          Stock: {product.stock}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <button
                          onClick={() => decrement(product._id)}
                          className="w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={!product.inStock}
                        >
                          <FaMinus />
                        </button>
                        <span className="text-2xl font-bold text-white min-w-[40px] text-center">{productQty}</span>
                        <button
                          onClick={() => increment(product._id, product.stock)}
                          className={`w-10 h-10 bg-gradient-to-r ${colorGradient} rounded-xl flex items-center justify-center text-white font-bold transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed`}
                          disabled={!product.inStock}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <button 
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`w-full bg-gradient-to-r ${colorGradient} text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                      >
                        <FaShoppingCart /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>

                    {/* Decorative Element */}
                    <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${colorGradient} opacity-20 rounded-full blur-3xl`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ✅ Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-md w-full shadow-2xl border-2 border-purple-500/30 animate-scale-up overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
              
              <button 
                onClick={() => {
                  setShowLoginPrompt(false);
                  setSelectedProduct(null);
                }}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-purple-300 hover:text-white transition-all duration-300 z-10"
              >
                <FaTimes size={20} />
              </button>

              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <FaLock className="text-white text-3xl" />
                </div>
                
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                  Login Required
                </h2>
                
                <p className="text-purple-200 mb-8 text-lg leading-relaxed">
                  Please log in to your account to add <span className="font-bold text-white">{selectedProduct?.productName}</span> to your cart. 
                  Don't have an account? Register now to start shopping! 🛍️
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                  >
                    Login Now
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-purple-300 hover:text-white rounded-xl font-bold transition-all duration-300 border-2 border-purple-500/20 hover:border-purple-500/50"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-purple-500/30 animate-scale-up overflow-y-auto">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
              
              <button 
                onClick={() => setShowCart(false)} 
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-purple-300 hover:text-white transition-all duration-300 z-10"
              >
                <FaTimes size={20} />
              </button>

              <div className="p-8">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                  Shopping Cart
                </h2>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <FaShoppingCart className="text-6xl text-purple-500/30 mx-auto mb-4" />
                    <p className="text-purple-300 text-lg">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item._id} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                          <img 
                            src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'} 
                            alt={item.productName} 
                            className="w-20 h-20 object-cover rounded-lg" 
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-bold">{item.productName}</h3>
                            {item.brand && <p className="text-purple-400 text-xs">{item.brand}</p>}
                            <p className="text-purple-300 text-sm">${item.price.toFixed(2)} x {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                            <button 
                              onClick={() => removeFromCart(item._id)}
                              className="text-red-400 hover:text-red-300 text-sm mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-purple-500/20 pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-purple-300 text-lg">Total:</span>
                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                          ${getTotalPrice()}
                        </span>
                      </div>
                      <button onClick={() => { setShowCart(false); navigate("/ordersuccess", { state: { cart } }); }} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                        <FaCheck /> Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
  
        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed top-6 right-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-in z-50 border border-green-400/30">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
              <FaCheck className="text-white text-xl" />
            </div>
            <p className="font-bold">{toast.message}</p>
          </div>
        )}
  
        {/* Animations */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scale-up {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes slide-in {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
          .animate-scale-up { animation: scale-up 0.4s ease-out; }
          .animate-slide-in { animation: slide-in 0.5s ease-out; }
          .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
      <Footer/>
    </>
  );
}

export default Products;