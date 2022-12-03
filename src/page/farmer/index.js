import React, { useEffect, useState } from "react";

import { Box, Button, Divider, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { farmerContractAddress } from "../../web3/constants";

import useFetchContractDetails from "../../hooks/useFetchContractDetails";

function Farmer() {
  const { loading, data, fetchData } = useFetchContractDetails();

  useEffect(() => {
    fetchData(farmerContractAddress);
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

  return (
    <Box
      sx={{
        height: "100vh",
        display: "block",
      }}
    >
      <Typography variant={"h4"}>Farmer Contracts</Typography>
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

export default Farmer;
