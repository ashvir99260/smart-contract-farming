import React from "react";
import { Box, Divider, Typography } from "@mui/material";

import FarmerContract from "./FarmerContract";
import BuyerContractComponent from "./BuyerContract";
import Tabs from "../../components/Tabs";
import useMetaMask from "../../context/MetaMaskContext";
import { ICSBuyerContractAddress } from "../../web3/constants";

import { toast } from "react-toastify";

import BuyerContract from "../../artifacts/contracts/IcsBuyerContract.sol/IcsBuyerContract.json";

function Banker() {
  const signContract = async (address, callback) => {
    try {
      const contract = new web3.eth.Contract(BuyerContract.abi, address);
      const d = await contract.methods;
      const reciept = await contract.methods.adminSign().send({
        from: account,
        gas: 8000000,
      });
      toast.success("Transaction Done");
      callback();
    } catch (error) {
      console.error(error);

      toast.success("Transaction Failed");
    }
  };

  const { library: web3, account } = useMetaMask();
  const labelList = [{ label: "with Farmer" }, { label: "with Buyer" }];
  const componentList = [
    {
      component: FarmerContract,
      props: {
        signContract,
      },
    },
    {
      component: BuyerContractComponent,
      props: {
        signContract,
      },
    },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        display: "block",
      }}
    >
      <Typography variant={"h4"}>Banker Contracts</Typography>
      <Divider />
      <Box
        sx={{
          p: 2,
        }}
      >
        <Tabs componentList={componentList} labelList={labelList} />
      </Box>
    </Box>
  );
}

export default Banker;
