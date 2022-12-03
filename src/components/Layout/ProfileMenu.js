import * as React from "react";

import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import Logout from "@mui/icons-material/Logout";

import useMetaMask from "../../context/MetaMaskContext";

export default function ProfileMenu() {
  const { account, disconnect } = useMetaMask();

  return (
    <MenuList>
      <MenuItem>
        <ListItemText>Account Address: {account}</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemText>Balance: {}</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={disconnect}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </MenuList>
  );
}
