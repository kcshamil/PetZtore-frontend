import React, { useState } from "react";
import { FaShoppingCart, FaStar, FaHeart, FaPlus, FaMinus, FaCheck, FaTimes, FaFilter } from "react-icons/fa";
import Header from "./components/Header";
import Footer from "./components/Footer";


// Sample products data
const products = [
  { 
    name: "Premium Dog Collar", 
    price: 15, 
    rating: 4.8,
    category: "Dogs",
    img: "https://m.media-amazon.com/images/I/71PBWeyLX+L.jpg",
    color: "from-orange-500 to-red-500",
    description: "Durable leather collar"
  },
  { 
    name: "Organic Cat Food", 
    price: 25, 
    rating: 4.9,
    category: "Cats",
    img: "https://ik.imagekit.io/supertails/cdn/shop/files/MaxiPersianCatFood_7kg_Buy1Get1Free_eb5b362e-fa83-4f79-ac4e-2da5933c56cc_600x.png?v=1758379297",
    color: "from-purple-500 to-pink-500",
    description: "Natural ingredients"
  },
  { 
    name: "Luxury Bird Cage", 
    price: 50, 
    rating: 4.7,
    category: "Birds",
    img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSK53JJYN8fWRSeKzUNwsRwKGZLltbavBxwUsUxmt0hD3NrLY6iAvBGxTjjECMwFCHayRHTxudaMgzi9rzxsBHimabUdoVnr-R0vxWDUACEpaBYa12ORqHLVL9Cd6jLO3e9TBnpYvCcVA&usqp=CAc",
    color: "from-cyan-500 to-blue-500",
    description: "Spacious and secure"
  },
  { 
    name: "Interactive Dog Toy", 
    price: 20, 
    rating: 4.6,
    category: "Dogs",
    img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=400&q=80",
    color: "from-yellow-500 to-orange-500",
    description: "Keeps pets entertained"
  },
  { 
    name: "Cozy Cat Bed", 
    price: 35, 
    rating: 4.8,
    category: "Cats",
    img: "https://images.unsplash.com/photo-1601758003122-4e4a3c88f6f0?auto=format&fit=crop&w=400&q=80",
    color: "from-pink-500 to-rose-500",
    description: "Ultra soft cushioning"
  },
  { 
    name: "Adjustable Leash", 
    price: 10, 
    rating: 4.5,
    category: "Dogs",
    img: "https://images.unsplash.com/photo-1600185365036-46b0c742fb36?auto=format&fit=crop&w=400&q=80",
    color: "from-green-500 to-emerald-500",
    description: "Perfect for walks"
  },
  { 
    name: "Cat Scratching Post", 
    price: 30, 
    rating: 4.7,
    category: "Cats",
    img: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=400&q=80",
    color: "from-indigo-500 to-purple-500",
    description: "Saves your furniture"
  },
  { 
    name: "Dog Training Treats", 
    price: 12, 
    rating: 4.9,
    category: "Dogs",
    img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400&q=80",
    color: "from-amber-500 to-orange-500",
    description: "Healthy rewards"
  },
];

function Products() {
  const [quantities, setQuantities] = useState(products.map(() => 0));
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const categories = ['All', 'Dogs', 'Cats', 'Birds'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const increment = (index) => {
    const newQuantities = [...quantities];
    newQuantities[index] += 1;
    setQuantities(newQuantities);
  };

  const decrement = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 0) newQuantities[index] -= 1;
    setQuantities(newQuantities);
  };

  const addToCart = (index) => {
    const product = filteredProducts[index];
    const quantity = quantities[index];
    
    if (quantity > 0) {
      const existingItem = cart.find(item => item.name === product.name);
      if (existingItem) {
        setCart(cart.map(item => 
          item.name === product.name 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        setCart([...cart, { ...product, quantity }]);
      }
      
      const newQuantities = [...quantities];
      newQuantities[index] = 0;
      setQuantities(newQuantities);
      
      showToast(`Added ${quantity} x ${product.name} to cart!`);
    } else {
      showToast("Please select quantity!");
    }
  };

  const removeFromCart = (productName) => {
    setCart(cart.filter(item => item.name !== productName));
    showToast("Removed from cart");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  return (
    <>
    <Header/>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>
  
        {/* Hero Section */}
        <div className="relative pt-20 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
                🛍️ Premium Pet Products
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-6 animate-fade-in">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient">
                Pet Products
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Quality products for your beloved companions. Shop now and treat your pets!
            </p>
  
            {/* Cart Button */}
            <button 
              onClick={() => setShowCart(true)}
              className="relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              <FaShoppingCart /> View Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full text-white text-sm flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
  
        {/* Category Filter */}
        <div className="relative max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-purple-300 mr-4">
              <FaFilter /> Filter:
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 text-purple-300 hover:text-white hover:border-purple-500/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
  
        {/* Products Grid */}
        <div className="relative max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <div 
                key={idx}
                className="group relative bg-slate-800/50 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 transform transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${product.color} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                  
                  {/* Favorite Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <FaHeart className="text-white" />
                  </div>
  
                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-lg rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1">
                    <FaStar className="text-yellow-500" size={10} />
                    {product.rating}
                  </div>
  
                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-purple-500/90 backdrop-blur-lg rounded-full text-xs font-semibold text-white">
                    {product.category}
                  </div>
                </div>
  
                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-purple-300 text-sm mb-2">{product.description}</p>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                    ${product.price}
                  </p>
  
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <button
                      onClick={() => decrement(idx)}
                      className="w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold transition-all"
                    >
                      <FaMinus />
                    </button>
                    <span className="text-2xl font-bold text-white min-w-[40px] text-center">{quantities[idx]}</span>
                    <button
                      onClick={() => increment(idx)}
                      className={`w-10 h-10 bg-gradient-to-r ${product.color} rounded-xl flex items-center justify-center text-white font-bold transition-all hover:scale-110`}
                    >
                      <FaPlus />
                    </button>
                  </div>
  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => addToCart(idx)}
                    className={`w-full bg-gradient-to-r ${product.color} text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
  
                {/* Decorative Element */}
                <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${product.color} opacity-20 rounded-full blur-3xl`} />
              </div>
            ))}
          </div>
        </div>
  
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
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                          <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h3 className="text-white font-bold">{item.name}</h3>
                            <p className="text-purple-300 text-sm">${item.price} x {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold text-lg">${item.price * item.quantity}</p>
                            <button 
                              onClick={() => removeFromCart(item.name)}
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
                      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
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
        `}</style>
      </div>
      <Footer/>
    </>
   
  );
}

export default Products;