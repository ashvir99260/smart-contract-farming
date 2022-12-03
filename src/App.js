import React from "react";

import { ToastContainer } from "react-toastify";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";

import Router from "./Router";

import { MetaMaskProvider } from "./context/MetaMaskContext";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function getLibrary(provider, connector) {
  return new Web3(provider);
}

function App() {
  return (
    <div className="App">
      <Web3ReactProvider getLibrary={getLibrary}>
        <MetaMaskProvider>
          <ToastContainer
            position="bottom-left"
            autoClose={15000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Router />
        </MetaMaskProvider>
      </Web3ReactProvider>
    </div>
  );
}

export default App;
