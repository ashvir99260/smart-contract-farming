 // scripts/CeeToken_deploy.js

 const {ethers} = require("hardhat");

 async function deployContractNFt() {
   const factory = await ethers.getContractFactory("ContractNFT");
   console.log('Deploying ContractNFT...');
   const deployment = await factory.deploy();
 
   await deployment.deployed();
   console.log("ContractNFT deployed to:", deployment.address);
   return deployment.address;
 }
 
 
 deployContractNFt()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error);
     process.exit(1);
   });
 
 /**
ContractNFT deployed to: 0x334533370fEb15428da4d182603db1b8d670a025
(Mumbai)
* 
  */
 