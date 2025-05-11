import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserConversations, getConversation, sendMessage, markMessagesAsRead } from '../../services/api';
import { useNotifications } from '../../context/NotificationsContext';
import LoadingSpinner from '../LoadingSpinner';
import './styles.css';

const ConversationsManagement = ({ currentUser }) => {
  const navigate = useNavigate();
  const { refreshUnreadCount } = useNotifications();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch conversation details when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchConversationDetails(activeConversation._id);
    }
  }, [activeConversation]);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      const messagesContainer = document.querySelector('.conversation-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await getUserConversations();
      setConversations(response.data.data);
      
      // If there are conversations, select the first one
      if (response.data.data.length > 0) {
        setActiveConversation(response.data.data[0]);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations. Please try again.');
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (conversationId) => {
    setLoading(true);
    try {
      const response = await getConversation(conversationId);
      setMessages(response.data.data.messages);
      
      // Mark messages as read
      await markMessagesAsRead(conversationId);
      
      // Update unread count in notification context
      refreshUnreadCount();
        // Update the conversation in the list to reflect read status
      setConversations(prev => 
        prev.map(conv => {
          if (conv._id === conversationId) {
            const currentUserId = currentUser.id || currentUser._id;
            const buyerId = conv.buyer._id || (typeof conv.buyer === 'object' ? conv.buyer.id : conv.buyer);
            
            return { 
              ...conv, 
              unreadBuyer: currentUserId === buyerId ? 0 : conv.unreadBuyer, 
              unreadOwner: currentUserId !== buyerId ? 0 : conv.unreadOwner 
            };
          }
          return conv;
        })
      );
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversation details:', err);
      setError('Failed to load messages. Please try again.');
      setLoading(false);
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation || !activeConversation._id) {
      setError('Cannot send message - conversation not properly initialized');
      return;
    }
    
    setSending(true);
    try {
      // Send the message
      const response = await sendMessage(activeConversation._id, newMessage);
      
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response from server");
      }
      
      // Add the new message to our messages array
      setMessages(prevMessages => [...prevMessages, response.data.data]);
      setNewMessage('');
      
      // Update last message in conversation list
      setConversations(prev => 
        prev.map(conv => 
          conv._id === activeConversation._id 
            ? { ...conv, lastMessage: newMessage, lastMessageDate: new Date() } 
            : conv
        )
      );
      
      // Also refresh unread message count for the user
      refreshUnreadCount();
    } catch (err) {
      console.error('Error sending message:', err);
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setSending(false);
    }
  };
  const handleConversationClick = (conversation) => {
    if (conversation && conversation._id) {
      setActiveConversation(conversation);
      setError(null); // Clear any errors when switching conversations
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation) return null;
    
    // Make sure we're comparing strings to strings
    const currentUserId = currentUser?.id || currentUser?._id;
    
    const buyerId = conversation.buyer?._id ? conversation.buyer._id.toString() : 
                   typeof conversation.buyer === 'string' ? conversation.buyer : 
                   conversation.buyer?.id || '';
                   
    if (currentUserId === buyerId) {
      return conversation.owner;
    } else {
      return conversation.buyer;
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    // If same day, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If within last 7 days, show day name
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getUnreadCount = (conversation) => {
    if (!conversation) return 0;
    
    if (currentUser.id === conversation.buyer._id) {
      return conversation.unreadBuyer || 0;
    } else {
      return conversation.unreadOwner || 0;
    }
  };

  const viewComputerDetails = (computerId) => {
    navigate(`/computers/${computerId}`);
  };

  return (
    <div className="conversations-container">
      <div className="conversations-sidebar">
        <h3>Conversations</h3>
        
        {conversations.length === 0 ? (
          <div className="no-conversations">
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="conversation-list">
            {conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const unreadCount = getUnreadCount(conversation);
              
              return (
                <div 
                  key={conversation._id} 
                  className={`conversation-item ${activeConversation?._id === conversation._id ? 'active' : ''}`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="conversation-avatar">
                    {otherParticipant?.profilePicture ? (
                      <img 
                        src={otherParticipant.profilePicture} 
                        alt={otherParticipant.name} 
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {otherParticipant?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <span className="participant-name">{otherParticipant?.name}</span>
                      <span className="conversation-time">{formatTimestamp(conversation.lastMessageDate || conversation.createdAt)}</span>
                    </div>
                    <div className="conversation-preview">
                      <p className="preview-text">{conversation.lastMessage || 'Start a conversation'}</p>
                      {unreadCount > 0 && (
                        <span className="unread-count">{unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="conversation-main">
        {activeConversation ? (
          <>
            <div className="conversation-header">
              <div className="conversation-title">
                <h3>
                  {getOtherParticipant(activeConversation)?.name}
                </h3>
                <p className="computer-title" onClick={() => viewComputerDetails(activeConversation.computer._id)}>
                  Re: {activeConversation.computer.title}
                </p>
              </div>
            </div>
            
            <div className="conversation-messages">
              {loading ? (
                <div className="loading-container">
                  <LoadingSpinner />
                </div>
              ) : messages.length === 0 ? (
                <div className="no-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
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
                ))
              )}
            </div>
              {error && (
              <div className="message-error">
                <p>{error}</p>
                <button className="error-dismiss" onClick={() => setError(null)}>✕</button>
              </div>
            )}
            
            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                disabled={sending}
              />
              <button 
                type="submit"
                disabled={sending || !newMessage.trim()}
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div className="no-active-conversation">
            {conversations.length === 0 ? (
              <div className="empty-state">
                <h3>No Conversations Yet</h3>
                <p>When you start chatting with computer owners or renters, your conversations will appear here.</p>
                <button className="primary-btn" onClick={() => navigate('/')}>Browse Computers</button>
              </div>
            ) : (
              <p>Select a conversation to view messages</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsManagement;
