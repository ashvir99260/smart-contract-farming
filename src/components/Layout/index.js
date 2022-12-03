import * as React from "react";

import { Box, CssBaseline, Toolbar } from "@mui/material";

import Header from "./Header";
import NavBar from "./NavBar";

function Layout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header />
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
