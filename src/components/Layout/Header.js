import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";

import useMetaMask from "../../context/MetaMaskContext";
import ProfileMenu from "./ProfileMenu";

function Header(children) {
  const { account } = useMetaMask();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" noWrap component="div">
            Smart Contract Farming
          </Typography>
          {account && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleClick}
                color="inherit"
              >
                <Avatar />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <ProfileMenu />
              </Menu>
            </div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
