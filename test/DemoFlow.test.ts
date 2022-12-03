import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SHA3 } from 'sha3';
import { expect } from "chai";
import { ethers } from "hardhat";
import { assert } from "console";

const oneM = '1000000000000000000000000';
const twoM = '2000000000000000000000000';
const tenM = '10000000000000000000000000'; // 10,000 * 1e18
const DOWNPAYMENT_VALUE = "6000000000000000000000";
const FINAL_PAYMENT = "980000000000000000000";
const WHOLESALER_NAME = "Garments are Us";
const ICS_NAME = "Farmer Collective, LLP";
const productName = "Turmeric";
const YIELD_MIN = 10, YIELD_MAX = 50, PRICE_MIN=80, PRICE_MAX=120;
describe("ICS/Buyer contract", function() {
  const TOKEN_SUPPLY= tenM; 
  const CONTRACT_VALUE = oneM;
  const DOWNPAYMENT_BPS = 200; // 2% 

  let paymentTokenContract;
  let icsBuyerContract;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractsFixture() {
    // Contracts are deployed using the first signer/account by default
    const [bank, buyer, ics] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("PaymentToken");
    paymentTokenContract = await Token.deploy(TOKEN_SUPPLY);

    const factory = await ethers.getContractFactory("IcsBuyerContract");
    icsBuyerContract = await factory.deploy(
      paymentTokenContract.address
      , productName
      , WHOLESALER_NAME
      , ICS_NAME
      , buyer.address
      , ics.address
      , YIELD_MIN
      , YIELD_MAX
      , PRICE_MIN
      , PRICE_MAX
      , DOWNPAYMENT_BPS
    );
    await icsBuyerContract.deployed();
    return { bank, buyer, ics, icsBuyerContract, paymentTokenContract };
  }
  describe("Basic functionality", () => {
    it ("Demo flow", async () => {
      const {bank, buyer, ics, icsBuyerContract, paymentTokenContract } = await deployContractsFixture();
      const asBuyer = icsBuyerContract.connect(buyer);
      const asBank = icsBuyerContract.connect(bank);
      const asIcs = icsBuyerContract.connect(ics);
      
      const bankTokens = paymentTokenContract.connect(bank);
      const buyerTokens = paymentTokenContract.connect(buyer);
      const icsTokens = paymentTokenContract.connect(ics);

      return tokenTransfer()
        .then(bankSigns)
        .then(icsSigns)
        // .then(dumpIcsBuyerContract)
        .then(buyerSigns)
        // .then(dumpIcsBuyerContract)
        .then(finalSettlement)
        ;

      async function finalSettlement() {
        const finalYield = 18, finalPrice =100;
        await asBuyer.acceptHarvest(finalYield, finalPrice);
      }

      async function dumpIcsBuyerContract() {
        const details = await asIcs.getDetails2();
        console.log(details);
      }

      async function tokenTransfer() {
        // Transfer tokens to buyer 
        await bankTokens.transfer(buyer.address, oneM); // bank => Buyer
        await buyerTokens.transfer(icsBuyerContract.address, oneM); // Buyer => ICS
      }

      async function bankSigns() { // Bank signs contract
        const tx = await icsBuyerContract.adminSign();
        const receipt = await tx.wait();
          const adminSignEvent = receipt.events?.filter((x) => {return x.event == "AdminSigned"});
        assert(adminSignEvent != undefined);
        if (!receipt.events) {
          throw new Error("AdminSigned event not found");
        }
        expect(receipt.events[0].args?.admin).to.equal(bank.address, "Admin address doesn't match in AdminSigned event");
        expect(receipt.events[0].args?.seller).to.equal(ics.address, "ICS address doesn't match in AdminSigned event");
        expect(receipt.events[0].args?.buyer).to.equal(buyer.address, "Buyer address doesn't match in AdminSigned event");
      }
      async function buyerSigns() { // Buyer signs contract
        const buyerSignTx = await asBuyer.buyerSign();
        const receipt = await buyerSignTx.wait();
        if (!receipt.events) {
          throw new Error("buyerSigned event not found");
        }
        const buyerSignEvent = receipt.events?.filter((x) => {return x.event == "BuyerSigned"});
        assert(buyerSignEvent != undefined);
        expect(receipt.events[0].args?.seller).to.equal(ics.address, "ICS address doesn't match in BuyerSigned event");
        expect(receipt.events[0].args?.buyer).to.equal(buyer.address, "Buyer address doesn't match in BuyerSigned event");
      }
      async function icsSigns(){ // seller (ICS) signs contract
        const icsSignTx = await asIcs.sellerSign();
        const receipt = await icsSignTx.wait();
        if (!receipt.events) {
          throw new Error("seller signed event not found");
        }
        const icsSignEvent = receipt.events?.filter((x) => {return x.event == "SellerSigned"});
        assert(icsSignEvent != undefined);
        expect(receipt.events[0].args?.seller).to.equal(ics.address, "ICS address doesn't match in SellerSigned event");
        expect(receipt.events[0].args?.buyer).to.equal(buyer.address, "Buyer address doesn't match in SellerSigned event");
      }        
    });
  });
});