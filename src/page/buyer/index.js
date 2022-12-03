import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import useMetaMask from "../../context/MetaMaskContext";

// import { ICSBuyerContractAddress } from "../../web3/constants";
import FarmerContract from "../../artifacts/contracts/FarmerIcsContract.sol/FarmerIcsContract.json";
import BuyerContract from "../../artifacts/contracts/IcsBuyerContract.sol/IcsBuyerContract.json";
import PaymentTokenContract from "../../artifacts/contracts/PaymentToken.sol/PaymentToken.json";
import { ICSBuyerContractAddress } from "../../web3/constants";

import { DataGrid } from "@mui/x-data-grid";
import useFetchContractDetails from "../../hooks/useFetchContractDetails";
import Dialog from "../../components/Dialog";
import {
  CurrencyExchange,
  CalendarMonth,
  WorkspacePremium,
  EnergySavingsLeaf,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import BuyerTimeLine from "./BuyerTimeLine";
import ShowStatus from "../banker/ShowStatus";
import tokenData from "../../data/tokenData.json";

function Buyer() {
  const { library: web3, account } = useMetaMask();
  const { loading, data, fetchData } = useFetchContractDetails();
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();

  useEffect(() => {
    fetchData(ICSBuyerContractAddress);
  }, []);

  const columns = [
    {
      field: "productName",
      headerName: "Name",
      minWidth: 150,
    },
    {
      field: "sellerName",
      headerName: "FPO",
      minWidth: 150,
    },
    {
      field: "id",
      headerName: "ContractId",
      minWidth: 150,
    },
    {
      field: "estimatedYield",
      headerName: "Estimated yield",
      minWidth: 150,
      valueGetter: function (params) {
        return `${params?.row?.estimatedYieldMin} - ${params?.row?.estimatedYieldMax} Tonnes`;
      },
    },
    {
      field: "estimatedPrice",
      headerName: "Estimated Price",
      minWidth: 150,
      valueGetter: function (params) {
        return `${params?.row?.estimatedPriceMin} - ${params?.row?.estimatedPriceMax}`;
      },
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

  const signContract = async () => {
    try {
      const contract = new web3.eth.Contract(
        BuyerContract.abi,
        ICSBuyerContractAddress
      );
      const d = await contract.methods;
      const reciept = await contract.methods.buyerSign().send({
        from: account,
        gas: 8000000,
      });
      handleClose();
      toast.success("Transaction Done");
    } catch (error) {
      console.error(error);

      toast.error("Transaction Failed");
    }
  };

  const approveContract = async () => {
    try {
      const contract = new web3.eth.Contract(
        PaymentTokenContract.abi,
        tokenData.tokenAddress
      );
      const d = await contract.methods;
      const reciept = await contract.methods
        .approve(ICSBuyerContractAddress, data?.[0]?.contractValueMax)
        .send({
          from: account,
          gas: 8000000,
        });

      toast.success("Transaction Approved");
      if (reciept.status) {
        await signContract();
      }
    } catch (error) {
      console.error(error);

      toast.error("Transaction Failed");
    }
  };

  const acceptHarvest = async () => {
    try {
      const contract = new web3.eth.Contract(
        BuyerContract.abi,
        ICSBuyerContractAddress
      );
      const d = await contract.methods;
      const reciept = await contract.methods
        .acceptHarvest(quantity, price)
        .send({
          from: account,
          gas: 8000000,
        });
    } catch (error) {
      console.error(error);

      toast.error("Transaction Failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "block",
      }}
    >
      <Typography variant={"h4"}>Buyer Contracts</Typography>
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
                    icon={<CurrencyExchange />}
                    sx={{ m: 0.5, borderRadius: "8px" }}
                    label={`${selectedData?.estimatedPriceMin} - ${selectedData?.estimatedPriceMax}`}
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
            <Grid>
              <Grid>
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
              <Grid sx={{ mt: 3 }}>
                <Typography variant="h6">Release Events</Typography>
                <BuyerTimeLine />
              </Grid>
              {selectedData?.buyerSigned ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Quantity"
                      variant="outlined"
                      fullWidth
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Price"
                      variant="outlined"
                      fullWidth
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ShowStatus data={selectedData} />
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end">
                    <Button variant="contained" onClick={acceptHarvest}>
                      Accept Harvest
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <ShowStatus data={selectedData} />
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end">
                    <Button variant="contained" onClick={approveContract}>
                      Sign Contract
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Dialog>
      )}
    </Box>
  );
}

export default Buyer;
