import React, { useState } from 'react';
import { Heart, MapPin, Calendar, Info, Plus, Search, Star, Check } from 'lucide-react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Link } from 'react-router-dom';


function Pets() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample pet data
  const pets = [
    {
      id: 1,
      name: "Luna",
      type: "Dog",
      breed: "Golden Retriever",
      age: "2 years",
      gender: "Female",
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop",
      description: "Friendly and energetic golden retriever looking for a loving home.",
      vaccinated: true,
      trained: true,
      gradient: "from-amber-500 via-orange-500 to-red-500"
    },
    {
      id: 2,
      name: "Max",
      type: "Dog",
      breed: "German Shepherd",
      age: "3 years",
      gender: "Male",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop",
      description: "Loyal and protective companion, great with families.",
      vaccinated: true,
      trained: true,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    {
      id: 3,
      name: "Whiskers",
      type: "Cat",
      breed: "Persian",
      age: "1 year",
      gender: "Male",
      location: "Chicago, IL",
      image: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop",
      description: "Calm and affectionate Persian cat, loves cuddles.",
      vaccinated: true,
      trained: false,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    },
    {
      id: 4,
      name: "Bella",
      type: "Dog",
      breed: "Labrador",
      age: "4 years",
      gender: "Female",
      location: "Houston, TX",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
      description: "Sweet lab who loves swimming and playing fetch.",
      vaccinated: true,
      trained: true,
      gradient: "from-yellow-500 via-amber-500 to-orange-500"
    },
    {
      id: 5,
      name: "Mittens",
      type: "Cat",
      breed: "Siamese",
      age: "2 years",
      gender: "Female",
      location: "Miami, FL",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=400&fit=crop",
      description: "Playful Siamese with beautiful blue eyes.",
      vaccinated: true,
      trained: false,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500"
    },
    {
      id: 6,
      name: "Charlie",
      type: "Dog",
      breed: "Beagle",
      age: "1 year",
      gender: "Male",
      location: "Seattle, WA",
      image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=400&fit=crop",
      description: "Curious beagle puppy, full of energy and love.",
      vaccinated: true,
      trained: false,
      gradient: "from-green-500 via-emerald-500 to-teal-500"
    },
    {
      id: 7,
      name: "Shadow",
      type: "Cat",
      breed: "Maine Coon",
      age: "3 years",
      gender: "Male",
      location: "Boston, MA",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
      description: "Gentle giant, very calm and friendly.",
      vaccinated: true,
      trained: false,
      gradient: "from-gray-500 via-slate-500 to-zinc-500"
    },
    {
      id: 8,
      name: "Daisy",
      type: "Dog",
      breed: "Poodle",
      age: "2 years",
      gender: "Female",
      location: "Denver, CO",
      image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop",
      description: "Elegant poodle, hypoallergenic and well-behaved.",
      vaccinated: true,
      trained: true,
      gradient: "from-pink-500 via-rose-500 to-red-500"
    }
  ];

  const categories = ['All', 'Dog', 'Cat'];

  const filteredPets = pets.filter(pet => {
    const matchesCategory = selectedCategory === 'All' || pet.type === selectedCategory;
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

 

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
        <div className="relative pt-20 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block mb-6">
                <span className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
                  🐾 Find Your Perfect Companion
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black mb-6 animate-fade-in">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient">
                  Pets Available for Adoption
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
                Give a loving home to a pet in need. Browse our available companions and find your new best friend today!
              </p>
             <Link to={'/petreg'}>
                <button 
                 
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Add Pet for Adoption
                </button>
             </Link>
            </div>
          </div>
        </div>
  
        {/* Search and Filter Section */}
        <div className="relative max-w-7xl mx-auto px-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-3xl shadow-2xl p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search by name or breed..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-700/50 border-2 border-purple-500/30 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder-purple-300/50"
                />
              </div>
  
              {/* Category Filter */}
              <div className="flex gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/50 scale-105'
                        : 'bg-slate-700/50 text-purple-300 hover:bg-slate-700 border border-purple-500/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
  
            {/* Results Count */}
            <div className="mt-6 pt-6 border-t border-purple-500/20">
              <p className="text-purple-200 text-center">
                Showing <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-xl">{filteredPets.length}</span> pets available for adoption
              </p>
            </div>
          </div>
        </div>
  
        {/* Pets Grid */}
        <div className="relative max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPets.map((pet, idx) => (
              <div
                key={pet.id}
                className="group relative bg-slate-800/50 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 transform transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                {/* Pet Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${pet.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-lg rounded-full">
                    <span className="text-sm font-bold text-gray-800">{pet.type}</span>
                  </div>
  
                  {/* Heart Icon */}
                  <button className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-pink-500">
                    <Heart className="w-5 h-5 text-white" />
                  </button>
  
                  {/* Gender Badge */}
                  <div className="absolute bottom-4 left-4 px-4 py-2 bg-purple-500/90 backdrop-blur-lg rounded-full">
                    <span className="text-sm font-bold text-white">{pet.gender}</span>
                  </div>
                </div>
  
                {/* Pet Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-black text-white mb-1">{pet.name}</h3>
                    <p className="text-purple-300 text-sm">{pet.breed}</p>
                  </div>
  
                  <p className="text-purple-200/80 text-sm mb-4 line-clamp-2">{pet.description}</p>
  
                  {/* Pet Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm text-purple-200">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-400" />
                      </div>
                      <span>{pet.age}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-purple-200">
                      <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-pink-400" />
                      </div>
                      <span>{pet.location}</span>
                    </div>
                  </div>
  
                  {/* Badges */}
                  <div className="flex gap-2 mb-5">
                    {pet.vaccinated && (
                      <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full font-semibold border border-green-500/30">
                        <Check className="w-3 h-3" />
                        Vaccinated
                      </span>
                    )}
                    {pet.trained && (
                      <span className="flex items-center gap-1 text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full font-semibold border border-blue-500/30">
                        <Star className="w-3 h-3" />
                        Trained
                      </span>
                    )}
                  </div>
  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className={`flex-1 bg-gradient-to-r ${pet.gradient} text-white py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}>
                      <Heart className="w-4 h-4" />
                      Adopt {pet.name}
                    </button>
                    <button className="bg-slate-700/50 text-purple-300 p-3 rounded-xl hover:bg-slate-700 transition-all duration-300 border border-purple-500/20">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                </div>
  
                {/* Decorative Gradient */}
                <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${pet.gradient} opacity-20 rounded-full blur-3xl`} />
              </div>
            ))}
          </div>
  
          {/* No Results */}
          {filteredPets.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-500/20 backdrop-blur-lg border border-purple-500/30 rounded-full mb-6">
                <Search className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-4xl font-black text-white mb-4">No pets found</h3>
              <p className="text-purple-200 text-lg mb-8">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}
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
            opacity: 0; 
          }
          .animate-gradient { 
            background-size: 200% 200%; 
            animation: gradient 3s ease infinite; 
          }
        `}</style>
      </div>
      <Footer/>
    </>
   
  );
}

export default Pets;