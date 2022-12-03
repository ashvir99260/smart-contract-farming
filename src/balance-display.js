import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
const tokenAddress = "0x9A3d350cF715909dFaE4336d37F84E0Ae2682312";

// The minimum ABI to get ERC20 Token balance
let minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];


function BalanceDisplay() {
  const [balance, setBalance] = useState(0);
  const { account, library: web3 } = useWeb3React();
  useEffect(() => {
    // Get ERC20 Token contract instance
    let contract = new web3.eth.Contract(minABI, tokenAddress);
    // Call balanceOf function
    contract.methods.balanceOf(account).call().then((balance) => {
      setBalance(web3.utils.fromWei(balance));
    });
  }, [web3]);  
  if (!web3) {
    return <div> Web3 library not available</div>;
  }
  return <div>Balance: {balance}</div> 
}

export default BalanceDisplay;