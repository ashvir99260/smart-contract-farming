const contractAddress = "0x334533370fEb15428da4d182603db1b8d670a025";
const toAddr = "0x4a3060514F300B971E556be8a88f408eDccF0C2D";
const uri = "http://carbonmint.com/blah";
const {ethers} = require("hardhat");

async function deployContractNFt() {
  console.log('Minting ContractNFT...');
  const factory = await ethers.getContractFactory("ContractNFT");
  const instance = await factory.attach(contractAddress);
  const tx = await instance.safeMint(toAddr, uri);
  const receipt = await tx.wait();
  console.log("NFT is:", tx, receipt);
 }
 
 
 deployContractNFt()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error);
     process.exit(1);
   });
 
 /**
Token log:
 https://mumbai.polygonscan.com/token/0x334533370feb15428da4d182603db1b8d670a025
* 
  */
 