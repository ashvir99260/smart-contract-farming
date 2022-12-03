// contracts/PaymentToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// Each token is equal to a rupee
contract PaymentToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("CropPaymentToken", "Crop") {
        _mint(msg.sender, initialSupply);
    }
}
