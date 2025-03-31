// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  // Initialize wallet state
  chrome.storage.local.set({
    walletInitialized: false,
    accounts: [],
    selectedNetwork: 'mainnet'
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'GET_WALLET_STATE':
      chrome.storage.local.get(['walletInitialized', 'accounts'], sendResponse);
      return true;
    case 'CONNECT_SITE':
      // Handle site connection requests
      break;
    case 'SIGN_TRANSACTION':
      // Handle transaction signing
      break;
  }
});