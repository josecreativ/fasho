import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaystackSetup: React.FC = () => {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const apiBase = '';

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/config/payment`);
        const cfg = res.data || {};
        setPublicKey(cfg.paystackPublicKey || '');
        setSecretKey(cfg.paystackSecretKey || '');
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    try {
      await axios.put(`${apiBase}/api/config/payment`, {
        paystackPublicKey: publicKey,
        paystackSecretKey: secretKey,
      });
      setStatus('Saved');
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to save';
      setStatus(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Paystack Configuration</h1>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Public Key</label>
            <input value={publicKey} onChange={e=>setPublicKey(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="pk_live_..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Secret Key</label>
            <input value={secretKey} onChange={e=>setSecretKey(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="sk_live_..." />
          </div>
          <button disabled={saving} className="bg-purple-600 text-white px-4 py-2 rounded">{saving? 'Saving...' : 'Save'}</button>
          {status && <span className="ml-2 text-sm">{status}</span>}
        </form>
      </div>
    </div>
  );
};

export default PaystackSetup;


