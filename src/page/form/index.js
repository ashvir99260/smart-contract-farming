import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";

function index() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Stack spacing={2}>
        <Typography mb={2} variant="h3">
          Create Contract
        </Typography>
        <Stack direction="row" spacing={4}>
          <TextField
            size="small"
            id="ics-name"
            label="ICS Name"
            //   value={name}
            //   onChange={handleChange}
          />
          <TextField
            size="small"
            id="farmer-name"
            label="Farmer Name"
            //   value={name}
            //   onChange={handleChange}
          />
        </Stack>
        <TextField
          size="small"
          id="buyer-address"
          label="Buyer Address"
          //   value={name}
          //   onChange={handleChange}
        />
        <TextField
          size="small"
          id="seller-address"
          label="Seller Address"
          //   value={name}
          //   onChange={handleChange}
        />
        <Stack direction="row" spacing={4}>
          <TextField
            size="small"
            id="estimated-min-yield"
            label="Estimated Min Yield "
            //   value={name}
            //   onChange={handleChange}
          />
          <TextField
            size="small"
            id="estimated-max-yield"
            label="Estimated Max Yield "
            //   value={name}
            //   onChange={handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={4}>
          <TextField
            size="small"
            id="estimated-min-price"
            label="Estimated Min Price "
            //   value={name}
            //   onChange={handleChange}
          />
          <TextField
            size="small"
            id="estimated-max-price"
            label="Estimated Max Price "
            //   value={name}
            //   onChange={handleChange}
          />
        </Stack>

        <Button style={{ marginTop: "2rem" }} variant="contained">
          Submit
        </Button>
      </Stack>
    </Box>
  );
}

export default index;
