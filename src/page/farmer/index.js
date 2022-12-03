import React, { useEffect } from "react";

import { Box, Button } from "@mui/material";

import useMetaMask from "../../context/MetaMaskContext";
import FarmerContract from "../../artifacts/contracts/FarmerIcsContract.sol/FarmerIcsContract.json";
import { useWeb3React } from "@web3-react/core";

const farmerContractAddress = "0x1dD8629e4e4e659CB10344a063847fc5bc29c25C";
const fpoContractAddress = "0xe9817a5D9c02EeA1C2329D94E3799B539CdfD519";

function Farmer() {
  const { disconnect, isActive, account } = useMetaMask();
  const { library: web3 } = useWeb3React();

  useEffect(() => {
    let contract = new web3.eth.Contract(
      FarmerContract.abi,
      farmerContractAddress
    );

    contract.methods
      .getDetails2()
      .call()
      .then((res) => console.log("res", res)); // res includes all the details -> res.buyerName
  }, [web3]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Farmer
      {isActive && (
        <>
          <span>Connected with {account}</span>
          <Button onClick={disconnect} variant="danger">
            Disconnect from MetaMask
          </Button>
        </>
      )}
    </Box>
  );
}

export default Farmer;
