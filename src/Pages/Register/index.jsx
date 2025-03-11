import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Building2, Lock, User, Mail, Phone, Globe, Zap,MessageSquare  } from 'lucide-react';
import logo from '../../assets/logo.webp';
import axiosInstance, { fastURL, djangoURL } from '../../api';
import { auth, googleProvider } from '../../firebase';
import register from '../../assets/resgister.webp';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../authContext';
const FullScreenLoader = () => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white text-lg">Setting up your account...</p>
    </div>
  </div>
);

const PopupCard = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl transform animate-scaleIn">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-center mb-4">{message}</h2>
      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 font-medium"
      >
        Continue to Login
      </button>
    </div>
  </div>
);

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password:'',
        role: '',
        organisation: '',
        passwordo: '',
        phone: '0000000000' // Default phone number
    });
    const [organisations, setOrganisations] = useState([]);
    const [showNewOrgForm, setShowNewOrgForm] = useState(false);
    const [newOrg, setNewOrg] = useState({
        name: '',
        tenantId: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verifyingTenant, setVerifyingTenant] = useState(false);
    const [creatingOrg, setCreatingOrg] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [errors, setErrors] = useState({});
    const [firebaseError, setFirebaseError] = useState(null);
    const [step, setStep] = useState(1);
    const { login } = useAuth();

    useEffect(() => {
        fetch(`${djangoURL}/createTenant`)
            .then((res) => res.json())
            .then((data) => {
                const orgNames = data.map((org) => ({
                    id: org.id,
                    name: org.organization,
                    tenantId: org.id,
                }));
                setOrganisations(orgNames);
            })
            .catch((error) => console.error('Error fetching organisations:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (e.target.value === "createNew") {
            setShowNewOrgForm(true);
        } else {
            setShowNewOrgForm(false);
        }
    };

    const handleNewOrgInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrg((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        if (!formData.organisation) newErrors.organisation = 'Organisation is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const selectedOrg = organisations.find((org) => org.name === formData.organisation);
        const selectedTenantId = selectedOrg ? selectedOrg.tenantId : '';

        try {
            const response = await fetch(`${djangoURL}/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Id': selectedTenantId,
                },
                body: JSON.stringify({
                    ...formData,
                    tenant: selectedTenantId,
                }),
            });
            const response_json = await response.json()
            if (!response.ok) {
                setErrors({username: response_json.msg})
                throw new Error(response_json.msg);
            }

            setShowPopup(true);

        } catch (error) {
          //  console.error('Registration failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const createTenantID = async () => {
        const generateUniqueID = (length) => {
            const characters = 'qwertyuiopasdfghjklzxcvbnm'
            let result =''
            for (let i=0;i<length;i++){
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result
        }

        const tenantID = generateUniqueID(7)
        return tenantID
    }

    const handleNext = async () => {
        const { organisation, passwordo } = formData;
    
        if (!organisation || !passwordo) {
          //  console.error("Both organisation and password are required");
            setErrors({ organisation: "Organisation is required", password: "Password is required" });
            return false;
        }
        setVerifyingTenant(true)
        try {
            // Create a local variable specifically for the backend request
            const backendPayload = {
                organisation,
                password: passwordo  // Use the value of passwordo for 'password'
            };
    
            const response = await axiosInstance.post('/verifyTenant/', backendPayload);
    
            if (response.status !== 200) {
            //    console.error("Error:", response.data);
                setErrors({ organisation: "Invalid organisation or password" });
                return false;
            } else {
             //   console.log("Success:", response.data);
                return true;
            }
        } catch (error) {
        //    console.error("Request Failed:", error);
            setErrors({ password: "Password is incorrect. Please provide correct password" });
            return false;
        } finally {
            setVerifyingTenant(false)
        }
    };

    const handleCreateNewOrg = async () => {
        setCreatingOrg(true)
        try {
            newOrg.tenantId = await createTenantID()
            const response = await fetch(`${djangoURL}/createTenant/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenant_id: newOrg.tenantId,
                    organization: newOrg.name,
                    password: newOrg.password,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setOrganisations([...organisations, { id: data.id, name: newOrg.name, tenantId: newOrg.tenantId }]);
            setShowNewOrgForm(false);
            setNewOrg({ name: '', tenantId: '', password: '' });
            alert('New organisation created successfully!');
        } catch (error) {
        //    console.error('Error creating new organisation:', error);
        }
    };

    const handleFirebaseSignIn = async () => {
        setFirebaseError(null); // Reset any previous errors
        setIsSubmitting(true); // Start loading

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const email = user.email;
            const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, 'a');
            const password = `${username}nutenai`;

            // Create tenant with organisation name and password derived from email
            const tenantId = await createTenantID();
            const tenantResponse = await fetch(`${djangoURL}/createTenant/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenant_id: tenantId,
                    organization: username,
                    password: username,
                }),
            });

            if (!tenantResponse.ok) {
                throw new Error(`HTTP error! Status: ${tenantResponse.status}`);
            }

            // Register user with the extracted details
            const registerResponse = await fetch(`${djangoURL}/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Id': tenantId,
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role: 'user',
                    organisation: username,
                    phone: '0000000000',
                    tenant: tenantId,
                }),
            });

            if (!registerResponse.ok) {
                throw new Error(`HTTP error! Status: ${registerResponse.status}`);
            }

            // Automatically log in the user
            const loginResponse = await fetch(`${djangoURL}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!loginResponse.ok) {
                throw new Error(`HTTP error! Status: ${loginResponse.status}`);
            }

            const loginData = await loginResponse.json();
            localStorage.setItem('token', loginData.token);
            login(loginData.user_id, loginData.tenant_id, loginData.role, loginData.model);
            navigate('/'); // Redirect to dashboard or desired page

        } catch (error) {
        //    console.error('Firebase sign-in or registration failed:', error);
            setFirebaseError(error.message); // Set error message for user feedback
        } finally {
            setIsSubmitting(false); // Stop loading
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-300`} />
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-300`} />
        </div>
    );

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
    {isSubmitting && <FullScreenLoader />}
    
    <div className="container mx-auto flex rounded-3xl overflow-hidden max-w-6xl bg-black/30 backdrop-blur-lg shadow-2xl border border-[#25D366]/10">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black p-12 justify-center items-center">
  <img 
    src={register}
    alt="Person connecting apps with WhatsApp" 
    className="w-full max-w-md rounded-lg shadow-lg"
  />
</div>



      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-8">
          {/* Logo */}
          

          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join us to start your AI journey</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`h-2 w-2 rounded-full transition-all duration-300 ${step === 1 ? 'bg-[#25D366] w-8' : 'bg-gray-600'}`} />
            <div className={`h-2 w-2 rounded-full transition-all duration-300 ${step === 2 ? 'bg-[#25D366] w-8' : 'bg-gray-600'}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-1 block">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="text"
                      name="organisation"
                      placeholder="Enter your organization name"
                      className="w-full bg-black/50 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all duration-300"
                      value={formData.organisation}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.organisation && (
                    <p className="mt-1 text-sm text-red-500">{errors.organisation}</p>
                  )}
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-1 block">
                    Organization Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="password"
                      name="passwordo"
                      placeholder="Enter organization password"
                      className="w-full bg-black/50 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all duration-300"
                      value={formData.passwordo}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.passwordo && (
                    <p className="mt-1 text-sm text-red-500">{errors.passwordo}</p>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowNewOrgForm(true)}
                    className="text-[#25D366] hover:text-[#128C7E] font-medium transition-colors duration-300"
                  >
                    Create New Organization
                  </button>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const response = await handleNext();
                    if(response) setStep(2);
                  }}
                  className="w-full bg-[#25D366] text-black font-semibold py-3 rounded-xl hover:bg-[#128C7E] transition-all duration-300 flex items-center justify-center"
                  disabled={verifyingTenant}
                >
                  {verifyingTenant ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-slideIn">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-1 block">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      className="w-full bg-black/50 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all duration-300"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-1 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full bg-black/50 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all duration-300"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-1 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="w-full bg-black/50 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all duration-300"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-1 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Create a strong password"
                      className="w-full bg-black/50 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all duration-300"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 flex items-center justify-center bg-black/50 border border-gray-800 text-white rounded-xl hover:bg-black/70 transition-all duration-300"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 flex items-center justify-center bg-[#25D366] text-black font-semibold rounded-xl hover:bg-[#128C7E] transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2" />
                        Creating...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleFirebaseSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center bg-white/5 border border-gray-800 text-white rounded-xl py-3 hover:bg-white/10 transition duration-300"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
            </button>

            <p className="text-center text-gray-400">
              Already have an account?{' '}
              <NavLink 
                to="/login" 
                className="text-[#25D366] hover:text-[#128C7E] font-medium transition-colors duration-300"
              >
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>

            {/* Create New Organization Modal */}
            {showNewOrgForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform animate-scaleIn">
                        <h3 className="text-xl font-bold mb-4">Create New Organization</h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Organization Name"
                                    className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={newOrg.name}
                                    onChange={handleNewOrgInputChange}
                                />
                            </div>
                            
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Organization Password"
                                    className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={newOrg.password}
                                    onChange={handleNewOrgInputChange}
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowNewOrgForm(false)}
                                    className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                
                                <button
                                    onClick={handleCreateNewOrg}
                                    disabled={creatingOrg}
                                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
                                >
                                    {creatingOrg ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                            Creating...
                                        </div>
                                    ) : (
                                        'Create Organization'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPopup && (
                <PopupCard
                    message="Registration successful! Welcome aboard."
                    onClose={() => {
                        setShowPopup(false);
                        navigate('/login');
                    }}
                />
            )}
        </div>
    );
};

export default Register;