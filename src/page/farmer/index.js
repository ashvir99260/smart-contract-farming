import React, { useEffect, useState } from "react";

import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";

import { farmerContractAddress } from "../../web3/constants";

import useFetchContractDetails from "../../hooks/useFetchContractDetails";
import Dialog from "../../components/Dialog";

import {
  CurrencyBitcoin,
  CalendarMonth,
  WorkspacePremium,
  EnergySavingsLeaf,
} from "@mui/icons-material";
import FarmerTimeLine from "./FarmerTimeLine";

function Farmer() {
  const { loading, data, fetchData } = useFetchContractDetails();
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});

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
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => {
            setOpenModal(true);
            setSelectedData(params.row);
          }}
        >
          View Details
        </Button>
      ),
      flex: 1,
    },
  ];

  const handleClose = () => {
    setOpenModal(false);
    setSelectedData(undefined);
  };

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
      {openModal && (
        <Dialog
          open={Boolean(openModal)}
          onClose={handleClose}
          fullWidth
          maxWidth={"md"}
          dialogContentProps={{
            sx: {
              backgroundColor: "#F5F5F5",
            },
          }}
          sx={{}}
          showCloseButton={false}
        >
          <Paper
            sx={{
              p: 2,
              mt: 2.5,
              mb: 2.5,
            }}
          >
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h5">
                  {selectedData?.productName}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    opacity: 0.7,
                    fontWeight: 550,
                    py: 0.5,
                  }}
                >
                  Sold By: {selectedData?.sellerName}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 550,
                    py: 0.5,
                  }}
                >
                  Estimated Yield: {selectedData?.estimatedYieldMin} -{" "}
                  {selectedData?.estimatedYieldMax} tonnes
                </Typography>
              </Grid>
              <Grid container justifyContent={"flex-end"} item xs={6}>
                <Box
                  sx={{
                    display: "block",
                  }}
                >
                  <Chip
                    icon={<CurrencyBitcoin />}
                    sx={{ m: 0.5, borderRadius: "8px" }}
                    label={`${selectedData?.estimatedYieldMin} - ${selectedData?.estimatedYieldMax}`}
                  />
                  <Chip
                    icon={<CalendarMonth />}
                    sx={{ m: 0.5, borderRadius: "8px" }}
                    label={`Jan 23`}
                  />
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Chip
                      icon={<WorkspacePremium />}
                      sx={{ m: 0.5, borderRadius: "8px" }}
                      label={"NPOP"}
                    />
                    <Chip
                      icon={<EnergySavingsLeaf />}
                      sx={{ m: 0.5, borderRadius: "8px" }}
                      label={"CSV 15"}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          <Paper
            sx={{
              p: 2,
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6">Contract</Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 550,
                  }}
                >
                  Value: {selectedData?.tentativePrice}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 550,
                  }}
                >
                  Locked Amount: {selectedData?.tentativePrice}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 550,
                  }}
                >
                  Locked Amount: {selectedData?.tentativePrice}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Typography variant="h6">Release Events</Typography>
                <FarmerTimeLine />
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={6}>
                  Signed due from : {selectedData?.buyerName}
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end">
                  <Button variant="contained">Sign Contract</Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Dialog>
      )}
    </Box>
  );
}

export default Farmer;
