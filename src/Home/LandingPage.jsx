import React, { useState, useEffect } from "react";
import { FaPaw, FaShoppingCart, FaHeart, FaStar, FaArrowRight, FaCheck, FaMapMarkerAlt, FaCalendar, FaSpinner } from "react-icons/fa";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { getApprovedPetsAPI, getAllProductsAPI } from "../services/allAPI";

const features = [
  { icon: <FaPaw size={32} />, title: "Pet Adoption", desc: "Find loving homes for pets or adopt a furry friend", gradient: "from-orange-400 via-red-400 to-pink-500" },
  { icon: <FaHeart size={32} />, title: "Pet Registration", desc: "Register your pet for adoption listings or special events", gradient: "from-purple-400 via-pink-400 to-rose-500" },
  { icon: <FaShoppingCart size={32} />, title: "Premium Products", desc: "Shop food, toys, and accessories to pamper your pets", gradient: "from-cyan-400 via-blue-400 to-indigo-500" },
  { icon: <FaStar size={32} />, title: "Pet Care Tips", desc: "Expert advice on pet care, nutrition, and training", gradient: "from-green-400 via-emerald-400 to-teal-500" }
];

function LandingPage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Gradient options for pets
  const gradients = [
    "from-amber-500 via-orange-500 to-red-500",
    "from-blue-500 via-indigo-500 to-purple-500",
    "from-purple-500 via-pink-500 to-rose-500",
    "from-yellow-500 via-amber-500 to-orange-500",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-green-500 via-emerald-500 to-teal-500",
    "from-gray-500 via-slate-500 to-zinc-500",
    "from-pink-500 via-rose-500 to-red-500"
  ];

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

  // Helper function to format age
  const formatAge = (age) => {
    if (!age) return 'Not specified';
    const ageNum = parseFloat(age);
    if (ageNum < 1) {
      const months = Math.round(ageNum * 12);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
    return `${ageNum} ${ageNum === 1 ? 'year' : 'years'}`;
  };

  // Fetch approved pets on component mount
  useEffect(() => {
    fetchApprovedPets();
    fetchProducts();
  }, []);

  const fetchApprovedPets = async () => {
    try {
      setLoadingPets(true);
      const response = await getApprovedPetsAPI();
      
      if (response.data.success) {
        const approvedRegistrations = response.data.data.registrations;
        
        // Transform to pet format and limit to 4 for homepage
        const transformedPets = approvedRegistrations.slice(0, 4).map((reg, index) => ({
          id: reg._id,
          name: reg.pet.name,
          type: reg.pet.type,
          breed: reg.pet.breed,
          age: reg.pet.age,
          gender: reg.pet.gender,
          location: reg.pet.location,
          image: reg.pet.photos?.[0] || "https://via.placeholder.com/400",
          description: reg.pet.description,
          vaccinated: reg.pet.vaccinated,
          trained: reg.pet.trained,
          gradient: gradients[index % gradients.length]
        }));
        
        setPets(transformedPets);
      }
    } catch (error) {
      console.error("Error fetching approved pets:", error);
      setPets([]);
    } finally {
      setLoadingPets(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await getAllProductsAPI();
      
      if (response.data.success) {
        // Limit to 4 products for homepage
        const featuredProducts = response.data.products.slice(0, 4).map(product => ({
          ...product,
          colorGradient: getCategoryColor(product.category)
        }));
        setProducts(featuredProducts);
        console.log(`✅ Loaded ${featuredProducts.length} featured products`);
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAdoptClick = (petId) => {
    navigate('/pets');
  };

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
                    src="https://t4.ftcdn.net/jpg/11/93/15/23/360_F_1193152364_T2e0OriBlL0ObWhdGMWUrPrgVtpVXchP.jpg"
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
  
        {/* Pets Available Section - Now with Real Data */}
        <div className="relative max-w-7xl mx-auto px-6 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-4">
              Pets Available for Adoption
            </h2>
            <p className="text-purple-300 text-lg">Meet your new best friend today</p>
          </div>

          {/* Loading State */}
          {loadingPets && (
            <div className="text-center py-20">
              <FaSpinner className="text-6xl text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-purple-300 text-xl">Loading adorable pets...</p>
            </div>
          )}

          {/* No Pets State */}
          {!loadingPets && pets.length === 0 && (
            <div className="text-center py-20">
              <FaHeart className="text-6xl text-purple-500/30 mx-auto mb-4" />
              <p className="text-purple-300 text-xl mb-4">No pets available for adoption at the moment</p>
              <p className="text-purple-400 text-sm">Check back soon for new adorable friends!</p>
            </div>
          )}

          {/* Pets Grid - Real Data */}
          {!loadingPets && pets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pets.map((pet, idx) => (
                <div 
                  key={pet.id} 
                  className="group relative bg-slate-800/50 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 transform transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in"
                  style={{animationDelay: `${idx * 0.1}s`}}
                  onClick={() => handleAdoptClick(pet.id)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={pet.image} 
                      alt={pet.name} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${pet.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                    
                    {/* Type Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 bg-gradient-to-r ${pet.gradient} backdrop-blur-sm rounded-full text-xs font-bold text-white`}>
                      {pet.type}
                    </div>

                    {/* Status Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {pet.vaccinated && (
                        <span className="px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <FaCheck size={8} /> Vaccinated
                        </span>
                      )}
                      {pet.trained && (
                        <span className="px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <FaStar size={8} /> Trained
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-white text-xs bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <FaMapMarkerAlt size={10} />
                        <span className="truncate">{pet.location}</span>
                      </div>
                    </div>
                  </div>
  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{pet.name}</h3>
                    <p className="text-purple-300 text-sm mb-2">{pet.breed}</p>
                    <div className="flex items-center gap-2 text-purple-400 text-xs mb-4">
                      <FaCalendar size={10} />
                      <span>{formatAge(pet.age)}</span>
                      <span className="mx-1">•</span>
                      <span className="capitalize">{pet.gender}</span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdoptClick(pet.id);
                      }}
                      className={`w-full bg-gradient-to-r ${pet.gradient} text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                    >
                      <FaHeart /> Adopt {pet.name}
                    </button>
                  </div>
  
                  <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${pet.gradient} opacity-20 rounded-full blur-3xl`} />
                </div>
              ))}
            </div>
          )}

          {/* View All Pets Button */}
          {!loadingPets && pets.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/pets">
                <button className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
                  View All Pets <FaArrowRight />
                </button>
              </Link>
            </div>
          )}
        </div>
  
        {/* Products Section */}
        <div className="relative max-w-7xl mx-auto px-6 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
              Featured Products
            </h2>
            <p className="text-purple-300 text-lg">Premium quality products for your beloved pets</p>
          </div>

          {loadingProducts ? (
            <div className="text-center py-20">
              <FaSpinner className="text-6xl text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-purple-300 text-xl">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <FaShoppingCart className="text-6xl text-purple-500/30 mx-auto mb-4" />
              <p className="text-purple-300 text-xl">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, idx) => (
                <div 
                  key={product._id} 
                  className="group relative bg-slate-800/50 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 transform transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in"
                  style={{animationDelay: `${idx * 0.1}s`}}
                  onClick={() => navigate('/products')}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'} 
                      alt={product.productName} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${product.colorGradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                    
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-lg rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <FaStar className="text-yellow-500" size={10} />
                      {product.rating || '4.5'}
                    </div>
                    
                    {/* Stock Badge */}
                    {!product.inStock && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/90 backdrop-blur-lg rounded-full text-xs font-bold text-white">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{product.productName}</h3>
                    {product.brand && <p className="text-purple-400 text-xs mb-2">{product.brand}</p>}
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                      ${product.price.toFixed(2)}
                    </p>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/products');
                      }}
                      className={`w-full bg-gradient-to-r ${product.colorGradient} text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FaShoppingCart /> {product.inStock ? 'Shop Now' : 'Out of Stock'}
                    </button>
                  </div>

                  <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${product.colorGradient} opacity-20 rounded-full blur-3xl`} />
                </div>
              ))}
            </div>
          )}

          {/* View All Products Button */}
          {!loadingProducts && products.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/products">
                <button className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-bold hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
                  View All Products <FaArrowRight />
                </button>
              </Link>
            </div>
          )}
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
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
          .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
          .animate-spin { animation: spin 1s linear infinite; }
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
      <Footer/>
   </>
  );
}

export default LandingPage;