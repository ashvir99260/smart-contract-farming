import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";

import { injected } from "./wallet/injected";

import data from "../data/tokenData.json";

export const MetaMaskContext = React.createContext(null);

export const MetaMaskProvider = ({ children }) => {
  const { activate, account, active, deactivate, library } = useWeb3React();

  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  // Init Loading
  useEffect(() => {
    connect().then((val) => {
      setIsLoading(false);
    });
  }, []);

  const handleIsActive = useCallback(() => {
    setIsActive(active);
  }, [active]);

  useEffect(() => {
    handleIsActive();
  }, [handleIsActive]);

  useEffect(() => {
    if (library) {
      fetchBalance();
    }
  }, [library]);

  const fetchBalance = async () => {
    if (library) {
      // Get ERC20 Token contract instance
      let contract = new library.eth.Contract(data.minABI, data.tokenAddress);
      // Call balanceOf function
      await contract.methods
        .balanceOf(account)
        .call()
        .then((balance) => {
          setBalance(library.utils.fromWei(balance));
        });
    }
  };

  // Connect to MetaMask wallet
  const connect = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  };

  // Disconnect from Metamask wallet
  const disconnect = async () => {
    try {
      await deactivate();
    } catch (error) {
      console.log("Error on disconnecting: ", error);
    }
  };

  const values = useMemo(
    () => ({
      isActive,
      account,
      isLoading,
      connect,
      disconnect,
      library,
      balance,
      fetchBalance,
    }),
    [isActive, isLoading, account, library, balance]
  );

  return (
    <MetaMaskContext.Provider value={values}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export default function useMetaMask() {
  const context = React.useContext(MetaMaskContext);

  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }

  return context;
}
