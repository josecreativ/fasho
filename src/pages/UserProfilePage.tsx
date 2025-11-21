import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../store/CurrencyContext';

const menu = [
  { id: 'dashboard', label: 'Dashboard', icon: '⏲️' },
  { id: 'orders', label: 'My orders', icon: '📦' },
  { id: 'info', label: 'My Info', icon: '📝' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'notify-list', label: 'Notify Me List', icon: '⭐' },
  { id: 'gift-cards', label: 'Gift Cards', icon: '🎁' },
  { id: 'help', label: 'Help Center', icon: '📞' },
];

interface Order {
  id: number;
  createdAt: string;
  email: string;
  items: any[];
  subtotal: number;
  paymentMethod: string;
}

interface NotifyItem {
  id: string;
  productName: string;
  addedAt: string;
}

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifyList, setNotifyList] = useState<NotifyItem[]>([]);
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: 'Nigeria'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (user) {
      setUserInfo(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || 'Nigeria'
      }));
      
      // Load user's orders
      fetchUserOrders();
      
      // Load notifications and notify list from localStorage
      const savedNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
      const savedNotifyList = JSON.parse(localStorage.getItem('userNotifyList') || '[]');
      setNotifications(savedNotifications);
      setNotifyList(savedNotifyList);
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const allOrders = await response.json();
        // Filter orders for current user
        const userOrders = allOrders.filter((order: Order) => order.email === user?.email);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const saveUserInfo = () => {
    const updatedUser = { ...user, ...userInfo };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    // Add success notification
    const newNotification = {
      id: Date.now(),
      message: 'Profile updated successfully!',
      type: 'success',
      timestamp: new Date().toISOString()
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
  };

  const removeFromNotifyList = (id: string) => {
    const updatedList = notifyList.filter(item => item.id !== id);
    setNotifyList(updatedList);
    localStorage.setItem('userNotifyList', JSON.stringify(updatedList));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.setItem('userNotifications', JSON.stringify([]));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center max-w-md mx-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to access your profile.</p>
          <button 
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors" 
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{orders.length}</p>
              <p className="text-gray-600 text-sm sm:text-base">Total Orders</p>
            </div>
            <span className="text-2xl sm:text-3xl">📦</span>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{notifications.length}</p>
              <p className="text-gray-600 text-sm sm:text-base">Notifications</p>
            </div>
            <span className="text-2xl sm:text-3xl">🔔</span>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{notifyList.length}</p>
              <p className="text-gray-600 text-sm sm:text-base">Wishlist Items</p>
            </div>
            <span className="text-2xl sm:text-3xl">⭐</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h3 className="text-lg sm:text-xl font-bold mb-4">Recent Activity</h3>
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm sm:text-base">Order #{order.id}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-sm sm:text-base">{formatPrice(order.subtotal)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm sm:text-base">No recent orders</p>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">My Orders</h2>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Order #{order.id}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">{item.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity} • {item.color}</p>
                    </div>
                    <p className="font-bold text-sm sm:text-base">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="font-bold text-base sm:text-lg">Total: {formatPrice(order.subtotal)}</span>
                <button className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-gray-800 transition-colors">
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
          <span className="text-4xl sm:text-6xl mb-4 block">📦</span>
          <h3 className="text-lg sm:text-xl font-bold mb-2">No Orders Yet</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Start shopping to see your orders here!</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );

  const renderUserInfo = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">My Information</h2>
        <button
          onClick={() => isEditing ? saveUserInfo() : setIsEditing(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={userInfo.username}
              onChange={(e) => setUserInfo(prev => ({ ...prev, username: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 sm:p-3 border rounded-lg disabled:bg-gray-100 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 sm:p-3 border rounded-lg disabled:bg-gray-100 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={userInfo.firstName}
              onChange={(e) => setUserInfo(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 sm:p-3 border rounded-lg disabled:bg-gray-100 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={userInfo.lastName}
              onChange={(e) => setUserInfo(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 sm:p-3 border rounded-lg disabled:bg-gray-100 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={userInfo.phone}
              onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 sm:p-3 border rounded-lg disabled:bg-gray-100 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={userInfo.country}
              onChange={(e) => setUserInfo(prev => ({ ...prev, country: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 sm:p-3 border rounded-lg disabled:bg-gray-100 text-sm sm:text-base"
            >
              <option value="Nigeria">Nigeria</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={userInfo.address}
              onChange={(e) => setUserInfo(prev => ({ ...prev, address: e.target.value }))}
              disabled={!isEditing}
              rows={3}
              className="w-full p-2 sm:p-3 border rounded-lg disabled:bg-gray-100 text-sm sm:text-base"
            />
          </div>
        </div>
        {isEditing && (
          <div className="mt-4 sm:mt-6 flex gap-2">
            <button
              onClick={saveUserInfo}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Clear All
          </button>
        )}
      </div>
      
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div key={notification.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm sm:text-base">{notification.message}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  notification.type === 'success' ? 'bg-green-100 text-green-800' :
                  notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {notification.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
          <span className="text-4xl sm:text-6xl mb-4 block">🔔</span>
          <h3 className="text-lg sm:text-xl font-bold mb-2">No Notifications</h3>
          <p className="text-gray-600 text-sm sm:text-base">You're all caught up!</p>
        </div>
      )}
    </div>
  );

  const renderNotifyList = () => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Notify Me List</h2>
      
      {notifyList.length > 0 ? (
        <div className="space-y-3">
          {notifyList.map(item => (
            <div key={item.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm sm:text-base">{item.productName}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Added: {new Date(item.addedAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => removeFromNotifyList(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm sm:text-base"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
          <span className="text-4xl sm:text-6xl mb-4 block">⭐</span>
          <h3 className="text-lg sm:text-xl font-bold mb-2">No Items in Notify List</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Add items to get notified when they're back in stock!</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Browse Products
          </button>
        </div>
      )}
    </div>
  );

  const renderGiftCards = () => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Gift Cards</h2>
      
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
        <span className="text-4xl sm:text-6xl mb-4 block">🎁</span>
        <h3 className="text-lg sm:text-xl font-bold mb-2">Gift Cards Coming Soon</h3>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">We're working on bringing you amazing gift card options!</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="font-medium text-sm sm:text-base">Digital Gift Cards</p>
            <p className="text-xs sm:text-sm text-gray-600">Send instantly via email</p>
          </div>
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="font-medium text-sm sm:text-base">Physical Gift Cards</p>
            <p className="text-xs sm:text-sm text-gray-600">Beautiful printed cards</p>
          </div>
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="font-medium text-sm sm:text-base">Custom Amounts</p>
            <p className="text-xs sm:text-sm text-gray-600">Choose any value</p>
          </div>
        </div>
      </div>
    </div>
  );

  const openLiveChat = () => {
    console.log('🚀 Opening live chat...');
    
    // First, check the current status
    if ((window as any).checkLiveChat) {
      (window as any).checkLiveChat();
    }
    
    let chatOpened = false;
    
    // Try Smartsupp first (most likely to be configured)
    if ((window as any).smartsupp && typeof (window as any).smartsupp === 'function') {
      console.log('✅ Found Smartsupp function, opening chat');
      try {
        (window as any).smartsupp('chat:open');
        chatOpened = true;
        console.log('✅ Smartsupp chat opened successfully');
      } catch (error) {
        console.error('❌ Error opening Smartsupp:', error);
      }
    }
    // Try alternative Smartsupp methods
    else if ((window as any)._smartsupp) {
      console.log('🔍 Found Smartsupp config, looking for widget...');
      
      // Wait a bit for the widget to load
      setTimeout(() => {
        if ((window as any).smartsupp && typeof (window as any).smartsupp === 'function') {
          console.log('✅ Smartsupp function now available, opening chat');
          (window as any).smartsupp('chat:open');
          chatOpened = true;
        } else {
          // Try to find and click the Smartsupp widget
          const smartsuppSelectors = [
            '#smartsupp-widget-container',
            '[id*="smartsupp"]',
            '.smartsupp-widget',
            '[data-smartsupp]',
            'iframe[src*="smartsupp"]'
          ];
          
          for (const selector of smartsuppSelectors) {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
              console.log(`✅ Found Smartsupp element: ${selector}, clicking...`);
              element.click();
              chatOpened = true;
              break;
            }
          }
        }
      }, 1000);
    }
    // Try other chat providers
    else if ((window as any).Tawk_API && typeof (window as any).Tawk_API.maximize === 'function') {
      console.log('✅ Opening Tawk.to chat');
      (window as any).Tawk_API.maximize();
      chatOpened = true;
    }
    else if ((window as any).Intercom && typeof (window as any).Intercom === 'function') {
      console.log('✅ Opening Intercom chat');
      (window as any).Intercom('show');
      chatOpened = true;
    }
    else if ((window as any).$crisp && Array.isArray((window as any).$crisp)) {
      console.log('✅ Opening Crisp chat');
      (window as any).$crisp.push(['do', 'chat:open']);
      chatOpened = true;
    }
    
    // If no immediate success, wait and try again
    if (!chatOpened) {
      console.log('⏳ No chat widget found immediately, waiting 3 seconds...');
      
      setTimeout(() => {
        console.log('🔄 Retrying chat widget detection...');
        
        // Check all possible chat widgets again
        if ((window as any).smartsupp && typeof (window as any).smartsupp === 'function') {
          console.log('✅ Smartsupp now available, opening...');
          (window as any).smartsupp('chat:open');
        } else if ((window as any).Tawk_API) {
          (window as any).Tawk_API.maximize();
        } else if ((window as any).Intercom) {
          (window as any).Intercom('show');
        } else if ((window as any).$crisp) {
          (window as any).$crisp.push(['do', 'chat:open']);
        } else {
          // Last resort: look for any chat-related elements
          const allChatSelectors = [
            '#smartsupp-widget-container',
            '[id*="smartsupp"]',
            '.smartsupp-widget',
            '[data-smartsupp]',
            '#tawk-widget',
            '.crisp-client',
            '[id*="intercom"]',
            '.intercom-launcher',
            '[class*="chat-widget"]',
            '[id*="chat-widget"]',
            'iframe[src*="chat"]'
          ];
          
          let found = false;
          for (const selector of allChatSelectors) {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
              console.log(`✅ Found chat element: ${selector}, attempting to interact...`);
              if (element.click) {
                element.click();
                found = true;
                break;
              }
            }
          }
          
          if (!found) {
            console.log('❌ No chat widget found after retry');
            alert('Live chat is still loading or not configured. Please try again in a moment or contact us at:\n\n📧 support@allurefashion.com\n📞 +234 123 456 7890');
          }
        }
      }, 3000);
    }
  };

  const renderHelpCenter = () => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Help Center</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-base sm:text-lg mb-3">📞 Contact Support</h3>
          <div className="space-y-2 text-sm sm:text-base">
            <p><strong>Email:</strong> support@allurefashion.com</p>
            <p><strong>Phone:</strong> +234 123 456 7890</p>
            <p><strong>Hours:</strong> Mon-Fri 9AM-6PM</p>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-base sm:text-lg mb-3">❓ FAQ</h3>
          <div className="space-y-2 text-sm sm:text-base">
            <p><strong>Shipping:</strong> 3-5 business days</p>
            <p><strong>Returns:</strong> 30-day return policy</p>
            <p><strong>Exchanges:</strong> Free size exchanges</p>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-base sm:text-lg mb-3">📋 Order Issues</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm sm:text-base">Track my order</button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm sm:text-base">Cancel order</button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm sm:text-base">Return item</button>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-base sm:text-lg mb-3">💬 Live Chat</h3>
          <p className="text-gray-600 mb-3 text-sm sm:text-base">Get instant help from our support team</p>
          <button 
            onClick={openLiveChat}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'orders': return renderOrders();
      case 'info': return renderUserInfo();
      case 'notifications': return renderNotifications();
      case 'notify-list': return renderNotifyList();
      case 'gift-cards': return renderGiftCards();
      case 'help': return renderHelpCenter();
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 sm:p-6 h-full flex flex-col">
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden self-end mb-4 text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
          
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">Menu</h2>
            <ul className="space-y-2">
              {menu.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id 
                        ? 'bg-black text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm sm:text-base">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            className="mt-auto flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
            onClick={() => { 
              localStorage.removeItem('user'); 
              navigate('/'); 
            }}
          >
            <span className="text-lg">↩️</span>
            <span className="text-sm sm:text-base font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              className="mb-4 flex items-center gap-2 text-gray-700 hover:text-purple-700 font-semibold transition-colors"
              onClick={() => navigate('/')}
            >
              <span className="text-lg">🏠</span>
              <span className="text-sm sm:text-base">Home</span>
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2">
              HI, {user.username?.toUpperCase() || 'USER'}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Welcome to your dashboard</p>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage; 