import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FlutterwaveSetup: React.FC = () => {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const apiBase = (import.meta as any).env?.DEV ? 'http://localhost:3001' : '';

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/config/payment`);
        const cfg = res.data || {};
        setPublicKey(cfg.flutterwavePublicKey || '');
        setSecretKey(cfg.flutterwaveSecretKey || '');
        setWebhookSecret(cfg.flutterwaveWebhookSecret || '');
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
        flutterwavePublicKey: publicKey,
        flutterwaveSecretKey: secretKey,
        flutterwaveWebhookSecret: webhookSecret,
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
        <h1 className="text-2xl font-bold mb-4">Flutterwave Configuration</h1>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Public Key</label>
            <input value={publicKey} onChange={e=>setPublicKey(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="FLWPUBK-..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Secret Key</label>
            <input value={secretKey} onChange={e=>setSecretKey(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="FLWSECK-..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Webhook Secret (optional)</label>
            <input value={webhookSecret} onChange={e=>setWebhookSecret(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="your webhook secret" />
          </div>
          <button disabled={saving} className="bg-purple-600 text-white px-4 py-2 rounded">{saving? 'Saving...' : 'Save'}</button>
          {status && <span className="ml-2 text-sm">{status}</span>}
        </form>
      </div>
    </div>
  );
};

export default FlutterwaveSetup;


