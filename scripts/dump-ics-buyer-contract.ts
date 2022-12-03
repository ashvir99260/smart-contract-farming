 // scripts/CeeToken_deploy.js

 const {ethers} = require("hardhat");


 async function main() {
    const factory = await ethers.getContractFactory("IcsBuyerContract");
    const contractAddress = "0x4792Cec4A0081227DDCDaf670e1a7fA387C195EB"
    const instance = await factory.attach(contractAddress);
    const details = await instance.getDetails2();
    console.log("Deployed contract details", details);
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
  
 