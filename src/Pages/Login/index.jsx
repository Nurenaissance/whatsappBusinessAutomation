import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Lock, Check } from 'lucide-react';
import { useAuth } from '../../authContext';
import logo from '../../assets/logo.webp';
import axiosInstance, { fastURL, djangoURL } from '../../api';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';

const PopupCard = ({ message }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl transform animate-scaleIn">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-center mb-4">{message}</h2>
    </div>
  </div>
);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [role, setRole] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${djangoURL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
     
      const data = await response.json();
      
      
      if (response.status === 200) {
       
        login(data.user_id, data.tenant_id, data.role, data.model);
        setShowPopup(true);
        

      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setUsername('');
    setPassword('');
    localStorage.removeItem('auth_token'); 
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email;
      const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, 'a');
      const password = `${username}nutenai`;
  
      // Log in the user using the extracted credentials
      const response = await fetch(`${djangoURL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        login(data.user_id, data.tenant_id, data.role, data.model);
        setShowPopup(true);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setError('This email is not registered. Please register first.');
    }
  };
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        navigate('/profile');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showPopup, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
    <div className="w-full max-w-6xl mx-auto flex rounded-3xl overflow-hidden bg-black/30 backdrop-blur-lg shadow-2xl border border-[#25D366]/10">
      {/* Left Section - Graphic/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <div className="flex-1 flex items-center justify-center">
            <div className="space-y-6 w-full max-w-sm">
              {/* Animated chat bubbles */}
              <div className="flex items-start space-x-2 animate-fadeIn">
                <div className="bg-[#25D366]/20 p-4 rounded-2xl rounded-tl-none">
                  <p className="text-white">Hey! 👋</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 animate-fadeIn animation-delay-500">
                <div className="bg-[#25D366]/20 p-4 rounded-2xl">
                  <p className="text-white">Ready to reach billions?</p>
                </div>
              </div>
              <div className="flex items-start justify-end space-x-2 animate-fadeIn animation-delay-1000">
                <div className="bg-white/10 p-4 rounded-2xl rounded-tr-none">
                  <p className="text-[#25D366]">Let's get started! 🚀</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#25D366]">
              Connect Globally
            </h2>
            <p className="text-gray-300 text-lg">
              Reach 3+ billion users through instant messaging
            </p>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg border border-[#25D366]/20">
                <h3 className="text-[#25D366] text-2xl font-bold">3B+</h3>
                <p className="text-gray-400">Active Users</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-[#25D366]/20">
                <h3 className="text-[#25D366] text-2xl font-bold">180+</h3>
                <p className="text-gray-400">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-2 text-gray-400">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md animate-shake">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

// In the form section, update the input fields:

<div className="space-y-4">
  <div className="relative">
    <label className="text-gray-300 text-sm font-medium mb-1 block">
      Username
    </label>
    <div className="relative group">
      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
      <input
        type="text"
        placeholder="john.doe@example.com" // Added placeholder
        className="w-full bg-black/50 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all duration-300 placeholder-gray-600"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
    </div>
  </div>

  <div className="relative">
    <label className="text-gray-300 text-sm font-medium mb-1 block">
      Password
    </label>
    <div className="relative group">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
      <input
        type="password"
        placeholder="Enter your password" // Added placeholder
        className="w-full bg-black/50 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all duration-300 placeholder-gray-600"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
   
    </div>
  </div>
</div>



            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#25D366] text-black font-semibold py-3 rounded-lg hover:bg-[#128C7E] transition-all duration-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white/5 border border-gray-800 text-white rounded-lg py-3 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>

            <div className="text-center mt-6">
              <Link
                to="/forgot-password"
                className="text-gray-400 hover:text-[#25D366] text-sm transition-colors duration-300"
              >
                Forgot your password?
              </Link>
              <p className="mt-4 text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-[#25D366] hover:text-[#128C7E] font-medium transition-colors duration-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>

    {showPopup && (
      <PopupCard message={`Welcome back! Logging in as ${role}`} />
    )}
  </div>
  );
};

export default Login;