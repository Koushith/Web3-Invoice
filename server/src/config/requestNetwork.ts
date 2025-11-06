import { RequestNetwork, Types } from '@requestnetwork/request-client.js';

let requestClient: RequestNetwork | null = null;

export const initializeRequestNetwork = (): RequestNetwork => {
  if (requestClient) {
    return requestClient;
  }

  try {
    // Initialize Request Network client
    // Uses default node gateway (free, provided by Request Network Foundation)
    requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: 'https://gnosis.gateway.request.network/',
      },
    });

    console.log('✅ Request Network initialized successfully');

    return requestClient;
  } catch (error) {
    console.error('❌ Request Network initialization failed:', error);
    throw error;
  }
};

export const getRequestClient = (): RequestNetwork => {
  if (!requestClient) {
    return initializeRequestNetwork();
  }
  return requestClient;
};

// Supported currencies for Request Network
export const SUPPORTED_CURRENCIES = {
  // Fiat currencies
  USD: { type: Types.RequestLogic.CURRENCY.ISO4217, value: 'USD' },
  EUR: { type: Types.RequestLogic.CURRENCY.ISO4217, value: 'EUR' },
  GBP: { type: Types.RequestLogic.CURRENCY.ISO4217, value: 'GBP' },

  // Crypto currencies
  ETH: { type: Types.RequestLogic.CURRENCY.ETH, value: 'ETH', network: 'mainnet' },
  USDC: { type: Types.RequestLogic.CURRENCY.ERC20, value: 'USDC', network: 'mainnet' },
  USDT: { type: Types.RequestLogic.CURRENCY.ERC20, value: 'USDT', network: 'mainnet' },
  DAI: { type: Types.RequestLogic.CURRENCY.ERC20, value: 'DAI', network: 'mainnet' },
};

// Blockchain networks supported
export const SUPPORTED_NETWORKS = {
  ETHEREUM: 'mainnet',
  POLYGON: 'matic',
  GNOSIS: 'xdai',
  SEPOLIA: 'sepolia', // testnet
};
