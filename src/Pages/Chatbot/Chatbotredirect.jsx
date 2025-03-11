import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import logo from "../../assets/logo.webp"
import axios from 'axios';
import { whatsappURL } from '../../Navbar';

const Chatbotredirect = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleAccessToken = async () => {
      try {
        // Get authorization code from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const tenantID = JSON.parse(localStorage.getItem('tenant_id')); // Replace with your actual local storage key
        const code = urlParams.get('code');
       // console.log("Here is the code",code);
        if (code) {
          // Send the auth code to the backend
          const response = await axios.post(
            `${whatsappURL}/login-flow/${tenantID}`,
            { code },  // This is the body of the request
            { headers: { 'X-Tenant-Id': tenantID } }  // This is the headers object
          );

          // Handle the response (you can save token or do other logic here)
        //  console.log('Backend response:', response.data);

          // Get tenantID from local storage and redirect
          

          const timer = setInterval(() => {
            setProgress((prevProgress) => {
              if (prevProgress >= 100) {
                clearInterval(timer);
                if (tenantID) {
                  window.location.href = `https://nuren.ai/${tenantID}/chatbot`; // Redirect to nuren.ai/tenantID/chatbot
              } else {
                //  console.error('Tenant ID not found');
                }
                return 100;
              }
              return prevProgress + (100 / 30); // Increase by 100/30 every second
            });
          }, 1000);
        } else {
        //  console.error('Authorization code not found in URL');
        }
      } catch (error) {
       // console.error('Error during login flow:', error);
      }
    };

    handleAccessToken();

    return () => clearInterval(); // Cleanup
  }, []);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width:'100vw',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Arial, sans-serif',
    marginTop:'-90px'
  };

  const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',
        marginBottom:'2rem'
      };

  const imageStyle = {
    width: '150px',
    height: '150px',
    marginBottom: '1rem',
  };

  const headingStyle = {
    color: '#2c3e50',
    marginBottom: '1rem',
  };

  const paragraphStyle = {
    color: '#34495e',
    marginBottom: '1rem',
  };

  const loaderContainerStyle = {
    width: '90%',
    maxWidth: '400px',
  };

  const progressBarStyle = {
    width: '100%',
    height: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    overflow: 'hidden',
  };

  const progressStyle = {
    width: `${progress}%`,
    height: '100%',
    backgroundColor: '#3498db',
    transition: 'width 0.5s ease-in-out',
  };

  const percentageStyle = {
    marginTop: '0.5rem',
    color: '#34495e',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img
          src={logo}
          alt="NurenAI Logo"
          style={imageStyle}
        />
        <h2 style={headingStyle}>Thank You for Choosing NurenAI!</h2>
        <p style={paragraphStyle}>
          Please wait while we verify your profile and prepare your chatbot experience.
        </p>
        <Loader2 size={32} className="animate-spin" />
      </div>
      <div style={loaderContainerStyle}>
        <div style={progressBarStyle}>
          <div style={progressStyle}></div>
        </div>
        <div style={percentageStyle}>{Math.round(progress)}% Complete</div>
      </div>
    </div>
  );
};

export default Chatbotredirect;