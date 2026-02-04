import React, { useState } from "react";
import { registerAPI, loginAPI, adminLoginAPI, createAdminAccountAPI } from "../services/allAPI";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, Shield } from "lucide-react";

function UserReg() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, password, email } = userDetails;
    
    if (username && password && email) {
      setLoading(true);
      try {
        const result = await registerAPI(userDetails);
        console.log(result);
        
        if (result.status === 200) {
          toast.success("Registration successful!");
          setUserDetails({ username: "", email: "", password: "" });
          setTimeout(() => {
            setIsLogin(true);
          }, 2000);
        } else if (result.status === 409) {
          toast.warning(result.response.data);
          setUserDetails({ username: "", email: "", password: "" });
        } else {
          console.log(result);
          toast.error("Something went wrong");
          setUserDetails({ username: "", email: "", password: "" });
        }
      } catch (err) {
        console.log(err);
        toast.error("Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.info("Please fill all required fields (username, email, password)");
    }
  };

  // ✅ Admin Registration Handler
  const handleAdminRegister = async (e) => {
    e.preventDefault();
    const { username, password, email } = userDetails;
    
    if (username && password && email) {
      setLoading(true);
      try {
        const result = await createAdminAccountAPI(userDetails);
        console.log(result);
        
        if (result.status === 201) {
          toast.success("Admin account created successfully!");
          setUserDetails({ username: "", email: "", password: "" });
          setTimeout(() => {
            setIsLogin(true);
            setIsAdminMode(true);
          }, 2000);
        } else if (result.status === 409) {
          toast.warning(result.response.data);
          setUserDetails({ username: "", email: "", password: "" });
        } else {
          console.log(result);
          toast.error("Something went wrong");
          setUserDetails({ username: "", email: "", password: "" });
        }
      } catch (err) {
        console.log(err);
        toast.error("Admin registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.info("Please fill all required fields (username, email, password)");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userDetails;
    
    if (email && password) {
      setLoading(true);
      try {
        const result = await loginAPI(userDetails);
        console.log(result);
        
        if (result.status === 200) {
          toast.success("Login successful!");
          sessionStorage.setItem("token", result.data.token);
          sessionStorage.setItem("user", JSON.stringify(result.data.user));
          
          setTimeout(() => {
            if (result.data.user.role === 'admin') {
              navigate('/admin/dashboard');
            } else {
              navigate('/');
            }
          }, 2000);
        } else if (result.status === 401 || result.status === 404) {
          toast.warning(result.response.data);
          setUserDetails({ username: "", email: "", password: "" });
        } else {
          toast.error("Something went wrong!");
          setUserDetails({ username: "", email: "", password: "" });
        }
      } catch (err) {
        console.log(err);
        toast.error("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.info("Please fill all required fields (email, password)");
    }
  };

  // ✅ Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userDetails;
    
    if (email && password) {
      setLoading(true);
      try {
        const result = await adminLoginAPI(userDetails);
        console.log(result);
        
        if (result.status === 200) {
          toast.success("Admin login successful!");
          sessionStorage.setItem("token", result.data.token);
          sessionStorage.setItem("user", JSON.stringify(result.data.user));
          
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 2000);
        } else if (result.status === 401 || result.status === 404 || result.status === 403) {
          toast.warning(result.response.data);
          setUserDetails({ username: "", email: "", password: "" });
        } else {
          toast.error("Something went wrong!");
          setUserDetails({ username: "", email: "", password: "" });
        }
      } catch (err) {
        console.log(err);
        toast.error("Admin login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.info("Please fill all required fields (email, password)");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (isAdminMode) {
        handleAdminLogin(e);
      } else {
        handleLogin(e);
      }
    } else {
      if (isAdminMode) {
        handleAdminRegister(e);
      } else {
        handleRegister(e);
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUserDetails({
      username: "",
      email: "",
      password: ""
    });
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setUserDetails({
      username: "",
      email: "",
      password: ""
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="bg-white/95 backdrop-blur-lg p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 transform transition-all duration-500 hover:shadow-purple-500/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${
            isAdminMode ? 'from-red-500 to-orange-500' : 'from-indigo-500 to-pink-500'
          } rounded-full mb-4 shadow-lg`}>
            {isAdminMode ? <Shield className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
          </div>
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${
            isAdminMode ? 'from-red-600 via-orange-600 to-yellow-600' : 'from-indigo-600 via-purple-600 to-pink-600'
          } bg-clip-text text-transparent mb-2`}>
            {isAdminMode ? (isLogin ? "Admin Login" : "Create Admin") : (isLogin ? "Welcome Back" : "Create Account")}
          </h1>
          <p className="text-gray-500 text-sm">
            {isAdminMode 
              ? (isLogin ? "Admin access only" : "Create new admin account")
              : (isLogin ? "Enter your credentials to continue" : "Join our bookstore community")
            }
          </p>
        </div>

        {/* Admin Mode Toggle */}
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={toggleAdminMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              isAdminMode 
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            {isAdminMode ? 'Admin Mode' : 'User Mode'}
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
          <button
            type="button"
            onClick={() => !isLogin && toggleMode()}
            className={`flex-1 py-2.5 px-4 rounded-full font-semibold transition-all duration-300 ${
              isLogin 
                ? `bg-gradient-to-r ${isAdminMode ? 'from-red-500 to-orange-500' : 'from-indigo-500 to-purple-500'} text-white shadow-lg`
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => isLogin && toggleMode()}
            className={`flex-1 py-2.5 px-4 rounded-full font-semibold transition-all duration-300 ${
              !isLogin 
                ? `bg-gradient-to-r ${isAdminMode ? 'from-orange-500 to-yellow-500' : 'from-purple-500 to-pink-500'} text-white shadow-lg`
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          {/* Username - Only for registration */}
          {!isLogin && (
            <div className="relative group animate-slide-down">
              <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:${isAdminMode ? 'text-orange-500' : 'text-purple-500'} transition-colors`} />
              <input
                type="text"
                name="username"
                value={userDetails.username}
                onChange={handleChange}
                placeholder="Username *"
                className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-${isAdminMode ? 'orange' : 'purple'}-500 focus:ring-4 focus:ring-${isAdminMode ? 'orange' : 'purple'}-100 transition-all duration-300`}
              />
            </div>
          )}

          {/* Email */}
          <div className="relative group animate-slide-down" style={{animationDelay: !isLogin ? '0.1s' : '0s'}}>
            <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:${isAdminMode ? 'text-orange-500' : 'text-purple-500'} transition-colors`} />
            <input
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
              placeholder="Email Address *"
              className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-${isAdminMode ? 'orange' : 'purple'}-500 focus:ring-4 focus:ring-${isAdminMode ? 'orange' : 'purple'}-100 transition-all duration-300`}
            />
          </div>

          {/* Password */}
          <div className="relative group animate-slide-down" style={{animationDelay: !isLogin ? '0.2s' : '0.1s'}}>
            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:${isAdminMode ? 'text-orange-500' : 'text-purple-500'} transition-colors`} />
            <input
              type={viewPassword ? "text" : "password"}
              name="password"
              value={userDetails.password}
              onChange={handleChange}
              placeholder="Password *"
              className={`w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-${isAdminMode ? 'orange' : 'purple'}-500 focus:ring-4 focus:ring-${isAdminMode ? 'orange' : 'purple'}-100 transition-all duration-300`}
            />
            <button
              type="button"
              onClick={() => setViewPassword(!viewPassword)}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:${isAdminMode ? 'text-orange-500' : 'text-purple-500'} transition-colors`}
            >
              {viewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-gradient-to-r ${
              isAdminMode 
                ? 'from-red-500 via-orange-500 to-yellow-500' 
                : 'from-indigo-500 via-purple-500 to-pink-500'
            } text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 mt-4 relative overflow-hidden group ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <span className="relative z-10">
              {loading ? "Processing..." : isLogin ? (isAdminMode ? "Admin Login" : "Login") : (isAdminMode ? "Create Admin" : "Create Account")}
            </span>
            <div className={`absolute inset-0 bg-gradient-to-r ${
              isAdminMode 
                ? 'from-yellow-500 via-orange-500 to-red-500' 
                : 'from-pink-500 via-purple-500 to-indigo-500'
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </button>
        </div>

        {/* Forgot Password - Only for login */}
        {isLogin && !isAdminMode && (
          <div className="text-center mt-4">
            <span className="text-purple-600 text-sm cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>
        )}

        {/* Toggle Link */}
        <p className="text-gray-600 text-sm mt-6 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            className={`text-transparent bg-gradient-to-r ${
              isAdminMode ? 'from-orange-600 to-yellow-600' : 'from-purple-600 to-pink-600'
            } bg-clip-text font-semibold cursor-pointer hover:underline`}
            onClick={toggleMode}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }
      `}</style>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
      />
    </section>
  );
}

export default UserReg;