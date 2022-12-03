import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import useMetaMask from "../../context/MetaMaskContext";
import FarmerContract from "../../artifacts/contracts/FarmerIcsContract.sol/FarmerIcsContract.json";

const farmerContractAddress = "0x1dD8629e4e4e659CB10344a063847fc5bc29c25C";
const fpoContractAddress = "0xe9817a5D9c02EeA1C2329D94E3799B539CdfD519";

function Banker() {
  const { library: web3 } = useMetaMask();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [web3]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        FarmerContract.abi,
        farmerContractAddress
      );

      contract.methods
        .getDetails2()
        .call()
        .then((res) => {
          const result = Object.assign({}, res);
          setData([
            { id: "0x1dD8629e4e4e659CB10344a063847fc5bc29c25C", ...result },
          ]);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        <Button variant="contained" color="secondary">
          View Details
        </Button>
      ),
      flex: 1,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <DataGrid loading={loading} rows={data} columns={columns} />
    </Box>
  );
}

export default Banker;
