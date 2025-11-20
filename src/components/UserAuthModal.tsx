import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const passwordRequirements = [
  { label: '8 characters', test: (pw: string) => pw.length >= 8 },
  { label: '1 uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: '1 lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { label: '1 number', test: (pw: string) => /[0-9]/.test(pw) },
];

const UserAuthModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [step, setStep] = useState<'email' | 'create'>('email');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [discount, setDiscount] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    const username = `${firstName} ${lastName}`.trim();
    if (!username || !email) {
      setError('First name, last name, and email are required.');
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email })
      });
      if (res.status === 409) {
        setError('Email already registered.');
        return;
      }
      if (!res.ok) {
        setError('Registration failed.');
        return;
      }
      const user = await res.json();
      localStorage.setItem('user', JSON.stringify(user));
      onClose();
      navigate('/profile');
    } catch (err) {
      setError('Registration failed.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold">&times;</button>
        {step === 'email' && (
          <>
            <h2 className="text-3xl font-extrabold mb-8 text-left">SIGN IN OR CREATE ACCOUNT</h2>
            <input
              type="email"
              className="w-full border rounded px-4 py-3 mb-6 text-lg"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button
              className="w-full bg-black text-white rounded-full py-4 font-semibold text-lg mb-6 hover:bg-gray-900 transition-colors"
              onClick={() => email && setStep('create')}
            >
              Continue
            </button>
            <p className="text-xs text-gray-500 text-left">
              By signing up for email, you agree to Fashion Nova's{' '}
              <a href="#" className="underline">Terms of Service</a> and{' '}
              <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </>
        )}
        {step === 'create' && (
          <>
            <h2 className="text-3xl font-extrabold mb-2 text-left">CREATE ACCOUNT</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{email}</span>
              <button className="text-xs underline" onClick={() => setStep('email')}>Use a different email</button>
            </div>
            <input
              type="text"
              className="w-full border rounded px-4 py-3 mb-4 text-lg"
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="w-full border rounded px-4 py-3 mb-4 text-lg"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            <div className="relative mb-2">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border rounded px-4 py-3 text-lg"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs underline"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="mb-4 text-xs text-gray-500">
              <div>Your password must contain at least</div>
              <ul className="mt-1 space-y-1">
                {passwordRequirements.map(req => (
                  <li key={req.label} className="flex items-center gap-2">
                    {req.test(password) ? (
                      <span className="text-green-600">&#10003;</span>
                    ) : (
                      <span className="text-red-600">&#10007;</span>
                    )}
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
            <input
              type="text"
              className="w-full border rounded px-4 py-3 mb-4 text-lg"
              placeholder="Phone Number (optional)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                id="discount"
                checked={discount}
                onChange={e => setDiscount(e.target.checked)}
                className="h-5 w-5"
              />
              <label htmlFor="discount" className="font-bold text-sm">GET EXCLUSIVE DISCOUNTS.</label>
            </div>
            {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
            <button
              className="w-full bg-black text-white rounded-full py-4 font-semibold text-lg hover:bg-gray-900 transition-colors"
              onClick={handleRegister}
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserAuthModal; 