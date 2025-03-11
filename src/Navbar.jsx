import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PopupButton } from 'react-calendly';
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList,
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Workflow,
  MessageSquare, 
  LayoutGrid, 
  Contact, 
  Megaphone, 
  Bell, 
  UserCircle2, 
  LogOut, 
  MenuIcon,
  Loader2,
  Calendar,
  X,
  CreditCard // Added Calendar icon for Scheduled Messages
} from "lucide-react";
import { useAuth } from './authContext';
import logo from "./assets/logo.webp";
import io from 'socket.io-client';
import axiosInstance from './api';
import { fastURL} from './api.jsx';


export const whatsappURL = 'https://whatsappbotserver.azurewebsites.net'
// export const whatsappURL = 'http://localhost:8080'


const socket = io(whatsappURL);

const Navbar = () => {
 
  const { authenticated, logout, tenantId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLogouting, setIsLogouting] = useState(false);
  const location = useLocation();
  const [accountId, setAccountId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [businessPhoneNumberId,setBusinessPhoneNumberId]=useState('');
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  useEffect(() => {
    const fetchBusinessPhoneId = async () => {
      try {
        const response = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
          headers: {
            'X-Tenant-ID': tenantId
          }
        });
        const whatsappData = response.data.whatsapp_data[0];
        setAccountId(whatsappData.business_account_id);
        setBusinessPhoneNumberId(whatsappData.business_phone_number_id);
        setAccessToken(whatsappData.access_token);
      } catch (error) {
      //  console.error('Error fetching business phone ID:', error);
      }
    };

    fetchBusinessPhoneId();
  }, [tenantId]);
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(`${fastURL}/notifications`, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });
      
      const fetchedNotifications = response.data.notifications || [];
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.length);
    } catch (error) {
    //  console.error('Error fetching notifications:', error);
    }
  };

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
      //console.log("notification aaya", message); 
      if (message&&message.phone_number_id==businessPhoneNumberId) {
       // Log the received message
       fetchNotifications();// Process the new message
      }
    };
  
    socket.on('new-message', handleNewSocketMessage);
  
    return () => {
      socket.off('new-message', handleNewSocketMessage); // Use the same reference for cleanup
    };
  }, [businessPhoneNumberId, fetchNotifications]); // Include handleNewMessage in the dependency array if it comes from props or context
  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();
  }, [tenantId]); // Depend on tenantId to refetch if tenant changes
  

  const removeNotification = async (id) => {
    try {
      // Send delete request to the endpoint
     axiosInstance.delete(`${fastURL}/notifications/${id}`, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });
  
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
    //  console.error('Error removing notification:', error);
      // Optional: Add error handling, like showing a toast message
    }
  };

  const getPath = (path) => {
    if (authenticated) {
      return `/${tenantId}${path}`;
    } else {
      return path.startsWith('/demo') ? path : `/demo${path}`;
    }
  };

  const handleLogout = async() => {
    setIsLogouting(true);
    try {
      await axiosInstance.post('logout/');
      logout();
      // Check if the user is on a mobile device
      const isMobile = window.innerWidth <= 768; // Typical mobile breakpoint
      // Redirect based on device type
      window.location.href = isMobile ? '/login' : '/';
    } catch (error) {
    //  console.error('Logout failed', error);
      setIsLogouting(false);
    }
  };
  const handleRedirect = () => {
    window.location.href = 'https://www.facebook.com/v18.0/dialog/oauth?client_id=1546607802575879&redirect_uri=https%3A%2F%2Fnuren.ai%2Fchatbotredirect%2F&response_type=code&config_id=1573657073196264&state=pass-through%20value';
  };
  // Logout Loader Component
  const LogoutLoader = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-xl text-white">Logging out...</p>
      </div>
    </div>
  );


  

  const handlePaymentClick = (e) => {
    e.preventDefault();
    if (!authenticated) {
      // Redirect to login with retrn URL
      navigate(`/login`);
      return;
    }
    navigate(`${tenantId}/payment`);
  };

  const NavLinks = () => {
    const linkBaseClasses = authenticated 
      ? "group flex items-center gap-2 hover:bg-primary/10 transition-all duration-300 px-3 py-2 rounded-md relative"
      : "group flex items-center gap-2 hover:bg-gray-800 transition-all duration-300 px-3 py-2 rounded-md relative";
  
    const iconClasses = authenticated
      ? "w-5 h-5 text-primary group-hover:scale-110 transition-transform"
      : "w-5 h-5 text-gray-300 group-hover:text-white transition-transform";
  
    const textClasses = authenticated
      ? "text-foreground group-hover:text-primary"
      : "text-gray-300 group-hover:text-white";
  
    const isActive = (path) => location.pathname === getPath(path);
  
    const navigationItems = (
      <NavigationMenuList className="flex flex-col mt-20 md:mt-0 md:flex-row md:items-center md:space-x-2 gap-y-2">
        {authenticated && (
          <>
            <NavigationMenuItem>
              <Link to={getPath('/contact')}>
                <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/contact') ? 'text-primary font-semibold' : ''}`}>
                  <Contact className={`${iconClasses} ${isActive('/contact') ? 'text-primary scale-110' : ''}`} />
                  <span className={textClasses}>Contact</span>
                  {isActive('/contact') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
                  )}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={getPath('/broadcast')}>
                <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/broadcast') ? 'text-primary font-semibold' : ''}`}>
                  <Megaphone className={`${iconClasses} ${isActive('/broadcast') ? 'text-primary scale-110' : ''}`} />
                  <span className={textClasses}>Broadcast</span>
                  {isActive('/broadcast') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
                  )}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={getPath('/scheduled-events')}>
                <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/scheduled-events') ? 'text-primary font-semibold' : ''}`}>
                  <Calendar className={`${iconClasses} ${isActive('/scheduled-events') ? 'text-primary scale-110' : ''}`} />
                  <span className={textClasses}>Scheduled Messages</span>
                  {isActive('/scheduled-events') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
                  )}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}
        <NavigationMenuItem>
          <Link to={getPath('/chatbot')}>
            <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/chatbot') ? 'text-primary font-semibold' : ''}`}>
              <MessageSquare className={`${iconClasses} ${isActive('/chatbot') ? 'text-primary scale-110' : ''}`} />
              <span className={textClasses}>Direct Chat</span>
              {isActive('/chatbot') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
              )}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <Link to={getPath('/flow-builder')}>
            <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/flow-builder') ? 'text-primary font-semibold' : ''}`}>
              <Workflow className={`${iconClasses} ${isActive('/flow-builder') ? 'text-primary scale-110' : ''}`} />
              <span className={textClasses}>Flow Builder</span>
              {isActive('/flow-builder') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
              )}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <Link to={getPath('/catalog')}>
            <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/catalog') ? 'text-primary font-semibold' : ''}`}>
              <LayoutGrid className={`${iconClasses} ${isActive('/catalog') ? 'text-primary scale-110' : ''}`} />
              <span className={textClasses}>Catalog</span>
              {isActive('/catalog') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
              )}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    );
  
    return (
      <NavigationMenu>
        {navigationItems}
      </NavigationMenu>
    );
  };
  
  return (
    <>
    {isLogouting && <LogoutLoader />}
    <div className={`w-full z-40 ${!authenticated && 'fixed'} ${
  authenticated 
    ? 'bg-background border-b border-border/40 shadow-sm' 
    : 'bg-black/80 border-b border-gray-900 shadow-lg'}`}>
  <div className="container mx-auto flex justify-between items-center py-3 px-4">
    <Link 
      to="/" 
      className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
    >
      <img 
        src={logo} 
        alt="Nuren AI" 
        className="h-8 w-8 md:h-10 md:w-10 group-hover:rotate-6 transition-transform"
      />
      <span className={`hidden sm:inline text-xl md:text-2xl font-bold ${
        authenticated 
          ? 'text-primary group-hover:text-primary/80' 
          : 'bg-gradient-to-r from-emerald-300 via-green-200 to-emerald-300 bg-clip-text text-transparent group-hover:opacity-80 [text-shadow:0_2px_8px_rgba(0,255,128,0.1)]'
      }`}>
        Nuren AI
      </span>
    </Link>
  
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavLinks />
        </div>
  
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {authenticated ? (
            <>
              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative group hover:bg-primary/10 transition-all duration-300"
                  >
                    <Bell className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs animate-pulse"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className={`${notifications.length > 3 ? 'max-h-64 overflow-y-auto' : ''}`}>
                    {notifications.length > 0 ? (
                      notifications.map(notification => {
                        const [sender, message] = notification.content.replace('New meessage from ', '').split(': ');
                        
                        return (
                          <DropdownMenuItem 
                            key={notification.id} 
                            onSelect={() => removeNotification(notification.id)}
                            className="flex justify-between items-center hover:bg-primary/10 transition-colors space-x-2"
                          >
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-semibold text-sm text-primary truncate max-w-[200px]">
                                {sender}
                              </span>
                              <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                                {message}
                              </span>
                              <span className="text-xs text-muted-foreground opacity-70">
                                {new Date(notification.created_on).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                            >
                              &times;
                            </Button>
                          </DropdownMenuItem>
                        );
                      })
                    ) : (
                      <div className="text-muted-foreground text-center py-4">
                        No new notifications
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
  
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="group hover:bg-primary/10 transition-all duration-300"
                  >
                    <UserCircle2 className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={() => navigate(getPath('/profile'))}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => navigate(getPath('/models'))}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    Models
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => navigate(getPath('/assign'))}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    Assign
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => navigate(getPath('/payment'))}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <CreditCard />
                    Billing
                    
                  </DropdownMenuItem>
                  
                  {!businessPhoneNumberId && (
                    <DropdownMenuItem 
                      onSelect={handleRedirect}
                      className="bg-primary/20 text-primary font-semibold hover:bg-primary/30 transition-colors border-l-4 border-primary focus:bg-primary/30 active:bg-primary/40"
                    >
                      Set Up WhatsApp
                    </DropdownMenuItem>
                  )}
  
                  {businessPhoneNumberId && (
                    <DropdownMenuItem 
                      disabled
                      className="text-muted-foreground opacity-50 cursor-default"
                    >
                      WhatsApp Registered
                    </DropdownMenuItem>
                  )}
  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={handleLogout} 
                    className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                    disabled={isLogouting}
                  >
                    {isLogouting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2" />
                    )}
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-gray-300 bg-transparent hover:bg-gray-800/50 hover:text-white transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
              <PopupButton
  url="https://calendly.com/adarsh1885/schedule-a-demo"
  rootElement={document.getElementById("root")}
  className="relative bg-gradient-to-r from-emerald-500 to-green-500 text-white 
    hover:from-emerald-400 hover:to-green-400 
    shadow-lg hover:shadow-emerald-500/40
    transition-all duration-300
    animate-pulse hover:animate-none
    hover:scale-105 active:scale-95
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-white/20 before:to-transparent
    before:opacity-0 hover:before:opacity-100
    before:transition-opacity before:duration-300
    overflow-hidden
    ring-2 ring-emerald-500/50 hover:ring-emerald-400
    group
    px-4 py-2 rounded-md font-medium"
  text={
    <>
      <span className="relative inline-flex items-center">
        Book Demo

      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 
        blur-xl group-hover:blur-2xl transition-all duration-300"></span>
    </>
  }
/>
            </div>
          )}
  
          {/* Mobile Menu */}
          <Sheet 
            open={isSheetOpen} 
            onOpenChange={setIsSheetOpen}
            modal={false}
          >
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`${
                  authenticated 
                    ? "hover:bg-primary/10" 
                    : "text-gray-300 hover:bg-gray-800/50 bg-transparent"
                } transition-all duration-300`}
              >
                <MenuIcon className={
                  authenticated 
                    ? "w-6 h-6 text-primary group-hover:scale-110 transition-transform"
                    : "w-6 h-6 text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform"
                } />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className={`w-[300px] ${
                authenticated ? "" : "bg-black/90 backdrop-blur-md border-r border-gray-900"
              }`}
              style={{ zIndex: 205 }}
            >
              <SheetHeader>
                <SheetTitle className={`flex items-center space-x-2 ${
                  authenticated ? "" : "text-white"
                }`}>
                  <img src={logo} alt="Nuren AI Logo" className="h-8 w-8" />
                  <span>Nuren AI</span>
                </SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <NavLinks />
                {!authenticated && (
                  <div className="space-y-3">
                    <Link to="/login">
                      <Button className="w-full bg-gray-900/80 text-gray-300 hover:bg-gray-800 hover:text-white">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600">
                        Start Free Trial
                      </Button>
                    </Link>
                  </div>
                )}
                
                {/* Close Button at the bottom */}
                <SheetClose asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full mt-4 flex items-center justify-center"
                  >
                    <X className="mr-2 h-5 w-5" />Close
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </>
  );
};

export default Navbar;