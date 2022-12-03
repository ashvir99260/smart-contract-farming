 // scripts/CeeToken_deploy.js

const {ethers} = require("hardhat");


async function main() {

  const factory = await ethers.getContractFactory("PaymentToken");
  console.log('Deploying PaymentToken...');
  const deployment = await factory.deploy('10000000000000000000000000');

  await deployment.deployed();
  console.log("PaymentToken deployed to:", deployment.address);
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
