import React from "react";

import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";

import Router from "./Router";

import { MetaMaskProvider } from "./context/MetaMaskContext";

import "./App.css";

function getLibrary(provider, connector) {
  return new Web3(provider);
}

function App() {
  return (
    <div className="App">
      <Web3ReactProvider getLibrary={getLibrary}>
        <MetaMaskProvider>
          <Router />
        </MetaMaskProvider>
      </Web3ReactProvider>
    </div>
  );
}

export default App;
