import React from "react";

import { Box, Button } from "@mui/material";

import useMetaMask from "../../context/MetaMaskContext";

function Login() {
  const { connect } = useMetaMask();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button onClick={connect} variant="contained">
        Login
      </Button>
    </Box>
  );
}

export default Login;
