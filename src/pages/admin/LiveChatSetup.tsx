import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LiveChatSetup: React.FC = () => {
  const [liveChatCode, setLiveChatCode] = useState('');
  const [liveChatProvider, setLiveChatProvider] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const apiBase = (import.meta as any).env?.DEV ? 'http://localhost:3001' : '';

  const liveChatProviders = [
    { value: 'tawk', label: 'Tawk.to' },
    { value: 'intercom', label: 'Intercom' },
    { value: 'zendesk', label: 'Zendesk Chat' },
    { value: 'crisp', label: 'Crisp' },
    { value: 'smartsupp', label: 'Smartsupp' },
    { value: 'freshchat', label: 'Freshchat' },
    { value: 'livechat', label: 'LiveChat' },
    { value: 'drift', label: 'Drift' },
    { value: 'olark', label: 'Olark' },
    { value: 'custom', label: 'Custom Code' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/config/livechat`);
        const cfg = res.data || {};
        setLiveChatCode(cfg.liveChatCode || '');
        setLiveChatProvider(cfg.liveChatProvider || '');
        setIsEnabled(cfg.isEnabled || false);
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
      await axios.put(`${apiBase}/api/config/livechat`, {
        liveChatCode,
        liveChatProvider,
        isEnabled,
      });
      setStatus('Live chat configuration saved successfully!');
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to save';
      setStatus(msg);
    } finally {
      setSaving(false);
    }
  };

  const getProviderInstructions = () => {
    switch (liveChatProvider) {
      case 'tawk':
        return (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Tawk.to Setup Instructions:</h4>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Go to <a href="https://tawk.to" target="_blank" rel="noopener noreferrer" className="underline">tawk.to</a> and create an account</li>
              <li>Add your website and get the widget code</li>
              <li>Copy the entire script tag (including &lt;script&gt; tags)</li>
              <li>Paste it in the code field above</li>
            </ol>
          </div>
        );
      case 'intercom':
        return (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Intercom Setup Instructions:</h4>
            <ol className="list-decimal list-inside text-sm text-green-700 space-y-1">
              <li>Go to your Intercom dashboard</li>
              <li>Navigate to Settings → Installation</li>
              <li>Copy the JavaScript snippet</li>
              <li>Paste it in the code field above</li>
            </ol>
          </div>
        );
      case 'zendesk':
        return (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Zendesk Chat Setup Instructions:</h4>
            <ol className="list-decimal list-inside text-sm text-purple-700 space-y-1">
              <li>Go to your Zendesk Chat dashboard</li>
              <li>Navigate to Settings → Widget</li>
              <li>Copy the embed code</li>
              <li>Paste it in the code field above</li>
            </ol>
          </div>
        );
      case 'crisp':
        return (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-2">Crisp Setup Instructions:</h4>
            <ol className="list-decimal list-inside text-sm text-indigo-700 space-y-1">
              <li>Go to <a href="https://crisp.chat" target="_blank" rel="noopener noreferrer" className="underline">crisp.chat</a></li>
              <li>Navigate to Settings → Setup instructions</li>
              <li>Copy the Crisp chatbox code</li>
              <li>Paste it in the code field above</li>
            </ol>
          </div>
        );
      case 'smartsupp':
        return (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Smartsupp Setup Instructions:</h4>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Go to <a href="https://smartsupp.com" target="_blank" rel="noopener noreferrer" className="underline">smartsupp.com</a> and create an account</li>
              <li>Navigate to Settings → Chat box → Installation</li>
              <li>Copy the chat box code</li>
              <li>Paste it in the code field above</li>
            </ol>
          </div>
        );
      case 'custom':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Custom Code Instructions:</h4>
            <p className="text-sm text-gray-700">
              Paste any custom live chat JavaScript code here. Make sure to include the complete script tags.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const getExampleCode = () => {
    switch (liveChatProvider) {
      case 'tawk':
        return `<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->`;
      case 'intercom':
        return `<script>
window.intercomSettings = {
  app_id: "YOUR_APP_ID"
};
</script>
<script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/YOUR_APP_ID';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();</script>`;
      case 'crisp':
        return `<script type="text/javascript">
window.$crisp=[];window.CRISP_WEBSITE_ID="YOUR_WEBSITE_ID";
(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
</script>`;
      case 'smartsupp':
        return `<script type="text/javascript">
var _smartsupp = _smartsupp || {};
_smartsupp.key = 'YOUR_SMARTSUPP_KEY';
window.smartsupp||(function(d) {
  var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
  s=d.getElementsByTagName('script')[0];c=d.createElement('script');
  c.type='text/javascript';c.charset='utf-8';c.async=true;
  c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
})(document);
</script>`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Live Chat Configuration</h1>
            <p className="text-gray-600">Configure your live chat widget to provide instant customer support.</p>
          </div>

          <form onSubmit={save} className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isEnabled"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isEnabled" className="text-sm font-medium text-gray-700">
                Enable Live Chat
              </label>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live Chat Provider
              </label>
              <select
                value={liveChatProvider}
                onChange={(e) => setLiveChatProvider(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                disabled={!isEnabled}
              >
                <option value="">Select a provider</option>
                {liveChatProviders.map((provider) => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live Chat Code
              </label>
              <textarea
                value={liveChatCode}
                onChange={(e) => setLiveChatCode(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                placeholder="Paste your live chat widget code here..."
                disabled={!isEnabled}
              />
              <p className="mt-1 text-xs text-gray-500">
                Paste the complete JavaScript code provided by your live chat service, including script tags.
              </p>
            </div>

            {/* Example Code */}
            {liveChatProvider && getExampleCode() && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Example Code for {liveChatProviders.find(p => p.value === liveChatProvider)?.label}
                </label>
                <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                  <code>{getExampleCode()}</code>
                </pre>
                <button
                  type="button"
                  onClick={() => setLiveChatCode(getExampleCode())}
                  className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                >
                  Use this example (remember to replace with your actual IDs)
                </button>
              </div>
            )}

            {/* Instructions */}
            {getProviderInstructions()}

            {/* Save Button */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={saving || !isEnabled}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
              
              {status && (
                <span className={`text-sm ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {status}
                </span>
              )}
            </div>
          </form>

          {/* Preview Section */}
          {isEnabled && liveChatCode && (
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Preview Mode</h3>
              <p className="text-sm text-yellow-700 mb-4">
                Your live chat widget will appear on your website once you save this configuration. 
                Make sure to test it thoroughly before going live.
              </p>
              <div className="bg-white p-4 rounded border">
                <h4 className="font-medium text-gray-900 mb-2">Current Configuration:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Provider:</strong> {liveChatProviders.find(p => p.value === liveChatProvider)?.label || 'Not selected'}</li>
                  <li><strong>Status:</strong> {isEnabled ? 'Enabled' : 'Disabled'}</li>
                  <li><strong>Code Length:</strong> {liveChatCode.length} characters</li>
                </ul>
              </div>
            </div>
          )}

          {/* Debug Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🔧 Debug Information</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>API Endpoint:</strong> {apiBase}/api/config/livechat</p>
              <p><strong>Current Status:</strong> {status || 'Ready'}</p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const response = await fetch(`${apiBase}/api/config/livechat`);
                    const data = await response.json();
                    alert(`API Response: ${JSON.stringify(data, null, 2)}`);
                  } catch (error) {
                    alert(`API Error: ${error}`);
                  }
                }}
                className="mt-2 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                Test API Connection
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Need Help?</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>Common Issues:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Make sure to include the complete script tags in your code</li>
                <li>Replace placeholder IDs with your actual account IDs</li>
                <li>Test the widget in an incognito/private browser window</li>
                <li>Some providers may take a few minutes to activate</li>
              </ul>
              <p className="mt-3">
                <strong>Popular Free Options:</strong> Tawk.to, Smartsupp (free tier), Crisp (free tier), Intercom (free trial)
              </p>
              <p className="mt-3">
                <strong>For Smartsupp:</strong> Get your free key at <a href="https://smartsupp.com" target="_blank" rel="noopener noreferrer" className="underline">smartsupp.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChatSetup;