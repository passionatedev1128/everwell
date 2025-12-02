import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { markAllNotificationsAsRead, deleteNotification } from '../utils/api';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [notificationsCleared, setNotificationsCleared] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const checkHoverIntervalRef = useRef(null);
  const navigate = useNavigate();
  
  // Function to check if mouse is actually over notification area
  const checkIsHovering = () => {
    if (!isOpen) return false;
    
    const clearButton = document.querySelector('button[title="Limpar todas"]');
    const isOverMenu = menuRef.current?.matches(':hover');
    const isOverDropdown = dropdownRef.current?.matches(':hover');
    const isOverClearButton = clearButton?.matches(':hover');
    
    return isOverMenu || isOverDropdown || isOverClearButton;
  };

  // Function to prevent closing - checks actual DOM state
  const shouldPreventClosing = () => {
    return checkIsHovering() || isHovering;
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds, but only if not cleared
    const interval = setInterval(() => {
      if (!notificationsCleared) {
        fetchNotifications();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [notificationsCleared]);

  // Continuously check hover state when dropdown is open - PREVENT BLINKING
  useEffect(() => {
    if (isOpen) {
      // Check hover state every 30ms to prevent blinking - more frequent
      checkHoverIntervalRef.current = setInterval(() => {
        const actuallyHovering = checkIsHovering();
        if (actuallyHovering) {
          // Always keep hover true and prevent closing
          setIsHovering(true);
          // Cancel any pending close immediately - CRITICAL
          if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
          }
          // Immediately stop closing animation if it's happening - CRITICAL
          if (isClosing) {
            setIsClosing(false);
          }
        }
      }, 30); // More frequent checks
      
      return () => {
        if (checkHoverIntervalRef.current) {
          clearInterval(checkHoverIntervalRef.current);
        }
      };
    }
  }, [isOpen, isHovering, isClosing]);

  // CRITICAL: Watch isClosing state and immediately reset if hovering
  useEffect(() => {
    if (isClosing && shouldPreventClosing()) {
      // Immediately stop closing if we detect hovering
      setIsClosing(false);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    }
  }, [isClosing, isHovering, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on Clear All button or any part of dropdown/menu - if so, don't close
      const clearButton = event.target.closest('button[title="Limpar todas"]') || 
                         event.target.closest('.clear-all-button');
      const isInDropdown = dropdownRef.current?.contains(event.target);
      const isInMenu = menuRef.current?.contains(event.target);
      
      if (clearButton || isInDropdown || isInMenu) {
        return;
      }
      
      // If clicking outside and dropdown is open, close it
      if (
        isOpen &&
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        // Close immediately when clicking outside (not hovering)
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
        setIsClosing(true);
        setIsHovering(false);
        closeTimeoutRef.current = setTimeout(() => {
          setIsOpen(false);
          setIsClosing(false);
          closeTimeoutRef.current = null;
        }, 300);
      }
    };
    
    if (isOpen) {
      // Add listener immediately for click outside
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
      };
    }
  }, [isOpen]);

  // Get deleted notification IDs from localStorage
  const getDeletedNotificationIds = () => {
    try {
      const deleted = localStorage.getItem('deletedNotifications');
      return deleted ? JSON.parse(deleted) : [];
    } catch (error) {
      return [];
    }
  };

  // Save deleted notification ID to localStorage
  const saveDeletedNotificationId = (notificationId) => {
    try {
      const deleted = getDeletedNotificationIds();
      if (!deleted.includes(notificationId)) {
        deleted.push(notificationId);
        localStorage.setItem('deletedNotifications', JSON.stringify(deleted));
      }
    } catch (error) {
      console.error('Error saving deleted notification ID:', error);
    }
  };

  const fetchNotifications = async () => {
    // Don't fetch if notifications were cleared
    if (notificationsCleared) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      if (response.data.success) {
        // Filter out any notifications that might have been deleted (defensive check)
        // Since backend deletes them, they shouldn't appear, but we filter just in case
        const allNotifications = response.data.notifications || [];
        // Only show notifications that exist (not null/undefined) - deleted ones won't be in response
        const validNotifications = allNotifications.filter(n => n && n._id);
        
        // Filter out notifications that were deleted by user (stored in localStorage)
        const deletedIds = getDeletedNotificationIds();
        const filteredNotifications = validNotifications.filter(n => !deletedIds.includes(n._id));
        
        setNotifications(filteredNotifications);
        const unread = filteredNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      // Silently fail if backend is not available
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.error('Error fetching notifications:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await api.patch(`/notifications/${notification._id}/read`);
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      await deleteNotification(notificationId);
      // Remove from state
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
      // Save to localStorage to persist across refreshes
      saveDeletedNotificationId(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Even if API call fails, remove from UI and save to localStorage
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
      saveDeletedNotificationId(notificationId);
    }
  };

  const getTypeIcon = (type) => {
    const iconClass = "w-4 h-4 flex-shrink-0";
    switch (type) {
      case 'success':
        return (
          <svg className={`${iconClass} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`${iconClass} text-yellow-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'error':
        return (
          <svg className={`${iconClass} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className={`${iconClass} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleOpen = () => {
    if (isOpen) {
      // Only close if not hovering
      if (!isHovering) {
        setIsClosing(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsClosing(false);
        }, 300);
      }
    } else {
      setIsOpen(true);
      setIsHovering(false); // Reset hover state when opening
      if (unreadCount > 0) {
        // Mark all as read when opening
        notifications.filter(n => !n.read).forEach(async (notification) => {
          try {
            await api.patch(`/notifications/${notification._id}/read`);
          } catch (error) {
            console.error('Error marking notification as read:', error);
          }
        });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    }
  };

  const handleClearAll = async () => {
    try {
      // Delete all notifications individually
      const deletePromises = notifications.map(notification => 
        deleteNotification(notification._id).catch(error => {
          // If deletion fails, still save to localStorage to hide it
          console.error(`Error deleting notification ${notification._id}:`, error);
          return null;
        })
      );
      
      await Promise.all(deletePromises);
      
      // Save all deleted notification IDs to localStorage to persist across refreshes
      notifications.forEach(notification => {
        saveDeletedNotificationId(notification._id);
      });
      
      // Clear all notifications from the dropdown
      setNotifications([]);
      setUnreadCount(0);
      // Mark as cleared to prevent refetching
      setNotificationsCleared(true);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      // Even if there's an error, save IDs to localStorage and clear UI
      notifications.forEach(notification => {
        saveDeletedNotificationId(notification._id);
      });
      setNotifications([]);
      setUnreadCount(0);
      setNotificationsCleared(true);
    }
  };

  return (
    <div 
      className="relative" 
      ref={menuRef}
      onMouseEnter={() => {
        setIsHovering(true);
        // Cancel any pending timeouts
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        if (isClosing) {
          setIsClosing(false);
        }
      }}
      onMouseLeave={(e) => {
        // Check if mouse moved to dropdown or clear button
        const relatedTarget = e.relatedTarget;
        const clearButton = document.querySelector('button[title="Limpar todas"]');
        const movedToDropdown = relatedTarget && dropdownRef.current?.contains(relatedTarget);
        const movedToClearButton = relatedTarget && (
          relatedTarget === clearButton ||
          clearButton?.contains(relatedTarget) ||
          relatedTarget.closest?.('button[title="Limpar todas"]')
        );
        
        if (movedToDropdown || movedToClearButton) {
          // Mouse moved within notification area, keep hover true
          setIsHovering(true);
          return;
        }
        
        // Use longer delay to prevent blinking
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
          // Final check before clearing hover
          if (!checkIsHovering()) {
            setIsHovering(false);
          }
          hoverTimeoutRef.current = null;
        }, 500);
      }}
    >
      <button
        onClick={handleOpen}
        className="notification-bell-btn relative p-2 rounded-full hover:bg-primary/10 transition-colors"
        title="Notificações"
        style={{
          transform: 'none',
          transition: 'background-color 0.2s ease-in-out'
        }}
      >
        <svg className="w-6 h-6 text-[rgb(79,179,168)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-bell-badge absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setIsHovering(true);
            // Cancel any pending close or hover timeout
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
            if (isClosing) {
              setIsClosing(false);
            }
          }}
          onMouseOver={(e) => {
            // Keep hover active on any mouse movement within dropdown
            setIsHovering(true);
            // Immediately cancel any timeouts
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
            // Immediately stop closing animation if it's happening
            if (isClosing) {
              setIsClosing(false);
            }
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            // Check if mouse is moving to Clear All button or menu
            const relatedTarget = e.relatedTarget;
            const clearButton = document.querySelector('button[title="Limpar todas"]');
            const isMovingToClearButton = relatedTarget && (
              relatedTarget === clearButton ||
              clearButton?.contains(relatedTarget) ||
              relatedTarget.closest?.('button[title="Limpar todas"]') ||
              relatedTarget.closest?.('.clear-all-button') ||
              relatedTarget.matches?.('button[title="Limpar todas"]') ||
              relatedTarget.matches?.('.clear-all-button')
            );
            const isMovingToMenu = relatedTarget && menuRef.current?.contains(relatedTarget);
            
            // If moving within notification area, keep hover true and prevent any closing
            if (isMovingToClearButton || isMovingToMenu) {
              setIsHovering(true);
              if (isClosing) {
                setIsClosing(false);
              }
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
              return;
            }
            
            // Only proceed if truly leaving the notification area
            // Clear any existing hover timeout
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
            // Use a longer delay before setting isHovering to false
            hoverTimeoutRef.current = setTimeout(() => {
              // Final check - make sure mouse is still outside
              if (!checkIsHovering()) {
                setIsHovering(false);
              } else {
                // Mouse is still in notification area, keep hover true
                setIsHovering(true);
              }
              hoverTimeoutRef.current = null;
            }, 600);
          }}
          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-primary/20 py-2 z-50 backdrop-blur-sm"
          style={{
            animation: isClosing && !shouldPreventClosing() ? 'none' : 'slideDownFadeIn 0.3s ease-out',
            pointerEvents: 'auto',
            opacity: (isClosing && !shouldPreventClosing()) ? 0 : 1,
            transform: (isClosing && !shouldPreventClosing()) ? 'scale(0.95) translateY(8px)' : 'scale(1) translateY(0)',
            transition: shouldPreventClosing() ? 'none' : 'all 0.3s ease-out'
          }}>
          <div className="absolute top-0 right-4 -mt-2 w-4 h-4 bg-white border-l border-t border-primary/20 transform rotate-45"></div>
          <div 
            className="px-4 py-3 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent relative"
            onMouseEnter={() => {
              setIsHovering(true);
              if (isClosing) {
                setIsClosing(false);
              }
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
            }}
            onMouseOver={() => {
              setIsHovering(true);
              if (isClosing) {
                setIsClosing(false);
              }
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-darkTeal">Notificações</p>
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleClearAll();
                  }}
                  className="p-1.5 text-xs font-medium text-mediumTeal hover:text-darkTeal hover:bg-primary/10 rounded-md transition-colors flex-shrink-0"
                  title="Limpar todas"
                  aria-label="Limpar todas as notificações"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-mediumTeal">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-mediumTeal">
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div key={notification._id}>
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 transition-colors cursor-pointer relative ${
                      !notification.read 
                        ? 'bg-primary/15 hover:bg-primary/25 border-l-4 border-l-primary' 
                        : 'hover:bg-primary/10'
                    } ${index < notifications.length - 1 ? 'border-b border-primary/10' : ''}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        {!notification.read && (
                          <span className="mt-1.5 w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                        )}
                        <div className="flex items-center gap-2 flex-1">
                          {getTypeIcon(notification.type || 'info')}
                          <p className={`text-sm font-semibold ${!notification.read ? 'text-primary' : 'text-darkTeal'}`}>
                            {notification.title || 'Notificação'}
                          </p>
                        </div>
                        <div className="absolute top-3 right-4 flex items-center gap-2">
                          <button
                            onClick={(e) => handleDeleteNotification(notification._id, e)}
                            className="p-1 text-mediumTeal/70 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Deletar notificação"
                            aria-label="Deletar notificação"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <p className="text-xs text-mediumTeal/70">
                            {new Date(notification.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-xs text-mediumTeal leading-relaxed pr-16">
                          {notification.message || notification.content || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-4 py-3 border-t border-primary/10 space-y-2">
            <button
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsClosing(false);
                  navigate('/dashboard', { state: { tab: 'messages' } });
                }, 300);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Ir para caixa de mensagens
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

