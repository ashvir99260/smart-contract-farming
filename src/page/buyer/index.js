import React, { useEffect, useState } from "react";

import { Box, Button, Divider, Typography } from "@mui/material";

import useMetaMask from "../../context/MetaMaskContext";

// import { ICSBuyerContractAddress } from "../../web3/constants";
import FarmerContract from "../../artifacts/contracts/FarmerIcsContract.sol/FarmerIcsContract.json";
import BuyerContract from "../../artifacts/contracts/IcsBuyerContract.sol/IcsBuyerContract.json";
import { ICSBuyerContractAddress } from "../../web3/constants";

import { DataGrid } from "@mui/x-data-grid";
import useFetchContractDetails from "../../hooks/useFetchContractDetails";

function Buyer() {
  const { library: web3, account } = useMetaMask();
  const { loading, data, fetchData } = useFetchContractDetails();

  useEffect(() => {
    fetchData(ICSBuyerContractAddress);
  }, []);

  const columns = [
    {
      field: "productName",
      headerName: "Name",
      minWidth: 150,
    },
    {
      field: "buyerName",
      headerName: "Buyer",
      minWidth: 150,
    },
    {
      field: "id",
      headerName: "ContractId",
      minWidth: 150,
    },
    {
      field: "tentativeYield",
      headerName: "Tentative yield",
      minWidth: 150,
    },
    {
      field: "tentativePrice",
      headerName: "Price Agreed",
      minWidth: 150,
    },
    {
      field: "actions",
      type: "actions",
      renderCell: (params) => <Button variant="contained">View Details</Button>,
      flex: 1,
    },
  ];

  const signContract = async () => {
    try {
      const contract = new web3.eth.Contract(
        BuyerContract.abi,
        ICSBuyerContractAddress
      );
      const d = await contract.methods;
      console.log("contract", d);
      const reciept = await contract.methods.buyerSign().send({
        from: account,
        gas: 8000000,
      });
      console.log("rr", reciept);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "block",
      }}
    >
      <Typography variant={"h4"}>Buyer Contracts</Typography>
      <Divider />
      <Box
        sx={{
          p: 2,
          height: "85vh",
        }}
      >
        <DataGrid loading={loading} rows={data} columns={columns} />
      </Box>
    </Box>
  );
}

export default Buyer;
