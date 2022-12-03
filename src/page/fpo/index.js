import React from "react";

import { Box, Button } from "@mui/material";

import useMetaMask from "../../context/MetaMaskContext";

function FPO() {
  const { disconnect, isActive, account } = useMetaMask();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      FPO
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

export default FPO;
