pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED
// Based on:
// https://thysniu.medium.com/how-to-escrow-erc20-tokens-in-solidity-with-remix-b35fe649472f

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PaymentToken.sol";

struct ContractDetails {
  string productName;
  address buyer;
  string  buyerName;

  address seller;
  string  sellerName;

  uint256 estimatedYieldMin; // Kg
  uint256 estimatedYieldMax; // Kg
  uint256 tentativeYield; // Kg

  uint256 estimatedPriceMin; // in PaymentToken (ERC20)
  uint256 estimatedPriceMax; // in PaymentToken (ERC20)
  uint256 tentativePrice; // in PaymentToken (ERC20)

  uint256 releasedAmount;
  uint256 lockedAmount;
  address contractNFT;
}

// Buyer<>Seller contract
// Contract used between ICS <> Wholesaler as well as Farmer <> ICS
contract EscrowPurchase {
  using SafeERC20 for IERC20;
  // erc20 contract address
  address erc20Address;
  address admin;//bank
  address contractNFT;
  address unlocker;

  string productName;

  address buyer;
  string  buyerName;

  address seller;
  string  sellerName;

  uint256 estimatedYieldMin; // Kg
  uint256 estimatedYieldMax; // Kg
  uint256 tentativeYield; // Kg

  uint256 estimatedPriceMin; // in PaymentToken (ERC20)
  uint256 estimatedPriceMax; // in PaymentToken (ERC20)
  uint256 tentativePrice; // in PaymentToken (ERC20)
  
  bool adminSigned;
  bool buyerSigned;
  bool sellerSigned;
  uint256 contractValueMin;  // Total contract value
  uint256 contractValueMax;  // Total contract value
  uint256 lockedAmount;   // amount unlocked by the admin
  uint256 releasedAmount; // amount released by the buyer
  uint256 downPaymentBps; // pct basis points i.e. 2.5% is 250, 10% is 1000

  event AdminSigned(address admin, address buyer, address seller, uint256 contractValueMin, uint256 contractValueMax);
  event BuyerSigned(address buyer, address seller, uint256 contractValueMin, uint256 contractValueMax);
  event SellerSigned(address buyer, address seller, uint256 contractValueMin, uint256 contractValueMax);
  event Deposit(address buyer, address seller, uint256 qty);
  event Release(address buyer, address seller, uint256 qty);
  event Unlock(address buyer, address seller, uint256 qty);
  event Withdraw(address buyer, address seller, uint256 qty);
  event Cancel(address buyer, address seller);
  
  //  TODO - add reference to signed contract records (evlocker reference ID)

  modifier onlyAdmin {
    require(msg.sender == admin, "Only admin can perform this operation.");
    _;
  }
  modifier onlyUnlocker {
    require(msg.sender == unlocker, "Only unlocker can unlock funds.");
    _;
  }
  modifier onlyBuyer {
    require(msg.sender == buyer, "Only buyer can release funds.");
    _;
  }
  modifier onlySeller {
    require(msg.sender == seller, "Only seller can withdraw.");
    _;
  }

  modifier onlySignedContract {
    require(adminSigned && buyerSigned && sellerSigned, "Contract not yet final");
    _;
  }

  constructor(
    address _tokenAddress
    , string memory _productName
    , string memory _buyerName
    , string memory _sellerName
    , address _buyer
    , address _seller
    , uint256 _estimatedYieldMin
    , uint256 _estimatedYieldMax
    , uint256 _estimatedPriceMin
    , uint256 _estimatedPriceMax
    , uint256 _downPaymentBps
  )
  {
    require(_downPaymentBps >=0 && _downPaymentBps < 10_000, "Invalid downPaymentBps, please pass percentage basis points");
    productName = _productName;
    admin = msg.sender;
    unlocker = buyer; // Changed from Bank doing the unlocking to the buyer doing unlocking automatically
    erc20Address = _tokenAddress;
    buyer = _buyer;
    buyerName = _buyerName;
    sellerName = _sellerName;
    seller = _seller;

    lockedAmount = 0;
    releasedAmount = 0;
    downPaymentBps = _downPaymentBps;

    estimatedYieldMin = _estimatedYieldMin;
    estimatedYieldMax = _estimatedYieldMax;
    estimatedPriceMin = _estimatedPriceMin;
    estimatedPriceMax = _estimatedPriceMax;
    contractValueMin = _estimatedYieldMin * _estimatedPriceMin * (10**18);
    contractValueMax = _estimatedYieldMax * _estimatedPriceMax * (10**18);

    buyerSigned = false;
    sellerSigned = false;
  }

  function adminSign()
  onlyAdmin
  external
  {
    adminSigned = true;
    emit AdminSigned(admin, buyer, seller, contractValueMin, contractValueMax);
  }

  function buyerSign()
  onlyBuyer
  external
  {
    PaymentToken token = PaymentToken(erc20Address);
    uint256 balance = token.balanceOf(address(this));
    require(balance >= contractValueMax, "Please deposit tokens before signing contract");
    buyerSigned = true;
    lockedAmount = balance;
    emit BuyerSigned(buyer, seller, contractValueMin, contractValueMax);

    _makeDownpayment(); //  release the pre-payment
  }

  function sellerSign()
  onlySeller
  external
  {
    sellerSigned = true;
    emit SellerSigned(buyer, seller, contractValueMin, contractValueMax);
  }

  function assignUnlocker(address _unlocker) 
  external
  {
    unlocker = _unlocker;
  }

  function _releaseAmount(uint256 _amount)
  internal
  returns (bool)
  {
    PaymentToken token = PaymentToken(erc20Address);
    uint256 balance = token.balanceOf(address(this));
    releasedAmount = releasedAmount + _amount;
    uint256 unlocked = balance - lockedAmount;
    require( _amount < unlocked, "Insufficient funds");
    lockedAmount = lockedAmount - _amount;

    emit Release(buyer, seller, _amount);
    this.unlockAmount(_amount); // auto unlock
    return true;
  }

  function releaseAmount(uint256 _amount)
  onlyBuyer
  onlySignedContract
  external
  returns (bool)
  {
    return _releaseAmount(_amount);
  }

  function unlockAmount(uint256 _amount)
  onlyUnlocker
  onlySignedContract
  external
  returns (bool)
  {
    require(_amount <= releasedAmount, "Cannot unlock more than funds released by buyer.");
    lockedAmount = lockedAmount - _amount;
    releasedAmount = releasedAmount - _amount;

    emit Unlock(buyer, seller, _amount);
    return true;
  }

  function _makeDownpayment()
  internal
  returns (bool)
  {
    PaymentToken token = PaymentToken(erc20Address);
    uint256 balance = token.balanceOf(address(this));
    uint256 downPayment = downPaymentBps * contractValueMin / 10_000;
    require( downPayment < balance, "Insufficient funds");
		releasedAmount = releasedAmount + downPayment;
    // console.log("Released", releasedAmount);
    emit Release(buyer, seller, downPayment);
    return true;
  }
  

  function makeDownpayment()
  onlyBuyer
  onlySignedContract
  external
  returns (bool)
  {
    return _makeDownpayment();
  }
  
  function finalPayment()
  onlyBuyer
  onlySignedContract
  external
  returns (bool)
  {
    PaymentToken token = PaymentToken(erc20Address);
    uint256 balance = token.balanceOf(address(this));
    releasedAmount = balance;

    emit Release(buyer, seller, balance);

    return true;
  }

  // seller is able to withdraw unlocked tokens
  function withdraw()
  onlySeller
  onlySignedContract
  external
  returns(bool)
  {
    PaymentToken token = PaymentToken(erc20Address);
    uint256 balance = token.balanceOf(address(this));
    require(lockedAmount <= balance, "Invalid state. Locked > Balance!!");
    uint256 unlockedAmount = balance - lockedAmount;

    require(unlockedAmount > 0, "Insufficient funds");

    IERC20(token).safeTransfer(address(seller), unlockedAmount);

    emit Withdraw(buyer, seller, unlockedAmount);
    return true;
  }

  function cancel()
  onlyAdmin
  onlySignedContract
  external 
  {
    PaymentToken token = PaymentToken(erc20Address);
    uint256 balance = token.balanceOf(address(this));
    IERC20(token).safeTransfer(address(buyer), balance);
    lockedAmount = 0;
    releasedAmount = 0;

    emit Cancel(buyer, seller);
  }

  function setNFT(address _nftAddress)
  onlyAdmin
  external 
  {
    contractNFT = _nftAddress;
  }

  // retrieve current state of transaction in escrow
  // returns total amount available, locked amount 
  // and producer address
  function details()
  external view
  returns (address, address, uint256,   uint256,     uint256, uint256, uint256)
  //        ^^        ^^       ^^         ^^            ^^       ^^       ^^
  //       buyer    seller   contractMin, contractMax, balance  released  locked
  {
    PaymentToken token = PaymentToken(erc20Address);
    uint256 balance = token.balanceOf(address(this));
    return (
      buyer, seller, contractValueMin, contractValueMax, balance, releasedAmount, lockedAmount
    );
  }

  function getContractValue()
  external
  view 
  returns (uint256, uint256)
  {
    return (contractValueMin, contractValueMax);
  }

  function getBuyer()
  external
  view 
  returns (string memory, address)
  {
    return (buyerName, buyer);
  }

  function getSeller()
  external
  view 
  returns (string memory, address)
  {
    return (sellerName, seller);
  }

  function getProduct()
  external
  view 
  returns (string memory, uint256,uint256,uint256,uint256)
  {
    return (productName, estimatedYieldMin, estimatedYieldMax, estimatedPriceMin, estimatedPriceMax);
  }


  function _getDetails()
  internal
  view
  returns(ContractDetails memory)
  {
    return ContractDetails(productName
      , buyer
      , buyerName
      , seller
      , sellerName
      , estimatedYieldMin
      , estimatedYieldMax
      , tentativeYield
      , estimatedPriceMin
      , estimatedPriceMax
      , tentativePrice
      , releasedAmount
      , lockedAmount
      , contractNFT
    );
  }

  function getDetails2()
  external
  view
  returns(ContractDetails memory)
  {
    return _getDetails();
  }
}
