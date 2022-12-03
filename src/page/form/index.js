import React, { useState } from "react";
import axios from "axios";
import lighthouse from "@lighthouse-web3/sdk";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";

function Form() {
  // const { library } = useMetaMask();
  const [open, setOpen] = useState(false);
  const [txHash, setTxHash] = useState("");

  const sign_message = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const res = await axios.get(
      `https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`
    );
    const message = res.data;
    const signedMessage = await signer.signMessage(message);
    return {
      message: message,
      signedMessage: signedMessage,
      address: address,
    };
  };

  const encryptionSignature = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return signedMessage;
  };

  /* Deploy file along with encryption */
  const deployEncrypted = async (e) => {
    // Get bearer token
    console.log();
    const signingResponse = await sign_message();
    const accessToken = (
      await axios.post(
        `https://api.lighthouse.storage/api/auth/verify_signer`,
        {
          publicKey: signingResponse.address,
          signedMessage: signingResponse.signedMessage,
        }
      )
    ).data.accessToken;

    const publicKey = signingResponse.address;

    /*
       uploadEncrypted(e, publicKey, accessToken)
       - e: js event
       - publicKey: wallets public key
       - accessToken: token to upload
       - signedMessage: message signed by owner of publicKey
    */
    const encryptionSignatureData = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      e,
      publicKey,
      accessToken,
      encryptionSignatureData
    );
    console.log(response);
    if (response?.data?.Hash) {
      setOpen(true);
      setTxHash(response.data.Hash);
    }
    /*
      output:
        {
          Name: "main-qimg-6282220880e320c7889fec27a20e2eee-lq.jpg",
          Size: "44561",
          Hash: "QmcnzVoLcFcLzwUyjgtVmf2JQbPL5gbffNhjQFxre8aYvU"
        }
      Note: Hash in response is CID.
    */
  };

  // snackbar code
  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

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
        <Stack direction="row" spacing={4}>
          <TextField
            size="small"
            id="estimated-max-price"
            type="file"
            fullWidth
            //   value={name}
            onChange={(e) => deployEncrypted(e)}
          />
        </Stack>

        <Button style={{ marginTop: "2rem" }} variant="contained">
          Submit
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Success!! Access file here:{" "}
            <a
              href={`https://files.lighthouse.storage/viewFile/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
}

export default Form;
