import { useCallback, useEffect, useState } from "react";

import useMetaMask from "../context/MetaMaskContext";
import FarmerContract from "../artifacts/contracts/FarmerIcsContract.sol/FarmerIcsContract.json";

const useFetchContractDetails = () => {
  const { library } = useMetaMask();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiCall, setApiCall] = useState(false);

  useEffect(() => {
    if (apiCall) {
      fetchData();
    }

    return () => {
      setLoading(false);
      setApiCall(false);
    };
  }, [library]);

  const fetchData = useCallback(
    async (address) => {
      if (!address) return;
      if (library) {
        try {
          setLoading(true);
          const contract = new library.eth.Contract(
            FarmerContract.abi,
            address
          );

          contract.methods
            .getDetails2()
            .call()
            .then((res) => {
              const result = Object.assign({}, res);
              setData([{ id: address, ...result }]);
            });
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
          setApiCall(false);
        }
      } else {
        setApiCall(true);
        setLoading(true);
      }
    },
    [library]
  );

  return { data, loading, fetchData };
};

export default useFetchContractDetails;
