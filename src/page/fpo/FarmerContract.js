import React, { useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import { farmerContractAddress } from "../../web3/constants";

import useFetchContractDetails from "../../hooks/useFetchContractDetails";
import { Box } from "@mui/material";

function FarmerContract({ columns }) {
  const { loading, data, fetchData } = useFetchContractDetails();

  useEffect(() => {
    fetchData(farmerContractAddress);
  }, []);

  return (
    <Box
      sx={{
        height: "73vh",
      }}
    >
      <DataGrid loading={loading} rows={data} columns={columns} />
    </Box>
  );
}

export default FarmerContract;
