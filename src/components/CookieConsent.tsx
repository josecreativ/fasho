import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieConsent');
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };
  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setVisible(false);
  };
  const handleMore = () => {
    alert('More choices coming soon!');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full text-center">
        <p className="mb-6 text-gray-800 text-base">
          We use first-party and third-party cookies to understand how our online store is used and to be able to improve it, adapt the content to your preferences and personalize our advertising, marketing and social media posts. You can accept all of them, reject them or choose your configuration by clicking the corresponding buttons. Keep in mind that rejecting cookies may affect your shopping experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <button onClick={handleAccept} className="bg-black text-white rounded-full px-8 py-3 font-semibold text-base hover:bg-gray-900">Accept all</button>
          <button onClick={handleReject} className="bg-black text-white rounded-full px-8 py-3 font-semibold text-base hover:bg-gray-900">Reject all</button>
          <button onClick={handleMore} className="bg-black text-white rounded-full px-8 py-3 font-semibold text-base hover:bg-gray-900">More choices</button>
        </div>
        <a href="#" className="text-blue-600 text-sm hover:underline">For further details about our privacy practices, please review our Privacy Policy.</a>
      </div>
    </div>
  );
};

export default CookieConsent; 