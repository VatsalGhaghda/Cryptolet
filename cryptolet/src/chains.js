const Ethereum = {
  hex: "0x1",
  name: "Ethereum",
  rpcUrl: process.env.REACT_APP_ETHEREUM_RPC_URL,
  ticker: "ETH",
};

const Polygon = {
  hex: "0x89",
  name: "Polygon",
  rpcUrl: process.env.REACT_APP_POLYGON_RPC_URL,
  ticker: "MATIC",
};

const SepoliaTestnet = {
  hex: "0xaa36a7",
  name: "Sepolia Testnet",
  rpcUrl: process.env.REACT_APP_SEPOLIA_RPC_URL,
  ticker: "ETH",
};

export const CHAINS_CONFIG = {
  "0x1": Ethereum,
  "0x89": Polygon,
  "0xaa36a7": SepoliaTestnet,
};