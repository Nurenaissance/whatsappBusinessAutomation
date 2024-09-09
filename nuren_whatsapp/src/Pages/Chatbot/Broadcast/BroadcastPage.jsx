import React, { useCallback, useEffect, useRef, useState } from 'react';
import './BroadcastPage.css';
import axiosInstance from '../../../api';
import axios from 'axios';
import { Edit2, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; 
// import { uploadToBlob } from '../../../utils/azureStorage';
import { useAuth } from '../../../authContext';
import uploadToBlob from '../../../azureUpload';

const getTenantIdFromUrl = () => {
  // Example: Extract tenant_id from "/3/home"
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    return pathArray[1]; // Assumes tenant_id is the first part of the path
  }
  return null; // Return null if tenant ID is not found or not in the expected place
};

const BroadcastPage = () => {
  const [showTemplatePopup, setShowTemplatePopup] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeTab, setActiveTab] = useState('history');
  const [showBroadcastPopup, setShowBroadcastPopup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [headerType, setHeaderType] = useState('text');
  const [headerContent, setHeaderContent] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [buttons, setButtons] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [headerImage, setHeaderImage] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const [broadcastHistory, setBroadcastHistory] = useState([]);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [headerMediaId, setHeaderMediaId] = useState('');
  const { userId } = useAuth();
  const fileInputRef = useRef(null);
  const tenantId=getTenantIdFromUrl();


  const fetchTemplates = useCallback(async () => {
    if (!accessToken) return;
    try {
      const url = `https://graph.facebook.com/v20.0/441785372346471/message_templates?fields=name,status,components,language,category`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setTemplates(response.data.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }, [accessToken]);
  
    // Fetch the required data from the whatsapp_tenant endpoint
    useEffect(() => {
      const fetchTenantData = async () => {
        try {
          const business_phone_number_id = 241683569037594;
          const response = await axiosInstance.get(`/whatsapp_tenant/?business_phone_id=${business_phone_number_id}`);
          setAccessToken(response.data.access_token);
          setBusinessPhoneNumberId(response.data.business_phone_number_id);
        } catch (error) {
          console.error('Error fetching tenant data:', error);
        }
      };
      
      fetchTenantData();
    }, []);

    useEffect(() => {
      if (accessToken) {
        fetchTemplates();
        fetchBroadcastHistory();
      }
    }, [accessToken, fetchTemplates]);


    const handleEditTemplate = async (template) => {
      setIsEditing(true);
      setSelectedTemplate(template);
      setShowTemplatePopup(true);
      setTemplateName(template.name);
      setCategory(template.category);
      setLanguage(template.language);
      
      const headerComponent = template.components.find(c => c.type === "HEADER");
      if (headerComponent) {
        setHeaderType(headerComponent.format.toLowerCase());
        setHeaderContent(headerComponent.text || headerComponent.example?.header_handle?.[0] || '');
      }
  
      const bodyComponent = template.components.find(c => c.type === "BODY");
      if (bodyComponent) {
        setBodyText(bodyComponent.text);
      }
  
      const footerComponent = template.components.find(c => c.type === "FOOTER");
      if (footerComponent) {
        setFooterText(footerComponent.text);
      }
  
      const buttonsComponent = template.components.find(c => c.type === "BUTTONS");
      if (buttonsComponent) {
        setButtons(buttonsComponent.buttons.map(button => ({ text: button.text })));
      } else {
        setButtons([]);
      }
    };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const url = `https://graph.facebook.com/v20.0/441785372346471/message_templates?name=${templateId}`;
        await axios.delete(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        await fetchTemplates(); // Refresh the template list
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };


  const handleSendBroadcast = async () => {
    if (selectedPhones.length === 0 ) {
      alert("Please select at least one contact and enter a message.");
      return;
    }
  
    setIsSendingBroadcast(true);
  
    try {
      // Create a new group and save it to local storage
      const newGroup = {
        id: uuidv4(),
        name: groupName || `Broadcast Group ${new Date().toISOString()}`,
        members: selectedPhones,
      };
      // saveGroupToLocalStorage(newGroup);
  
      // Prepare the data in the specified format
      const phoneNumbers = selectedPhones.map((contactId) => {
        const contact = contacts.find((c) => c.id === contactId);
        return parseInt(contact.phone); // Ensure the phone number is an integer
      });
  
      const payload = {
        bg_id: newGroup.id,
        template: {
          name: selectedTemplate?.name || "under_name",
        },
        business_phone_number_id: 397261306804870,
        phoneNumbers: phoneNumbers,
      };
  
      // Send the broadcast message
      const response = await axiosInstance.post('https://whatsappbotserver.azurewebsites.net/send-template/', payload);
  
      if (response.status === 200) {
        console.log("Broadcast sent successfully");
        alert("Broadcast message sent successfully!");
        handleCloseBroadcastPopup();
      } else {
        throw new Error("Failed to send broadcast");
      }
  
      const broadcastMessageObj = { text: broadcastMessage, sender: 'bot' };
      setGroups(prevGroups =>
        prevGroups.map(group => ({
          ...group,
          conversation: [...(group.conversation || []), broadcastMessageObj],
        }))
      );
  
      // If the current selected contact is a group, update the conversation
      if (selectedContact && selectedContact.isGroup) {
        setConversation(prevConversation => [...prevConversation, broadcastMessageObj]);
      }
    } catch (error) {
      console.error("Error sending broadcast:", error);
      alert("Failed to send broadcast message. Please try again.");
    } finally {
      setIsSendingBroadcast(false);
    }
  };


  const handleCloseBroadcastPopup = () => {
    setShowBroadcastPopup(false);
    setBroadcastMessage('');
    setSelectedPhones([]);
    setGroupName('');
    setIsSendingBroadcast(false);
  };
  
  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    
    const components = [
      {
        type: "HEADER",
        format: headerType.toUpperCase(),
        text: headerType === 'text' ? headerContent : undefined,
        example: headerType === 'image' ? { header_handle: [headerMediaId] } : undefined,
      },
      {
        type: "BODY",
        text: bodyText,
      }
    ];

    if (footerText) {
      components.push({
        type: "FOOTER",
        text: footerText
      });
    }

    if (buttons.length > 0) {
      components.push({
        type: "BUTTONS",
        buttons: buttons.map(button => ({
          type: "QUICK_REPLY",
          text: button.text,
        }))
      });
    }

    const templateData = {
      name: templateName,
      category: category,
      components: components,
      language: language
    };

    try {
      const url = isEditing
        ? `https://graph.facebook.com/v20.0/441785372346471/message_templates`
        : `https://graph.facebook.com/v20.0/441785372346471/message_templates`;
      
      const method = isEditing ? 'post' : 'post';
      
      const response = await axios({
        method: method,
        url: url,
        data: templateData,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log('Template created/updated:', response.data);
      setShowTemplatePopup(false);
      resetTemplateForm();
      await fetchTemplates(); // Refresh the template list
      setActiveTab('templates'); // Ensure we're on the templates tab
    } catch (error) {
      console.error('Error creating/updating template:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const fetchTemplateDetails = async (templateId) => {
    try {
      const url = `https://graph.facebook.com/v20.0/${templateId}?fields=name,status,components,language`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setSelectedTemplateDetails(response.data);
    } catch (error) {
      console.error('Error fetching template details:', error);
    }
  };


  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    fetchTemplateDetails(template.id);
  };

  const handleBroadcastMessage = () => {
    setShowBroadcastPopup(true);
  };
  

  
  const resetTemplateForm = () => {
    setTemplateName('');
    setCategory('');
    setLanguage('');
    setHeaderType('text');
    setHeaderContent('');
    setBodyText('');
    setFooterText('');
    setButtons([]);
    setHeaderImage(null);
    setIsEditing(false);
    setSelectedTemplate(null);
  };
  
  const fetchBroadcastHistory = async () => {
    try {
      const response = await axiosInstance.get('get-status/');
      const formattedHistory = formatBroadcastHistory(response.data.message_statuses);
      setBroadcastHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching broadcast history:', error);
    }
  };


  const sortContacts = (contactsToSort) => {
    return contactsToSort.sort((a, b) => {
      if (a.hasNewMessage !== b.hasNewMessage) {
        return b.hasNewMessage ? 1 : -1;
      }
      if (a.lastMessageTime !== b.lastMessageTime) {
        return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
      }
      const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim();
      const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim();
      return nameA.localeCompare(nameB);
    });
  };


  const fetchContacts = async () => {
    try {
      const response = await axiosInstance.get('/contacts/', {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      // Ensure all contacts have the necessary properties
      const processedContacts = response.data.map(contact => ({
        ...contact,
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        lastMessageTime: contact.lastMessageTime || null,
        hasNewMessage: contact.hasNewMessage || false
      }));
      setContacts(sortContacts(processedContacts));
    } catch (error) {
      console.error("Error fetching contacts data:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);


  const formatBroadcastHistory = (messageStatuses) => {
    const filteredStatuses = messageStatuses.filter(status => status.broadcast_group !== null);

    const groupedStatuses = filteredStatuses.reduce((acc, status) => {
      if (!acc[status.broadcast_group]) {
        acc[status.broadcast_group] = [];
      }
      acc[status.broadcast_group].push(status);
      return acc;
    }, {});
    return Object.entries(groupedStatuses).map(([broadcastGroup, statuses]) => ({
      id: broadcastGroup,
      name: `Broadcast Group ${broadcastGroup}`,
      sent: statuses.length,
      delivered: statuses.filter(s => s.is_delivered).length,
      read: statuses.filter(s => s.is_read).length,
      replied: 0, // This information is not provided in the API response
      date: new Date().toLocaleDateString(), // You might want to add a timestamp to your API response
      status: 'Completed', // You might want to derive this from the API data
      recipients: statuses.map(s => s.user_phone_number)
    }));
  };

  const handlePhoneSelection = (contactId) => {
    setSelectedPhones(prevSelected => 
      prevSelected.includes(contactId)
        ? prevSelected.filter(id => id !== contactId)
        : [...prevSelected, contactId]
    );
  };


  const addButton = () => {
    setButtons([...buttons, { text: '' }]);
  };


  const updateButton = (index, field, value) => {
    const updatedButtons = buttons.map((button, i) => 
      i === index ? { ...button, [field]: value } : button
    );
    setButtons(updatedButtons);
  };

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setHeaderImage(selectedFile);
      setHeaderContent(URL.createObjectURL(selectedFile));
  
      try {
        console.log('Uploading file to WhatsApp Media API...');
  
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', 'image');
        formData.append('messaging_product', 'whatsapp');
  
        const response = await axios.post(
          'https://my-template-whatsapp.vercel.app/uploadMedia',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            },
          }
        );
  
        console.log('File uploaded to WhatsApp, ID:', response.data.body.h);
        setHeaderMediaId(response.data.body.h);
        setUploadProgress(100);
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadProgress(0);
      }
    }
  };

  return (
    <div className="bp-broadcast-page">
      <div className="bp-left-sidebar">
        <div className={`bp-menu-item ${activeTab === 'history' ? 'bp-active' : ''}`} onClick={() => setActiveTab('history')}>Broadcast History</div>
        <div className={`bp-menu-item ${activeTab === 'templates' ? 'bp-active' : ''}`} onClick={() => setActiveTab('templates')}>Template Messages</div>
      </div>
      <div className="bp-main-content">
      {activeTab === 'history' && (
        <div className="bp-broadcast-history">
          <h1 style={{fontSize:'36px', fontWeight:'600', fontFamily:'sans-serif'}}>Broadcast History</h1>
          <div className="bp-action-bar">
            <div className="bp-date-filter">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              <button className="bp-btn-apply">Apply</button>
            </div>
            <button className="bp-btn-create" onClick={handleBroadcastMessage}>New Broadcast</button>
          </div>
          {showBroadcastPopup && (
        <div className="cb-broadcast-popup">
          <div className="cb-broadcast-content">
            <h2>Broadcast Message</h2>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name (optional)"
              className="cb-group-name-input"
            />
            {/* <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Type your broadcast message here..."
              className="cb-broadcast-message-input"
            /> */}
             <div className="bp-template-actions" style={{display:'flex', justifyContent:'space-between', marginBottom:'2rem'}}>
              <select
                value={selectedTemplate?.id || ''}
                onChange={(e) => handleTemplateClick(templates.find(t => t.id === e.target.value))}
              >
                <option value="">Select Template</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <button className="bp-btn-create" onClick={() => setShowTemplatePopup(true)}>Create Template</button>
            </div>
            <div className="cb-broadcast-contact-list">
              <h3>Select Contacts:</h3>
              {contacts.map(contact => (
                <div key={contact.id} className="cb-broadcast-contact-item">
                  <input
                    type="checkbox"
                    id={`contact-${contact.id}`}
                    checked={selectedPhones.includes(contact.id)}
                    onChange={() => handlePhoneSelection(contact.id)}
                  />
                  <label htmlFor={`contact-${contact.id}`}>
                    {contact.first_name} {contact.last_name} ({contact.phone})
                  </label>
                </div>
              ))}
            </div>
            <div className="cb-broadcast-actions">
              <button 
                onClick={handleSendBroadcast} 
                // disabled={isSendingBroadcast || selectedPhones.length === 0 || !broadcastMessage.trim()}
                className="cb-send-broadcast-btn"
              >
                {isSendingBroadcast ? "Sending..." : "Send Broadcast"}
              </button>
              <button onClick={handleCloseBroadcastPopup} className="cb-cancel-broadcast-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
          <div className="bp-broadcast-stats">
            <div className="bp-stat-item">
              <span className="bp-stat-value">{broadcastHistory.reduce((sum, b) => sum + b.sent, 0)}</span>
              <span className="bp-stat-label">Sent</span>
            </div>
            <div className="bp-stat-item">
              <span className="bp-stat-value">{broadcastHistory.reduce((sum, b) => sum + b.delivered, 0)}</span>
              <span className="bp-stat-label">Delivered</span>
            </div>
            <div className="bp-stat-item">
              <span className="bp-stat-value">{broadcastHistory.reduce((sum, b) => sum + b.read, 0)}</span>
              <span className="bp-stat-label">Read</span>
            </div>
          </div>
          <div className="bp-broadcast-list">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sent</th>
                  <th>Delivered</th>
                  <th>Read</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {broadcastHistory.map(broadcast => (
                  <tr key={broadcast.id}>
                    <td>{broadcast.name}</td>
                    <td>{broadcast.sent}</td>
                    <td>{broadcast.delivered}</td>
                    <td>{broadcast.read}</td>
                    <td>{broadcast.date}</td>
                    <td><span className={`bp-status bp-${broadcast.status.toLowerCase().replace(' ', '-')}`}>{broadcast.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        {activeTab === 'templates' && (
          <div className="bp-template-messages">
            <h1 style={{fontSize:'36px', fontWeight:'600', fontFamily:'sans-serif'}}>Template Messages</h1>
            <button className="bp-btn-create" onClick={() => {
              resetTemplateForm();
              setShowTemplatePopup(true);
            }}>Create Template</button>
            <div className="bp-template-list">
              {templates.map((template, index) => (
                <div key={index} className="bp-template-item">
                  <h3>{template.name}</h3>
                  <p className={`bp-status-${template.status.toLowerCase()}`}>
                    Status: {template.status}
                  </p>
                  <p>Category: {template.category}</p>
                  <p>Language: {template.language}</p>
                  <p>Body: {template.components.find(c => c.type === "BODY")?.text.substring(0, 50)}...</p>
                  {template.components.find(c => c.type === "BUTTONS") && (
                    <p>Buttons: {template.components.find(c => c.type === "BUTTONS").buttons.length}</p>
                  )}
                  <div className="bp-template-actions">
                    <button onClick={() => handleEditTemplate(template)} className="bp-btn-edit">
                      <Edit2 size={18} />
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTemplate(template.name)} className="bp-btn-delete">
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showTemplatePopup && (
        <div className="bp-popup-overlay">
          <div className="bp-popup bp-template-popup">
            <h2>{isEditing ? 'Edit' : 'Create'} WhatsApp Template Message</h2>
            <div className="bp-template-form-container">
              <form onSubmit={handleCreateTemplate}>
                <div className="bp-form-group">
                  <label>Template Name</label>
                  <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} required />
                </div>
                <div className="bp-form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select category...</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="TRANSACTIONAL">Transactional</option>
                  </select>
                </div>
                <div className="bp-form-group">
                  <label>Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} required>
                    <option value="">Select language...</option>
                    <option value="en_US">English (US)</option>
                    <option value="es_ES">Spanish (Spain)</option>
                  </select>
                </div>
                <div className="bp-form-group">
            <label>Header (Optional)</label>
            <select value={headerType} onChange={(e) => setHeaderType(e.target.value)}>
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
            {headerType === 'text' ? (
              <input
                type="text"
                value={headerContent}
                onChange={(e) => setHeaderContent(e.target.value)}
                placeholder="Header Text"
              />
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
                <button type="button" onClick={() => fileInputRef.current.click()}>
                  Upload Image
                </button>
                {headerImage && <span>{headerImage.name}</span>}
                {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
              </>
            )}
          </div>
                <div className="bp-form-group">
                  <label>Body Text</label>
                  <textarea
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    required
                    placeholder="Use {{1}}, {{2}}, etc. for variables"
                  ></textarea>
                </div>
                <div className="bp-form-group">
                  <label>Footer (Optional)</label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    placeholder="Footer Text"
                  />
                </div>
                <div className="bp-form-group">
                  <label>Buttons (Optional)</label>
                  {buttons.map((button, index) => (
                    <div key={index} className="bp-button-inputs">
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={button.text}
                        onChange={(e) => updateButton(index, 'text', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Button URL"
                        value={button.url}
                        onChange={(e) => updateButton(index, 'url', e.target.value)}
                      />
                    </div>
                  ))}
                  <button type="button" onClick={addButton} className="bp-btn-add-button">Add Button</button>
                </div>
                <div className="bp-form-actions">
                  <button type="submit" className="bp-btn-save">
                    {isEditing ? 'Update' : 'Save'} Template
                  </button>
                  <button type="button" className="bp-btn-cancel" onClick={() => {
                    setShowTemplatePopup(false);
                    resetTemplateForm();
                  }}>Cancel</button>
                </div>
              </form>
              <div className="bp-template-preview">
                <div className="bp-whatsapp-preview">
                  <h3 style={{
zIndex:'9',
color:'white',
marginBottom:'3rem'
                  }}>WhatsApp Template Preview</h3>
                  <div className="bp-message-container">
                    {headerType === 'text' && headerContent && (
                      <div className="bp-message-header">{headerContent}</div>
                    )}
                    {headerType === 'image' && headerContent && (
                      <img src={headerContent} alt="Header" className="bp-message-header-image" />
                    )}
                    <div className="bp-message-body">
                      {bodyText}
                    </div>
                    {footerText && <div className="bp-message-footer">{footerText}</div>}
                    {buttons.length > 0 && (
                      <div className="bp-message-buttons">
                        {buttons.map((button, index) => (
                          <a key={index} href={button.url} className="bp-message-button">
                            {button.text}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="bp-message-time">1:10 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcastPage;