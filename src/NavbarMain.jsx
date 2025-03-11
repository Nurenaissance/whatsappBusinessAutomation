import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from './authContext'; // Assuming you have this hook
import logo from "./assets/logo.webp";
import io from 'socket.io-client';
import axiosInstance from './api';

export const whatsappURL = 'https://whatsappbotserver.azurewebsites.net'
// export const whatsappURL = 'http://localhost:8080'


const socket = io(whatsappURL);

const Navbar = () => {
  const { authenticated, logout, tenantId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleNewMessage = (message) => {
    const newNotification = {
      id: Date.now(),
      text: `New message from ${message.contactPhone}: ${message.message.text.body}`,
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  useEffect(() => {
    const handleNewSocketMessage = (message) => {
      if (message) {
        handleNewMessage(message);
      }
    };
    socket.on('new-message', handleNewSocketMessage);
    return () => {
      socket.off('new-message');
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getPath = (path) => {
    if (authenticated) {
      return `/${tenantId}${path}`;
    } else {
      return path.startsWith('/demo') ? path : `/demo${path}`;
    }
  };

  const handleLogout = async() => {
    await axiosInstance.post('logout/');
    logout();
    navigate('/');
  };

  const profileDropdownItems = [
    { label: 'Profile', path: '/profile' },
    { label: 'Models', path: '/models' },
    { label: 'Assign', path: '/assign' },
    { label: 'Logout', action: handleLogout },
  ];

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="bg-black p-4 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-12">
        <Link style={{ display: 'flex', alignItems: 'center' }} className="text-white text-2xl font-gliker" to="/">
          <img style={{ height: '2.5rem', marginRight: '2px' }} src={logo} alt="" />
          Nuren AI
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          {authenticated && (
            <>
              <Link to={getPath('/contact')} className="text-white hover:text-gray-300">Contact</Link>
              <Link to={getPath('/broadcast')} className="text-white hover:text-gray-300">Broadcast</Link>
            </>
          )}
          <Link to={getPath('/catalog')} className="text-white hover:text-gray-300">Catalog</Link>
          {!authenticated ? <Link to={getPath('/pricing')} className="text-white hover:text-gray-300">Pricing</Link> : '' } {/* temporary fix */}
          <Link to={getPath('/chatbot')} className="text-white hover:text-gray-300">Chatbot</Link>
          <Link to={getPath('/flow-builder')} className="text-white hover:text-gray-300">Flow Builder</Link>
          
          {/* User Options */}
          {authenticated ? (
            <div className="flex items-center space-x-4">
              <Bell
                className="text-white cursor-pointer"
                onClick={handleNotificationClick}
              />
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs absolute -top-1 -right-1">
                  {unreadCount}
                </span>
              )}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div key={notification.id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center">
                        <span className={notification.read ? 'text-gray-500' : 'font-semibold'}>{notification.text}</span>
                        <button onClick={() => removeNotification(notification.id)} className="text-red-500 hover:text-red-700">
                          &times;
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-700">No new notifications</div>
                  )}
                </div>
              )}
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center text-white hover:text-gray-300 focus:outline-none">
                  <User className="mr-1" />
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {profileDropdownItems.map((item, index) => (
                      <div key={index}>
                        {item.path ? (
                          <Link to={getPath(item.path)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowProfileDropdown(false)}>
                            {item.label}
                          </Link>
                        ) : (
                          <button onClick={() => { item.action(); setShowProfileDropdown(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            {item.label}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X/> : <Menu />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black text-white pt-8 pl-9 space-y-4">
          {authenticated && (
            <>
              <Link to={getPath('/contact')} className="block hover:text-gray-300">Contact</Link>
              <Link to={getPath('/broadcast')} className="block hover:text-gray-300">Broadcast</Link>
            </>
          )}
          <Link to={getPath('/catalog')} className="block hover:text-gray-300">Catalog</Link>
          <Link to="/pricing" className="block hover:text-gray-300">Pricing</Link>
          <Link to={getPath('/chatbot')} className="block hover:text-gray-300">Chatbot</Link>
          <Link to={getPath('/flow-builder')} className="block hover:text-gray-300">Flow Builder</Link>
          
          {/* Mobile Profile Dropdown */}
          {authenticated && (
            <>
              {profileDropdownItems.map((item, index) => (
                <div key={index}>
                  {item.path ? (
                    <Link to={getPath(item.path)} className="block py-2 hover:text-gray-300">
                      {item.label}
                    </Link>
                  ) : (
                    <button onClick={() => { item.action(); setIsOpen(false); }} className="block py-2 text-left hover:text-gray-300">
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </>
          )}
          {!authenticated && (
            <Link to="/login" className="block hover:text-gray-300">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
