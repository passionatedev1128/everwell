import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        const unread = (response.data.notifications || []).filter(n => !n.read).length;
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

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
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
  };

  return (
    <div className="relative" ref={menuRef}>
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
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-primary/20 py-2 z-50 backdrop-blur-sm animate-scale-in">
          <div className="absolute top-0 right-4 -mt-2 w-4 h-4 bg-white border-l border-t border-primary/20 transform rotate-45"></div>
          <div className="px-4 py-3 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
            <p className="text-sm font-semibold text-darkTeal">Notificações</p>
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
                    className={`px-4 py-3 transition-colors cursor-pointer ${
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
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${!notification.read ? 'text-primary' : 'text-darkTeal'}`}>
                            {notification.title || 'Notificação'}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-xs font-medium text-mediumTeal">
                          Tipo: <span className="text-darkTeal">{notification.type || 'info'}</span>
                        </p>
                        <p className="text-xs text-mediumTeal leading-relaxed">
                          {notification.message || notification.content || ''}
                        </p>
                        <p className="text-xs text-mediumTeal/70 pt-1">
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
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

