// contracts/PaymentToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PaymentToken.sol";

// Each token is equal to a rupee
contract Incentives {

  using SafeERC20 for IERC20;
    
  address owner;
  address issueAuthority; // Who can issue tokens
  address erc20Address; // Incentive token contract
  uint256 balance;

  //      eventId   => incentives
  mapping(uint256 => uint256) incentiveConfig;

  event IncentiveEvent(address farmer, uint256 eventId, string uri, uint256 incentive);

  constructor(address _issueAuthority, address _tokenContract) {
    owner = msg.sender;
    issueAuthority = _issueAuthority;
    erc20Address = _tokenContract;
    balance = 0;
  }
  
  modifier onlyOwner {
   require(msg.sender == owner, "Only owners allowed.");
    _;
  }

  modifier onlyIssuer {
   require(msg.sender == issueAuthority, "Permission denied");
    _;
  }

  // NOTE: THe UI needs to trigger approve by the buyer 
  // before invoking this
  function deposit(uint256 _amount) 
  onlyIssuer
  external
  {
    require(_amount > 0, "Invalid amount");
    PaymentToken token = PaymentToken(erc20Address);
    IERC20(token).safeTransferFrom(msg.sender, address(this), _amount);
    balance += _amount;
  }

  function addAuthority(address _issueAuthority)
  onlyOwner
  external
  {
    issueAuthority = _issueAuthority;
  }

  function setIncentive(uint256 _eventId, uint256 _incentive)
  onlyOwner
  external
  {
    incentiveConfig[_eventId] = _incentive;
  }

  // TODO - how do we validate the receiver?
  // TODO - emit issueIncentive event
  function addEvent(string memory _uri, address recipient, uint256 _eventId)
  onlyIssuer
  external
  {
    uint256 incentiveAmount = incentiveConfig[_eventId];
    require(incentiveAmount > 0, "Incentive not configured for event");
    require(incentiveAmount < balance, "Insufficient funds");
    balance -= incentiveAmount;

    PaymentToken token = PaymentToken(erc20Address);
    IERC20(token).safeTransferFrom(address(this), recipient, incentiveAmount);
          
    emit IncentiveEvent(recipient, _eventId, _uri, incentiveAmount);
  }
}
