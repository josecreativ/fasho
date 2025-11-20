import React, { useContext, useState } from 'react';
import { CartContext } from '../store/CartContext';
import { useCurrency } from '../store/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const PaymentPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { formatPrice } = useCurrency();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'flutterwave' | 'paystack' | 'bank'>('card');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const apiBase = (import.meta as any).env?.DEV ? 'http://localhost:3001' : '';
  const [paystackPublicKey, setPaystackPublicKey] = useState('');
  const [flutterwavePublicKey, setFlutterwavePublicKey] = useState('');

  // Load payment config (public keys)
  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/api/config/payment`);
        if (res.ok) {
          const data = await res.json();
          setPaystackPublicKey(data?.paystackPublicKey || '');
          setFlutterwavePublicKey(data?.flutterwavePublicKey || '');
        }
      } catch (_) {}
    };
    load();
  }, []);

  // Ensure Paystack script is available on demand
  const loadPaystackScript = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).PaystackPop) return resolve();
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.body.appendChild(script);
    });
  };

  // Ensure Flutterwave script is available on demand
  const loadFlutterwaveScript = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).FlutterwaveCheckout) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Flutterwave script'));
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    const resp = await fetch(`${apiBase}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        delivery: { country, firstName, lastName, company, address, apartment, city, state, zip, phone },
        paymentMethod,
        items: cart.map(i=>({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, color: i.color, image: i.image })),
        subtotal
      })
    });
    if (!resp.ok) {
      let serverMsg = '';
      try { const dataErr = await resp.json(); serverMsg = dataErr?.message || ''; } catch (_) { try { serverMsg = await resp.text(); } catch (_) {} }
      throw new Error(serverMsg || `Request failed (${resp.status})`);
    }
    return resp.json();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <button onClick={() => navigate('/')} style={{ fontSize: '1rem', margin: '1rem 0', background: 'none', border: 'none', cursor: 'pointer', color: '#6B21A8', fontWeight: 'bold' }}>← Home</button>
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Left: Payment Form */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {/* Express Checkout */}
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setPaymentMethod('flutterwave')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                paymentMethod === 'flutterwave' 
                  ? 'bg-[#ff7300] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-[#ff7300] hover:text-white'
              }`}
            >
              Flutterwave
            </button>
            <button 
              onClick={() => setPaymentMethod('paystack')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                paymentMethod === 'paystack' 
                  ? 'bg-[#0aa83f] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-[#0aa83f] hover:text-white'
              }`}
            >
              Paystack
            </button>
            <button 
              onClick={() => setPaymentMethod('bank')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                paymentMethod === 'bank' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-black hover:text-white'
              }`}
            >
              Bank Transfer
            </button>
          </div>
          <div className="text-center text-gray-400 mb-6">OR</div>
          {/* Account/Email */}
          <div className="mb-6">
            <label className="block text-xs font-semibold mb-1">Account</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="youremail@example.com" />
          </div>
          {/* Delivery Address */}
          <div className="mb-6">
            <h3 className="font-bold mb-2 text-sm">DELIVERY</h3>
            <select className="w-full border rounded px-3 py-2 mb-2 text-sm" value={country} onChange={e=>setCountry(e.target.value)}>
              <option>Nigeria</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
            </select>
            <div className="flex gap-2 mb-2">
              <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} className="w-1/2 border rounded px-3 py-2" placeholder="First name" />
              <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} className="w-1/2 border rounded px-3 py-2" placeholder="Last name" />
            </div>
            <input type="text" value={company} onChange={e=>setCompany(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" placeholder="Company (optional)" />
            <input type="text" value={address} onChange={e=>setAddress(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" placeholder="Address" />
            <input type="text" value={apartment} onChange={e=>setApartment(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" placeholder="Apartment, suite, etc. (optional)" />
            <div className="flex gap-2 mb-2">
              <input type="text" value={city} onChange={e=>setCity(e.target.value)} className="w-1/3 border rounded px-3 py-2" placeholder="City" />
              <input type="text" value={state} onChange={e=>setState(e.target.value)} className="w-1/3 border rounded px-3 py-2" placeholder="State" />
              <input type="text" value={zip} onChange={e=>setZip(e.target.value)} className="w-1/3 border rounded px-3 py-2" placeholder="ZIP code" />
            </div>
            <input type="text" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" placeholder="Phone" />
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id="news" className="h-4 w-4" />
              <label htmlFor="news" className="text-xs">TEXT ME WITH NEWS AND OFFERS</label>
            </div>
            <p className="text-xs text-gray-500 mb-2">Sign up to get text updates for exclusive offers and shipping messages, including cart reminders. Msg & data rates may apply. View terms & privacy policy.</p>
          </div>
          {/* Delivery Method */}
          <div className="mb-6">
            <h3 className="font-bold mb-2 text-sm">DELIVERY METHOD</h3>
            <div className="bg-gray-100 border rounded px-3 py-2 text-sm text-gray-500">Enter your shipping address to view available shipping methods.</div>
          </div>
          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-bold mb-2 text-sm">PAYMENT METHOD</h3>
            <div className="flex items-center gap-2 mb-2">
              <input type="radio" name="payment" id="card" checked={paymentMethod==='card'} onChange={()=>setPaymentMethod('card')} className="h-4 w-4" />
              <label htmlFor="card" className="text-sm font-medium">Credit card</label>
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Discover_Card_logo.svg" alt="Discover" className="h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Amex_logo.svg" alt="Amex" className="h-5" />
            </div>
            <div className="flex gap-2 mb-2">
              <input type="text" className="w-1/2 border rounded px-3 py-2" placeholder="Card number" />
              <input type="text" className="w-1/4 border rounded px-3 py-2" placeholder="MM/YY" />
              <input type="text" className="w-1/4 border rounded px-3 py-2" placeholder="CVC" />
            </div>
            <input type="text" className="w-full border rounded px-3 py-2 mb-2" placeholder="Name on card" />
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id="sameaddress" className="h-4 w-4" />
              <label htmlFor="sameaddress" className="text-xs">Use shipping address as billing address</label>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <input type="radio" name="payment" id="flutterwave" checked={paymentMethod==='flutterwave'} onChange={()=>setPaymentMethod('flutterwave')} className="h-4 w-4" />
                <label htmlFor="flutterwave" className="text-sm font-medium">Flutterwave</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" name="payment" id="paystack" checked={paymentMethod==='paystack'} onChange={()=>setPaymentMethod('paystack')} className="h-4 w-4" />
                <label htmlFor="paystack" className="text-sm font-medium">Paystack</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" name="payment" id="bank" checked={paymentMethod==='bank'} onChange={()=>setPaymentMethod('bank')} className="h-4 w-4" />
                <label htmlFor="bank" className="text-sm font-medium">Bank Transfer</label>
              </div>
            </div>
          </div>
          {/* Remember Me */}
          <div className="mb-6">
            <h3 className="font-bold mb-2 text-sm">REMEMBER ME</h3>
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id="remember" className="h-4 w-4" />
              <label htmlFor="remember" className="text-xs">Save my information for a faster checkout</label>
            </div>
          </div>
          <button onClick={async ()=>{
            setMessage('');
            if (!email || cart.length === 0) { setMessage('Please enter email and add items to cart.'); return; }
            setSubmitting(true);
            try {
              if (paymentMethod === 'flutterwave') {
                if (!flutterwavePublicKey) throw new Error('Flutterwave public key not configured');
                await loadFlutterwaveScript();
                await new Promise<void>((resolve, reject) => {
                  const onSuccess = function(response: any) {
                    if (response.status === 'successful') {
                      createOrder()
                        .then((data) => {
                          setMessage('Payment submitted successfully. Order ID: ' + data.orderId);
                          clearCart();
                          setTimeout(() => navigate('/'), 1200);
                          resolve();
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    } else {
                      reject(new Error('Payment was not successful'));
                    }
                  };
                  const onClose = function() {
                    reject(new Error('Payment popup closed'));
                  };
                  (window as any).FlutterwaveCheckout({
                    public_key: flutterwavePublicKey,
                    tx_ref: 'txref-' + Date.now(),
                    amount: subtotal,
                    currency: 'NGN',
                    payment_options: 'card,mobilemoney,ussd',
                    customer: {
                      email: email,
                      phone_number: phone || '',
                      name: `${firstName} ${lastName}`.trim() || 'Customer',
                    },
                    customizations: {
                      title: 'Allure Fashion',
                      description: 'Payment for fashion items',
                      logo: '',
                    },
                    callback: onSuccess,
                    onclose: onClose,
                  });
                });
              } else if (paymentMethod === 'paystack') {
                if (!paystackPublicKey) throw new Error('Paystack public key not configured');
                await loadPaystackScript();
                await new Promise<void>((resolve, reject) => {
                  const amountKobo = Math.max(100, Math.round(subtotal * 100)); // Paystack requires min 1 NGN = 100 kobo
                  const onSuccess = function(response: any) {
                    createOrder()
                      .then((data) => {
                        setMessage('Payment submitted successfully. Order ID: ' + data.orderId);
                        clearCart();
                        setTimeout(() => navigate('/'), 1200);
                        resolve();
                      })
                      .catch((err) => {
                        reject(err);
                      });
                  };
                  const onClose = function() {
                    reject(new Error('Payment popup closed'));
                  };
                  const handler = (window as any).PaystackPop?.setup?.({
                    key: paystackPublicKey,
                    email: email,
                    amount: amountKobo,
                    currency: 'NGN',
                    callback: onSuccess,
                    onClose: onClose,
                  });
                  if (!handler || typeof handler.openIframe !== 'function') {
                    reject(new Error('Failed to initialize Paystack'));
                    return;
                  }
                  handler.openIframe();
                });
              } else {
                const data = await createOrder();
                setMessage('Payment submitted successfully. Order ID: ' + data.orderId);
                clearCart();
                setTimeout(() => navigate('/'), 1200);
              }
            } catch (e) {
              console.error('Order submit error:', e);
              setMessage('Failed to submit payment. ' + ((e as any)?.message ? String((e as any).message) : 'Please try again.'));
            } finally {
              setSubmitting(false);
            }
          }} disabled={submitting} className="w-full bg-black text-white py-3 rounded-full font-semibold text-lg hover:bg-gray-900 transition-colors">{submitting? 'Submitting...' : 'Pay now'}</button>
          {message && <div className="mt-3 text-sm">{message}</div>}
        </div>
        {/* Right: Order Summary */}
        <div className="w-full md:w-96 bg-white rounded-lg shadow p-6 h-fit">
          <h3 className="font-bold mb-4 text-lg">Order Summary</h3>
          <div className="divide-y mb-4">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-4">
                <img src={`http://localhost:3001${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.color}</div>
                  <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                </div>
                <div className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input type="text" className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Discount code or gift card" />
            <button className="bg-gray-200 px-4 py-2 rounded font-medium text-sm">Apply</button>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal: {cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Shipping:</span>
            <span>—</span>
          </div>
          <div className="flex justify-between text-base font-bold mb-2">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage; 