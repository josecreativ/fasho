import React from 'react';

const Footer = () => (
  <footer className="bg-black text-white pt-10 pb-4 px-4 mt-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-10 border-b border-gray-800 pb-8">
      {/* App Download */}
      <div>
        <h3 className="font-bold mb-4 text-sm">SHOP FASTER WITH THE APP</h3>
        <div className="flex gap-3">
          <a href="#" aria-label="Download on the App Store">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" alt="App Store" className="h-12 bg-white rounded" />
          </a>
          <a href="#" aria-label="Get it on Google Play">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-12 bg-white rounded" />
          </a>
        </div>
      </div>
      {/* Get Help */}
      <div>
        <h3 className="font-bold mb-4 text-sm">Get Help</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li><a href="#" className="hover:underline">Help Center</a></li>
          <li><a href="#" className="hover:underline">Track Order</a></li>
          <li><a href="#" className="hover:underline">Shipping Info</a></li>
          <li><a href="#" className="hover:underline">Returns</a></li>
          <li><a href="#" className="hover:underline">Contact Us</a></li>
        </ul>
      </div>
      {/* Company */}
      <div>
        <h3 className="font-bold mb-4 text-sm">Company</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li><a href="#" className="hover:underline">Careers</a></li>
          <li><a href="#" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Stores</a></li>
          <li><a href="#" className="hover:underline">Want to Collab?</a></li>
        </ul>
      </div>
      {/* Quick Links */}
      <div>
        <h3 className="font-bold mb-4 text-sm">Quick Links</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li><a href="#" className="hover:underline">Size Guide</a></li>
          <li><a href="#" className="hover:underline">Sitemap</a></li>
          <li><a href="#" className="hover:underline">Gift Cards</a></li>
          <li><a href="#" className="hover:underline">Check Gift Card Balance</a></li>
        </ul>
      </div>
      {/* Email Signup */}
      <div className="md:w-96">
        <h3 className="font-bold mb-4 text-sm">SIGN UP FOR DISCOUNTS + UPDATES</h3>
        <form className="flex bg-white rounded-full overflow-hidden mb-2">
          <input
            type="email"
            placeholder="Email Address"
            className="flex-1 px-4 py-3 text-black outline-none"
          />
          <button type="submit" className="bg-gray-200 text-black px-4 flex items-center justify-center">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </form>
        <p className="text-xs text-gray-400">
          By signing up for email, you agree to ALLURE FASHION's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
    {/* Social Icons */}
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center mt-6 gap-4">
      <div className="flex items-center gap-4 text-2xl text-gray-300">
        <a href="#" aria-label="Instagram">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.782 2.295 7.148 2.233 8.414 2.175 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.388 3.678 1.37 2.697 2.351 2.437 3.463 2.379 4.744 2.321 6.024 2.309 6.433 2.309 12c0 5.567.012 5.976.07 7.256.058 1.281.318 2.393 1.299 3.374.981.981 2.093 1.241 3.374 1.299 1.28.058 1.689.07 7.256.07s5.976-.012 7.256-.07c1.281-.058 2.393-.318 3.374-1.299.981-.981 1.241-2.093 1.299-3.374.058-1.28.07-1.689.07-7.256s-.012-5.976-.07-7.256c-.058-1.281-.318-2.393-1.299-3.374C21.393.388 20.281.128 19 .07 17.719.012 17.309 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
        </a>
        <a href="#" aria-label="TikTok">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12.75 2v14.25a2.25 2.25 0 1 1-2.25-2.25h.75V12h-.75a4.5 4.5 0 1 0 4.5 4.5V7.5h2.25A6.75 6.75 0 0 0 12.75 2z"/></svg>
        </a>
        <a href="#" aria-label="YouTube">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.072 0 12 0 12s0 3.928.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.5 20.5 12 20.5 12 20.5s7.5 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.928 24 12 24 12s0-3.928-.502-5.814zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
        </a>
        <a href="#" aria-label="Snapchat">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18.5c-4.694 0-8.5-3.806-8.5-8.5s3.806-8.5 8.5-8.5 8.5 3.806 8.5 8.5-3.806 8.5-8.5 8.5zm0-15a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0-10a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/></svg>
        </a>
        <a href="#" aria-label="Facebook">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.674V1.326C24 .592 23.405 0 22.675 0z"/></svg>
        </a>
        <a href="#" aria-label="Pinterest">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.387 7.634 11.093-.105-.944-.2-2.395.042-3.428.219-.963 1.41-6.142 1.41-6.142s-.36-.72-.36-1.782c0-1.67.968-2.918 2.172-2.918 1.025 0 1.52.77 1.52 1.693 0 1.032-.657 2.574-.995 4.01-.283 1.2.6 2.178 1.78 2.178 2.136 0 3.776-2.25 3.776-5.493 0-2.872-2.065-4.885-5.017-4.885-3.42 0-5.428 2.563-5.428 5.217 0 1.032.397 2.142.892 2.743.099.12.113.225.083.345-.09.36-.292 1.2-.332 1.367-.05.21-.16.255-.372.154-1.39-.646-2.257-2.67-2.257-4.3 0-3.5 2.548-6.72 7.348-6.72 3.857 0 6.857 2.75 6.857 6.417 0 3.83-2.41 6.917-5.76 6.917-1.152 0-2.236-.6-2.604-1.29l-.708 2.7c-.21.81-.78 1.82-1.164 2.44C9.6 23.82 10.8 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
        </a>
      </div>
    </div>
    {/* Bottom Links */}
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center mt-6 text-xs text-gray-400 gap-2">
      <div className="mb-2 md:mb-0">© {new Date().getFullYear()} ALLURE FASHION, LLC All Rights Reserved</div>
      <div className="flex flex-wrap gap-4">
        <a href="#" className="hover:underline">Promo T&Cs</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">CA Supply Chains Act</a>
        <a href="#" className="hover:underline">Your privacy choices</a>
      </div>
    </div>
  </footer>
);

export default Footer; 