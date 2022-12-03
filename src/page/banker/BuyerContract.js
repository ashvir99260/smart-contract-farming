import React, { useEffect, useState } from "react";

import { DataGrid } from "@mui/x-data-grid";

import { fpoContractAddress } from "../../web3/constants";

import useFetchContractDetails from "../../hooks/useFetchContractDetails";
import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import Dialog from "../../components/Dialog";
import {
  CalendarMonth,
  CurrencyBitcoin,
  EnergySavingsLeaf,
  WorkspacePremium,
} from "@mui/icons-material";
import BuyerTimeLine from "../buyer/BuyerTimeLine";

function BuyerContract() {
  const { loading, data, fetchData } = useFetchContractDetails();

  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  useEffect(() => {
    fetchData(fpoContractAddress);
  }, []);

  const handleClose = () => {
    setOpenModal(false);
    setSelectedData(undefined);
  };

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

  return (
    <Box
      sx={{
        height: "73vh",
      }}
    >
      <DataGrid loading={loading} rows={data} columns={columns} />
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
                <BuyerTimeLine />
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={6}>
                  Signed by : {selectedData?.sellerName}
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

export default BuyerContract;
