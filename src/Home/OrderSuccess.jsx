import React, { useState } from "react";
import { FaShoppingCart, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart = [] } = location.state || {};
  
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handleBuyNow = () => {
    // Show success message
    setShowSuccess(true);

    // Redirect to products page after 3 seconds
    setTimeout(() => {
      navigate('/products');
    }, 3000);
  };

  // If cart is empty, redirect back
  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="text-center">
            <FaShoppingCart className="text-6xl text-purple-400 mx-auto mb-4" />
            <h2 className="text-white text-2xl mb-4">Your cart is empty</h2>
            <button 
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Continue Shopping
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-purple-300 hover:text-white mb-8 transition-colors duration-300"
          >
            <FaArrowLeft /> Back to Products
          </button>

          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 text-center">
            Order Summary
          </h1>

          {/* Order Summary Card */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Your Items</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto scrollbar-hide">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-colors">
                  <img 
                    src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'} 
                    alt={item.productName} 
                    className="w-20 h-20 object-cover rounded-lg shadow-lg" 
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{item.productName}</h3>
                    {item.brand && <p className="text-purple-400 text-sm">{item.brand}</p>}
                    <p className="text-purple-300 text-sm mt-1">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 border-t border-purple-500/20 pt-6 mb-6">
              <div className="flex justify-between text-purple-300 text-lg">
                <span>Subtotal:</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-purple-300 text-lg">
                <span>Shipping:</span>
                <span className="font-bold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-purple-300 text-lg">
                <span>Tax (10%):</span>
                <span className="font-bold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white text-2xl font-black border-t border-purple-500/20 pt-4">
                <span>Total:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-3xl">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Free Shipping Notice */}
            {subtotal > 50 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <p className="text-green-400 text-center font-bold">
                  🎉 You've qualified for FREE shipping!
                </p>
              </div>
            )}

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-md w-full shadow-2xl border-2 border-green-500/30 animate-scale-up overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
              
              <div className="p-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                  <FaCheckCircle className="text-white text-5xl" />
                </div>
                
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
                  Order Successful! 🎉
                </h2>
                
                <p className="text-purple-200 mb-2 text-lg">
                  Thank you for your purchase!
                </p>
                <p className="text-purple-300 mb-8">
                  Your order has been placed successfully.
                </p>

                <div className="bg-slate-700/30 rounded-xl p-6 mb-6 border border-green-500/20">
                  <p className="text-green-400 font-bold mb-3 text-lg">Order Details</p>
                  <div className="text-left text-purple-200 space-y-2">
                    <p className="flex justify-between">
                      <span>Total Items:</span>
                      <span className="font-bold text-white">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-bold text-white text-xl">${total.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                <p className="text-purple-400 text-sm animate-pulse">
                  Redirecting to products page...
                </p>
              </div>

              {/* Confetti Effect */}
              <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-10px',
                      backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Animations */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scale-up {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          .animate-fade-in { animation: fade-in 0.3s ease-out; }
          .animate-scale-up { animation: scale-up 0.4s ease-out; }
          .animate-confetti { animation: confetti linear forwards; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
      <Footer />
    </>
  );
}

export default OrderSuccess;