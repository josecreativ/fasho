import React, { useEffect, useState } from 'react';

const LiveChat: React.FC = () => {
  const [liveChatConfig, setLiveChatConfig] = useState<{
    liveChatCode: string;
    liveChatProvider: string;
    isEnabled: boolean;
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const apiBase = (import.meta as any).env?.DEV ? 'http://localhost:3001' : '';

  useEffect(() => {
    const fetchLiveChatConfig = async () => {
      try {
        const response = await fetch(`${apiBase}/api/config/livechat`);
        if (response.ok) {
          const config = await response.json();
          setLiveChatConfig(config);
          console.log('Live chat config loaded:', config);
        } else {
          console.warn('Failed to fetch live chat config:', response.status);
          setLiveChatConfig({
            liveChatCode: '',
            liveChatProvider: '',
            isEnabled: false
          });
        }
      } catch (error) {
        console.error('Failed to fetch live chat config:', error);
        setLiveChatConfig({
          liveChatCode: '',
          liveChatProvider: '',
          isEnabled: false
        });
      }
    };

    fetchLiveChatConfig();
  }, []);

  useEffect(() => {
    if (liveChatConfig?.isEnabled && liveChatConfig?.liveChatCode && !isLoaded) {
      console.log('Loading live chat widget...', liveChatConfig.liveChatProvider);
      
      try {
        // Clean up any existing scripts
        const existingScripts = document.querySelectorAll('#live-chat-script, script[src*="smartsupp"], script[src*="tawk"], script[src*="crisp"]');
        existingScripts.forEach(script => script.remove());

        // Clean up existing chat widgets
        if ((window as any).smartsupp) {
          delete (window as any).smartsupp;
        }
        if ((window as any)._smartsupp) {
          delete (window as any)._smartsupp;
        }

        // Extract and clean the script content more thoroughly
        let scriptContent = liveChatConfig.liveChatCode
          .replace(/<script[^>]*>/gi, '')
          .replace(/<\/script>/gi, '')
          .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
          .replace(/<noscript[\s\S]*?<\/noscript>/gi, '') // Remove noscript tags
          .trim();

        console.log('Cleaned script content:', scriptContent);

        if (scriptContent) {
          // For Smartsupp, we need to execute the code directly
          if (liveChatConfig.liveChatProvider === 'smartsupp') {
            try {
              // Execute the Smartsupp initialization code
              eval(scriptContent);
              console.log('✅ Smartsupp script executed successfully');
              
              // Wait for Smartsupp to initialize and load
              let checkCount = 0;
              const checkSmartsupp = () => {
                checkCount++;
                console.log(`🔍 Checking Smartsupp status (attempt ${checkCount})...`);
                
                if ((window as any).smartsupp && typeof (window as any).smartsupp === 'function') {
                  console.log('✅ Smartsupp function is ready!');
                  setIsLoaded(true);
                } else if ((window as any)._smartsupp) {
                  console.log('✅ Smartsupp config loaded, checking for function...');
                  if (checkCount < 10) {
                    setTimeout(checkSmartsupp, 1000);
                  } else {
                    console.log('⚠️ Smartsupp config loaded but function not available after 10 attempts');
                    setIsLoaded(true); // Set as loaded anyway
                  }
                } else {
                  console.log(`❌ Smartsupp not found (attempt ${checkCount})`);
                  if (checkCount < 5) {
                    setTimeout(checkSmartsupp, 1000);
                  }
                }
              };
              
              // Start checking after a short delay
              setTimeout(checkSmartsupp, 1000);
              
            } catch (error) {
              console.error('❌ Error executing Smartsupp script:', error);
              
              // Fallback: try adding as a script element
              console.log('🔄 Trying fallback method...');
              const script = document.createElement('script');
              script.type = 'text/javascript';
              script.id = 'live-chat-script';
              script.innerHTML = scriptContent;
              document.head.appendChild(script);
              setIsLoaded(true);
            }
          } else {
            // For other providers, use the standard approach
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = 'live-chat-script';
            script.innerHTML = scriptContent;
            document.head.appendChild(script);
            setIsLoaded(true);
            console.log('Generic live chat script added');
          }
        }

      } catch (error) {
        console.error('Error loading live chat widget:', error);
      }
    }
  }, [liveChatConfig, isLoaded]);

  // Add a global function to check chat status
  useEffect(() => {
    (window as any).checkLiveChat = () => {
      console.log('=== Live Chat Status ===');
      console.log('Config:', liveChatConfig);
      console.log('Is Loaded:', isLoaded);
      console.log('Smartsupp function:', typeof (window as any).smartsupp);
      console.log('Smartsupp config:', (window as any)._smartsupp);
      console.log('Tawk API:', typeof (window as any).Tawk_API);
      console.log('Crisp:', typeof (window as any).$crisp);
      console.log('Intercom:', typeof (window as any).Intercom);
    };
  }, [liveChatConfig, isLoaded]);

  // This component doesn't render anything visible
  return null;
};

export default LiveChat;