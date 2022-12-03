import React, { useEffect } from "react";

import { Box, Button, Divider, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { farmerContractAddress } from "../../web3/constants";

import useFetchContractDetails from "../../hooks/useFetchContractDetails";
import FarmerContract from "./FarmerContract";
import BuyerContract from "./BuyerContract";
import Tabs from "../../components/Tabs";

function FPO() {
  const { loading, data, fetchData } = useFetchContractDetails();

  useEffect(() => {
    fetchData(farmerContractAddress);
  }, []);

  const labelList = [{ label: "with Farmer" }, { label: "with Buyer" }];
  const componentList = [
    {
      component: FarmerContract,
    },
    {
      component: BuyerContract,
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
        }}
      >
        <Tabs componentList={componentList} labelList={labelList} />
      </Box>
    </Box>
  );
}

export default FPO;
