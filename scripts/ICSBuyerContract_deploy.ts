 // scripts/CeeToken_deploy.js

const {ethers} = require("hardhat");

const WHOLESALER_NAME = "Garments are Us";
const ICS_NAME = "Farmer Collective, LLP";
const PRODUCT_NAME = "Turmeric";
const BUYER_ADDRESS = "0x4a3060514F300B971E556be8a88f408eDccF0C2D";
const BANK_ADDRESS="0x130cE4089d8E8C695b82b64c7AF0DF59E7007F77";
const ICS_ADDRESS = "0x7FDEC9d89f1a9188e94fB19C74B2b8E61b79F298"; // aka FPO
const FARMER_ADDRESS = "0x5F2E517e48ba173cD88E85BE3db392F36C19C20E";
const YIELD_MIN = 10, YIELD_MAX = 50, PRICE_MIN=80, PRICE_MAX=120;
const DOWNPAYMENT_BPS = 200; // 2% 
const TOKEN_ADDRESS = "0x9A3d350cF715909dFaE4336d37F84E0Ae2682312";

async function main() {
   const factory = await ethers.getContractFactory("IcsBuyerContract");
   console.log('Deploying IcsBuyerContract...');

   const deployment = await factory.deploy(
    TOKEN_ADDRESS
	, PRODUCT_NAME
	, WHOLESALER_NAME
	, ICS_NAME
	, BUYER_ADDRESS
	, ICS_ADDRESS
	, YIELD_MIN
	, YIELD_MAX
	, PRICE_MIN
	, PRICE_MAX
	, DOWNPAYMENT_BPS);
 
   await deployment.deployed();
   console.log("ICS Buyer contract deployed to:", deployment.address);
   return deployment.address;
 }
 
 
 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error);
     process.exit(1);
   });
 
 /**
 
      PaymentToken deployed to:
  * 
  */
 
