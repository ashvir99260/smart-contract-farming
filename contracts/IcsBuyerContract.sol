pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./EscrowPurchase.sol";
import "./Incentives.sol";
import "./FarmerIcsContract.sol";
import "./IcsBuyerEventEnum.sol";

contract IcsBuyerContract is EscrowPurchase {
  using SafeERC20 for IERC20;

  address owner;
  address[] farmers = new address[](500);  // ALERT - HARDCODED LIMIT
  mapping(address => address) farmerContracts;
  address incentiveContract;
  mapping(IcsBuyerEventEnum => uint256) eventIncentiveTable;

  constructor(address _tokenAddress
    , string memory _productName
    , string memory _wholesalerName
    , string memory _icsName
    , address _wholesaler // buyer
    , address _ics // seller
    , uint256 _estimatedYieldMin
    , uint256 _estimatedYieldMax
    , uint256 _estimatedPriceMin
    , uint256 _estimatedPriceMax
    , uint256 _downPaymentBps // Percentage in BPS
  )
  EscrowPurchase(_tokenAddress
	, _productName
	, _wholesalerName
	, _icsName
	, _wholesaler
	, _ics
	, _estimatedYieldMin
	, _estimatedYieldMax
	, _estimatedPriceMin
	, _estimatedPriceMax
	, _downPaymentBps)
  {
    owner = msg.sender;
  }

  modifier onlyOwner {
   require(msg.sender == owner, "Only owners allowed.");
    _;
  }
  modifier onlyIcs {
   require(msg.sender == seller, "Only ICS allowed.");
    _;
  }

  function addFarmer(address _farmer, address _farmerContract)
  onlyOwner
  external
  {
    FarmerIcsContract c = FarmerIcsContract(_farmerContract);
    require(c.getParentContract() == address(this), "Invalid farmer contract. Can not add to this contract");

    farmers.push(_farmer);
    farmerContracts[_farmer] = _farmerContract;
  }

  function acceptHarvest(
    uint256 quantity
    , uint256 price
  )
  onlyBuyer
  external
  {
    uint256 _amount = quantity * price * (10**18);

    // DUPLICATE CODE - copy of _releaseAmount - how to call internal functions from inheriting contract?
    PaymentToken token = PaymentToken(erc20Address);
    uint256 balance = token.balanceOf(address(this));
    require( _amount < balance, "Can't release final funds. Insufficient funds");
    // console.log("Releasing final payment");
    // console.log(_amount/(10**18));
    IERC20(token).safeTransfer(address(seller), _amount);
  }

  function settleFarmer(
    address _farmer
    , uint256 quantity
    , uint256 price
  )
  onlyIcs
  external
  {
    address farmerContract = farmerContracts[_farmer];
    FarmerIcsContract fic = FarmerIcsContract(farmerContract);
    (uint256 ficValueMin, uint256 ficValueMax) = fic.getContractValue();
    (address buyer, address seller, uint256 contractMin, uint contractMax, uint256 balance, uint256 released, uint256 locked) = fic.details();
    uint256 payment = quantity * price;
    require(payment < balance, "Insufficient funds in farmer contract");
    fic.releaseAmount(payment);
  }

  function lookupFarmerContract(address _farmer)
  onlyOwner
  external
  view
  returns(address)
  {
    return farmerContracts[_farmer];
  }

  function setIncentiveContract(address _incentiveContract)
  onlyOwner
  external
  {
    incentiveContract = _incentiveContract;
  }

  function addEvent(string memory _uri, address _recipient, uint256 _eventId)
  onlyOwner
  external
  {
    Incentives iContract = Incentives(incentiveContract);
    iContract.addEvent(_uri, _recipient, _eventId);
  }

  function submitEvent(IcsBuyerEventEnum _event)
  onlyBuyer
  external
  {
    uint256 releasePct = eventIncentiveTable[_event];
    if (releasePct == 0) {
      return; // not found
    }
    PaymentToken token = PaymentToken(erc20Address);
    uint256 balance = token.balanceOf(address(this));
    uint256 amountToRelease = releasePct * contractValueMin / 10_000;
    require( amountToRelease < balance, "Insufficient funds");

    this.releaseAmount(amountToRelease);
  }

}

