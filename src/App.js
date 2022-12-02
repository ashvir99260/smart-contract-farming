import logo from "./logo.svg";
import "./App.css";
import { Button } from "@mui/material";
import useMetaMask from "./context/MetaMaskContext";

function App() {
  const { connect, disconnect, isActive } = useMetaMask();

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={connect} variant="secondary">
          <img
            src="images/metamask.svg"
            alt="MetaMask"
            width="50"
            height="50"
          />{" "}
          Login
        </Button>
        {isActive && (
          <Button onClick={disconnect} variant="danger">
            Disconnect from MetaMask{" "}
            <img src="images/noun_waving_3666509.svg" height="50" width="50" />
          </Button>
        )}
      </header>
    </div>
  );
}

export default App;
