# Instructions

1. Compile contracts:

    yarn contract:compile # compile contracts

    # Copy to src dir so react code can use the artifacts
    yarn contract:cp # Copy to src


2. Deploying contracts:

    yarn hardhat run scripts/PaymentToken_deploy.js

    # Edit the following files and change the TOKEN_ADDRESS VARIABLE
    yarn hardhat run scripts/ICSBuyerContract_deploy.ts

    yarn hardhat scripts/PaymentToken_deploy.js

