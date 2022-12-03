import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button } from "@mui/material";

import useMetaMask from "../../context/MetaMaskContext";

import data from "../../data/accountData.json";

function Login() {
  const { connect, account } = useMetaMask();
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      const accountData = data?.[account];
      accountData && navigate(accountData.route);
    }
  }, [account]);

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
