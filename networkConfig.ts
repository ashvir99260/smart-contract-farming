
// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "OcIRYIOaALmuepVj7JMx2wjmvIUCFRFH";

// Replace this private key with your Goerli account private key.
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key.
// Beware: NEVER put real Ether into testing accounts
// const METAMASK_PRIVATE_KEY = "b9e9f4740b5c99e4a4b3cc92f24329a03acdcbd4012b1b4b2f5ba79144ee2183";

// "Bank" account
const METAMASK_PRIVATE_KEY = "8779e237dc37db84b41c6a5c37b6fe006b87b166d4cf22f32835019f5fa3a851";

const config = {
  solidity: "0.8.9",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [METAMASK_PRIVATE_KEY],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [METAMASK_PRIVATE_KEY],
    },
		
    hardhat: {
      // See its defaults
    },
  },
  etherscan: {
    apiKey: "A7Q1JYRKXXZ7XNYA7D6Y91NHXBDXS7BSWV",
  },
  appPrivKey: METAMASK_PRIVATE_KEY,
};

export default config;
