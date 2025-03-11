import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import logo from '../../assets/logo.webp';
import axiosInstance from '../../api';
import axios from 'axios';
import {whatsappURL}  from '../../Navbar';

const PopupCard = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4">{message}</h2>
      {/* <button
        onClick={onClose}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
      >
        OK
      </button> */}
    </div>
  </div>
);

const PasswordReset = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState("");
const [reenteredPassword, setReenteredPassword] = useState("");
const [passwordsMatch, setPasswordsMatch] = useState(true); // To track if passwords match

  const [phone, setPhone] = useState('');
  
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [role, setRole] = useState('');
  const [otp, setOtp] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSendOtp = async (username, phone) => {
    if (!username || !phone) {
   //   console.error("Both username and phone are required");
      setError({ username: "username is required", phone: "phone is required" });
      return false; // return false if validation fails
    }
    
    const body = JSON.stringify({ username, phone })
    try {
      const response = await axiosInstance.post('/change-password/', body);
  
      if (response.status !== 200) {
      //  console.error("Error:", response.data);
        setError({username: "Invalid username or phone"});
        return false; // return false if the API returns an error
      } 
      else {

        // make otp
        let temp_otp = '';
        for (let i=0;i<6; i++){
          temp_otp+=Math.floor(Math.random() * 10)
        }
        
        setOtp(temp_otp)

        const payload = {
          bg_id: null,
          template: {
            id: null,
            name: "pw_reset",
            otp: temp_otp
          },
          business_phone_number_id: 241683569037594, //to be changed later
          phoneNumbers: [phone],
        };
    
        const response = await axios.post(`${whatsappURL}/send-template/`, payload,{
          headers: {
            'X-Tenant-Id': 'ai' //keep this ll
          }
        }
        );
        if (response.status == 200) return true
        else return false
      }
    } catch (error) {
   //   console.error("Request Failed:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const body = JSON.stringify({ username, newPassword })
     // console.log("body: ", body)
      const response = await axiosInstance.post(`/change-password/`, body,
        {headers : { 'Content-Type': 'application/json' }});
     // console.log("response: ", response)

      const data = response.data;
     // console.log("data: ", data)
      setShowPopup(true);
    } catch (error) {
     // console.log("erreoer: ", error)
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        navigate('/login');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showPopup, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center p-4" style={{width:"100vw"}}>
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
              <>
              
              <h2 className="font-medium text-center text-indigo-600 pb-6">Please enter your username and registered Phone Number</h2>
          
            <div>
            
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Phone</label>
              <input
                id="phone"
                name="phone"
                type="phone"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {/* <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Please Wait' : 'Confirm'}
              </button>
            </div> */}
            <div>
                  <button
                    type="button"
                    onClick={ async () => {
                    setStep(2);
                    const response = await handleSendOtp(username, phone); 
                   // console.log("response is : ", response)
                  }}
                    className= {`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 `}
                  >
                    Send OTP
                  </button>
                  
                </div>
            </>
          )}
          {step === 2 && (
            
            <>
            
              <h2 className="font-medium text-center text-indigo-600 ">Enter OTP</h2>
              <div>
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="One Time Password"
                  onChange={(e) => setEnteredOTP(e.target.value)}  // Change to setOtp
                />
              </div>
              
              <button
                type="button"
                onClick={async () => {// Example OTP, replace this with the actual OTP checking logic
                  
                  if (otp === enteredOTP) {
                    setStep(3); 
                 //   console.log("otp matched!")
                    setOtp('')
                  } else {
                 //   console.log(otp)
                    alert('Invalid OTP, please try again');
                  }
                }}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Submit
              </button>
            </>
          )}
          {step === 3 && (
            <>
            <h2 className="font-medium text-center text-indigo-600 ">Enter New Password</h2>
              
             <div>
      <label htmlFor="password" className="sr-only">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder="Type your password"
        onChange={(e) => {
          setNewPassword(e.target.value);
          if (reenteredPassword) {
            setPasswordsMatch(e.target.value === reenteredPassword); // Check if passwords match
          }
        }}
      />
    </div>

    <div>
      <label htmlFor="reenter-password" className="sr-only">Re-enter Password</label>
      <input
        id="reenter-password"
        name="reenter-password"
        type="password"
        required
        className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
          passwordsMatch ? "border-gray-300" : "border-red-500"
        } placeholder-gray-500 text-gray-900 focus:outline-none ${
          passwordsMatch ? "focus:ring-indigo-500 focus:border-indigo-500" : "focus:ring-red-500 focus:border-red-500"
        } focus:z-10 sm:text-sm`}
        placeholder="Type your password again"
        onChange={(e) => {
          setReenteredPassword(e.target.value);
          setPasswordsMatch(e.target.value === newPassword); // Compare passwords
        }}
      />
    </div>

    {!passwordsMatch && (
      <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
    )}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting' : 'Submit'}
            </button>
          </div>
          </>
          )}
          </form>
          <div className="mt-6 text-center">
          <div className="mt-4">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Go Back
            </Link>
          </div>
        </div>
        </div>
      </div>
      {showPopup && <PopupCard message={`Password Changed Successfully`} onClose={() => setShowPopup(false)} />}
            </div>
  );
};

export default PasswordReset;