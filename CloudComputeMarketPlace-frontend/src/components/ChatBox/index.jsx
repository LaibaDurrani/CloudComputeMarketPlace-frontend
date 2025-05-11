import React, { useState, useEffect, useRef, useContext } from 'react';
import { createConversation, getConversation, sendMessage, markMessagesAsRead } from '../../services/api';
import { useNotifications } from '../../context/NotificationsContext';
import LoadingSpinner from '../LoadingSpinner';
import './styles.css';

const ChatBox = ({ computerId, computerTitle, currentUser, ownerId }) => {
  const { refreshUnreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContentRef = useRef(null);

  // Initialize conversation when chat is opened
  useEffect(() => {
    if (isOpen && computerId && !conversation) {
      initializeConversation();
    }
  }, [isOpen, computerId]);
  // Scroll to the bottom when new messages arrive and refresh notification count
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // If messages change and we're not in loading state, refresh notification count
    if (!loading && messages.length > 0) {
      refreshUnreadCount();
    }
  }, [messages, isOpen, loading, refreshUnreadCount]);  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && conversation?._id) {
      markMessagesAsRead(conversation._id)
        .then(() => {
          // Refresh the unread message count in the header
          refreshUnreadCount();
        })
        .catch(error => {
          console.error('Error marking messages as read:', error);
        });
    }
  }, [isOpen, conversation, refreshUnreadCount]);  const initializeConversation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Make sure we're logged in
      if (!currentUser) {
        setError("You must be logged in to start a conversation");
        setLoading(false);
        return;
      }
      
      // Check if this is your own computer
      if (currentUser.id === ownerId || currentUser._id === ownerId) {
        setError("You cannot message yourself about your own computer");
        setLoading(false);
        return;
      }
      
      // Create conversation if it doesn't exist or get existing one
      const createResponse = await createConversation(computerId);
      
      if (!createResponse || !createResponse.data || !createResponse.data.data || !createResponse.data.data._id) {
        console.error("Invalid response from createConversation:", createResponse);
        throw new Error('Failed to create or get conversation');
      }
      
      const conversationId = createResponse.data.data._id;
      
      // Get the conversation with messages
      const conversationResponse = await getConversation(conversationId);
      
      if (!conversationResponse || !conversationResponse.data || !conversationResponse.data.data) {
        console.error("Invalid response from getConversation:", conversationResponse);
        throw new Error('Failed to get conversation details');
      }
      
      setConversation(conversationResponse.data.data.conversation);
      setMessages(conversationResponse.data.data.messages || []);
      
      setLoading(false);
    } catch (err) {
      console.error('Error initializing conversation:', err);
      
      // Provide more specific error messages based on error type
      if (err.response) {
        if (err.response.status === 403) {
          setError('You do not have permission to access this conversation.');
        } else if (err.response.status === 404) {
          setError('Conversation or computer not found.');
        } else if (err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError(`Error ${err.response.status}: Failed to load conversation.`);
        }
      } else {
        setError('Failed to load conversation. Please try again.');
      }
      
      setLoading(false);
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !conversation || !conversation._id) return;
    
    try {
      setLoading(true);
      
      // Send the message
      const response = await sendMessage(conversation._id, newMessage);
      
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response from server");
      }
      
      // Add the new message to our messages array
      setMessages(prevMessages => [...prevMessages, response.data.data]);
      setNewMessage('');
      
      // Also refresh unread message count for the user
      refreshUnreadCount();
      
      setLoading(false);
    } catch (err) {
      console.error('Error sending message:', err);
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setError(null); // Clear any errors when toggling
  };
  // Get other participant's info
  const getOtherParticipant = () => {
    if (!conversation) return null;
    
    // Make sure we're comparing strings to strings
    const currentUserId = currentUser?._id || currentUser?.id;
    const buyerId = conversation.buyer?._id ? conversation.buyer._id.toString() : 
                   typeof conversation.buyer === 'string' ? conversation.buyer : 
                   conversation.buyer?.id || '';
                   
    const ownerId = conversation.owner?._id ? conversation.owner._id.toString() : 
                   typeof conversation.owner === 'string' ? conversation.owner : 
                   conversation.owner?.id || '';
    
    if (currentUserId === buyerId) {
      return conversation.owner;
    } else {
      return conversation.buyer;
    }
  };
  
  const otherParticipant = getOtherParticipant();  // Function to check if the current user is the owner
  const isUserOwner = () => {
    if (!currentUser || !ownerId) return false;
    const userId = currentUser.id || currentUser._id;
    return userId === ownerId;
  };

  return (
    <div className="chat-container">
      {/* Chat Button */}
      <button 
        className="chat-button"
        onClick={toggleChat}
        disabled={!currentUser || isUserOwner()}
        title={!currentUser ? "Please log in to chat" : 
               isUserOwner() ? "You own this computer" : 
               "Chat with owner"}
      >
        <i className="chat-icon">💬</i>
        <span>Chat with Owner</span>
      </button>
      
      {/* Chat Popup */}
      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>{computerTitle}</h3>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>
          
          <div className="chat-content" ref={chatContentRef}>
            {loading && !conversation ? (
              <div className="chat-loading">
                <LoadingSpinner />
                <p>Loading conversation...</p>
              </div>
            ) : error ? (
              <div className="chat-error">{error}</div>
            ) : messages.length === 0 ? (
              <div className="chat-welcome">
                <p>Start a conversation with the owner about this computer.</p>
              </div>
            ) : (
              <>
                <div className="messages-container">
                  {messages.map((message) => (
                    <div 
                      key={message._id}
                      className={`message ${message.sender._id === currentUser.id ? 'sent' : 'received'}`}
                    >
                      {message.sender._id !== currentUser.id && (
                        <div className="message-avatar">
                          {message.sender.profilePicture ? (
                            <img src={message.sender.profilePicture} alt={message.sender.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {message.sender.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="message-bubble">
                        <div className="message-content">{message.content}</div>
                        <div className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </>
            )}
          </div>
          
          <form className="chat-input-container" onSubmit={handleSendMessage}>
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              disabled={loading || !conversation}
            />
            <button 
              type="submit"
              disabled={loading || !newMessage.trim() || !conversation}
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
