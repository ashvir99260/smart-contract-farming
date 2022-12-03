import React, { useEffect, useState } from "react";

import { Box, Button, Divider, Typography } from "@mui/material";
import { farmerContractAddress } from "../../web3/constants";

import useMetaMask from "../../context/MetaMaskContext";
import FarmerContract from "../../artifacts/contracts/FarmerIcsContract.sol/FarmerIcsContract.json";

import { DataGrid } from "@mui/x-data-grid";

function FPO() {
  const { library: web3 } = useMetaMask();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [web3]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        FarmerContract.abi,
        farmerContractAddress
      );

      contract.methods
        .getDetails2()
        .call()
        .then((res) => {
          const result = Object.assign({}, res);
          setData([{ id: farmerContractAddress, ...result }]);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      renderCell: (params) => (
        <Button variant="contained" color="secondary">
          View Details
        </Button>
      ),
      flex: 1,
    },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        display: "block",
      }}
    >
      <Typography variant={"h4"}>FPO Contracts</Typography>
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

export default FPO;
