import React from "react";
import { FaPaw, FaShoppingCart, FaHeart, FaStar, FaArrowRight, FaCheck } from "react-icons/fa";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Link } from "react-router-dom";


// Sample data
const pets = [
  { name: "Buddy", type: "Dog", breed: "Golden Retriever", img: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80", color: "from-amber-500 via-orange-500 to-red-500" },
  { name: "Mittens", type: "Cat", breed: "Persian Cat", img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=400&q=80", color: "from-purple-500 via-pink-500 to-rose-500" },
  { name: "Tweety", type: "Bird", breed: "Parakeet", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSVdX5DG_jTc8Js9F4MEMcbXXq1UB7eTlvTg&s", color: "from-cyan-500 via-blue-500 to-indigo-500" },
  { name: "Coco", type: "Bird", breed: "African Grey", img: "https://thumbs.dreamstime.com/b/birds-animals-african-grey-parrot-jako-travel-tourism-thai-closeup-portrait-psittacus-erithacus-to-thailand-asia-65227055.jpg", color: "from-green-500 via-emerald-500 to-teal-500" }
];

const products = [
  { name: "Premium Dog Toy", price: "$15", rating: 4.8, img: "https://images.unsplash.com/photo-1612197526212-f4c1c8b083ff?auto=format&fit=crop&w=400&q=80", color: "from-orange-500 to-red-500" },
  { name: "Organic Cat Food", price: "$25", rating: 4.9, img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=400&q=80", color: "from-purple-500 to-pink-500" },
  { name: "Luxury Bird Cage", price: "$50", rating: 4.7, img: "https://images.unsplash.com/photo-1595433562696-9aa546a5c1fa?auto=format&fit=crop&w=400&q=80", color: "from-cyan-500 to-blue-500" },
  { name: "Cozy Cat Bed", price: "$35", rating: 4.6, img: "https://images.unsplash.com/photo-1601758003122-4e4a3c88f6f0?auto=format&fit=crop&w=400&q=80", color: "from-pink-500 to-rose-500" }
];

const features = [
  { icon: <FaPaw size={32} />, title: "Pet Adoption", desc: "Find loving homes for pets or adopt a furry friend", gradient: "from-orange-400 via-red-400 to-pink-500" },
  { icon: <FaHeart size={32} />, title: "Pet Registration", desc: "Register your pet for adoption listings or special events", gradient: "from-purple-400 via-pink-400 to-rose-500" },
  { icon: <FaShoppingCart size={32} />, title: "Premium Products", desc: "Shop food, toys, and accessories to pamper your pets", gradient: "from-cyan-400 via-blue-400 to-indigo-500" },
  { icon: <FaStar size={32} />, title: "Pet Care Tips", desc: "Expert advice on pet care, nutrition, and training", gradient: "from-green-400 via-emerald-400 to-teal-500" }
];

function LandingPage() {
  return (
   <>
   <Header/>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>
  
        {/* Hero Section */}
        <div className="relative pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 text-center md:text-left">
                <div className="inline-block mb-6">
                  <span className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
                    🐾 Your Trusted Pet Platform
                  </span>
                </div>
                <h1 className="text-6xl md:text-7xl font-black mb-6 animate-fade-in">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient">
                    Welcome to PetZone
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-xl">
                  Your trusted place for pet adoption, registration, and premium pet products. Give a pet a loving home today!
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link to={'/pets'}>
                    <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                      Adopt a Pet <FaArrowRight />
                    </button>
                  </Link>
                  <Link to={'/products'}>
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all duration-300">
                      Shop Products
                    </button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-500/30 transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEg32SP4tgb8OD-kfcbFdGl_w775BPzZ-DJg&s"
                    alt="Pets"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Features Section */}
        <div className="relative max-w-7xl mx-auto px-6 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-4">
              Why Choose PetZone?
            </h2>
            <p className="text-purple-300 text-lg">Everything you need for your pet's happiness in one place</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group cursor-pointer animate-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className={`relative bg-gradient-to-br ${feature.gradient} p-8 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-110 hover:-rotate-3 overflow-hidden h-full`}>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <div className="relative text-white">
                    <div className="mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/90">{feature.desc}</p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Pets Available Section */}
        <div className="relative max-w-7xl mx-auto px-6 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-4">
              Pets Available for Adoption
            </h2>
            <p className="text-purple-300 text-lg">Meet your new best friend today</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pets.map((pet, idx) => (
              <div 
                key={idx} 
                className="group relative bg-slate-800/50 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 transform transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={pet.img} 
                    alt={pet.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${pet.color} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                  
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <FaHeart className="text-white" />
                  </div>
                </div>
  
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{pet.name}</h3>
                  <p className="text-purple-300 text-sm mb-4">{pet.breed}</p>
                  
                  <button className={`w-full bg-gradient-to-r ${pet.color} text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}>
                    <FaHeart /> Adopt {pet.name}
                  </button>
                </div>
  
                <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${pet.color} opacity-20 rounded-full blur-3xl`} />
              </div>
            ))}
          </div>
        </div>
  
        {/* Products Section */}
        <div className="relative max-w-7xl mx-auto px-6 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
              Featured Products
            </h2>
            <p className="text-purple-300 text-lg">Premium quality products for your beloved pets</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <div 
                key={idx} 
                className="group relative bg-slate-800/50 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 transform transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${product.color} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                  
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-lg rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <FaStar className="text-yellow-500" size={10} />
                    {product.rating}
                  </div>
                </div>
  
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">{product.price}</p>
                  
                  <button className={`w-full bg-gradient-to-r ${product.color} text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}>
                    <FaShoppingCart /> Buy Now
                  </button>
                </div>
  
                <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${product.color} opacity-20 rounded-full blur-3xl`} />
              </div>
            ))}
          </div>
        </div>
  
        {/* Call to Action */}
        <div className="relative max-w-6xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-3xl p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10" />
            <div className="relative z-10">
              <h2 className="text-5xl font-black text-white mb-6">
                Join PetZone Today!
              </h2>
              <p className="text-purple-200 text-xl mb-10 max-w-2xl mx-auto">
                Adopt a loving pet or shop premium products for your furry friends. Make a difference in a pet's life today!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={'/pets'}>
                  <button className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    <FaCheck /> Adopt Now
                  </button>
                </Link>
                <Link to={'/products'}>
                  <button className="px-10 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                    <FaShoppingCart /> Shop Products
                  </button>
                </Link>
              </div>
            </div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
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
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
          .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        `}</style>
      </div>
      <Footer/>
   </>
  );
}

export default LandingPage;