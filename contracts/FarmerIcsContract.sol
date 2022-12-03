pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./EscrowPurchase.sol";
import "./Incentives.sol";
import "./FarmerIcsEventEnum.sol";

contract FarmerIcsContract is EscrowPurchase {
  address incentiveContract;
  address parentContract;
  mapping(FarmerIcsEventEnum => uint256) eventIncentiveTable;

  constructor(
    address _tokenAddress
    , string memory _productName
    , string memory _icsName
    , string memory _farmerName
    , address _ics // buyer
    , address _farmer // seller
    , uint256 _estimatedYieldMin
    , uint256 _estimatedYieldMax
    , uint256 _estimatedPriceMin
    , uint256 _estimatedPriceMax
    , uint256 _downPaymentBps // Percentage in BPS
  )
  EscrowPurchase(
	_tokenAddress
	, _productName
	, _icsName
	, _farmerName
	, _ics
	, _farmer
	, _estimatedYieldMin
	, _estimatedYieldMax
	, _estimatedPriceMin
	, _estimatedPriceMax
	, _downPaymentBps)
  {
  }

  modifier onlyFarmer {
    address farmer = seller;
    require(msg.sender == farmer, "Only farmer can do this operation.");
    _;
  }
  modifier onlyIcs {
    address ics = buyer;
    require(msg.sender == ics, "Only ics can do this operation.");
    _;
  }

  function setParentContract(address _parentContract)
  external

  {
    parentContract = _parentContract;
  }


  function getParentContract()
  external
  view
  returns (address)
  {
    return parentContract;
  }

  function setIncentiveContract(address _incentiveContract)
  onlyBuyer
  external
  {
    incentiveContract = _incentiveContract;
  }

  function addEvent(string memory _uri, uint256 _eventId)
  onlyFarmer
  external
  {
    address farmer = seller;

    Incentives iContract = Incentives(incentiveContract);
    iContract.addEvent(_uri, farmer, _eventId);
  }
}

