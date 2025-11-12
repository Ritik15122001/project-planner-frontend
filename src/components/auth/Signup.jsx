import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await authService.signup(signupData);
      login(response.user, response.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background Blobs - Hidden on mobile for performance */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Top Gradient Card */}
          <div className="lg:hidden mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Join Project Planner
            </h2>
            <p className="text-center text-white/90 text-sm">
              Start managing your projects today
            </p>
          </div>

          {/* Signup Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
            {/* Logo and Header - Desktop Only */}
            <div className="hidden lg:block text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-sm text-gray-600">
                Start your journey with us today
              </p>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-sm text-gray-600">
                Join us today
              </p>
            </div>

            {/* Signup Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm bg-white`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm bg-white`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-10 pr-12 py-3 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm bg-white`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors touch-manipulation"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-10 pr-12 py-3 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm bg-white`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors touch-manipulation"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-95 shadow-lg touch-manipulation"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 pt-2">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors touch-manipulation"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>

          {/* Mobile Features - Show below form */}
          <div className="lg:hidden mt-8 space-y-3 px-2">
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Free to Get Started</p>
                <p className="text-xs text-gray-600">No credit card required</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure & Private</p>
                <p className="text-xs text-gray-600">Your data is protected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Easy Setup</p>
                <p className="text-xs text-gray-600">Get started in minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Right Side - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-12 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Start Your Journey Today
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of teams already using our platform to streamline their project management.
            </p>
            
            {/* Benefits List */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FiCheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Free to Start</h3>
                  <p className="text-white/80 text-sm">No credit card required, start for free</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiCheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Secure Platform</h3>
                  <p className="text-white/80 text-sm">Your data is encrypted and protected</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiCheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Quick Setup</h3>
                  <p className="text-white/80 text-sm">Get started in less than 2 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
