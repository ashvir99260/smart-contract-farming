import React from "react";
import {
  BrowserRouter,
  Route,
  Switch,
  redirect,
  Navigate,
  Routes,
} from "react-router-dom";

import Banker from "./page/banker";
import Farmer from "./page/farmer";
import FPO from "./page/fpo";
import Login from "./page/login";

import useMetaMask from "./context/MetaMaskContext";

const PrivateRoute = ({ children }) => {
  const { account } = useMetaMask();
  if (!account) {
    return redirect(routes.LOGIN);
  }
  return children;
};

function RouteValidator(props) {
  const { isPrivate, isCacheRoute, ...rest } = props;

  if (isPrivate) {
    return (
      <PrivateRoute>
        <Route {...rest} />
      </PrivateRoute>
    );
  }
  return <Route {...rest} />;
}

const routes = {
  ROOT: "/",
  LOGIN: "/login",
  FARMER: "/farmer",
  FPO: "/fpo",
  BANKER: "/banker",
};

function Router() {
  const appRoutes = [
    { path: routes.ROOT, element: <Login /> },
    { path: routes.LOGIN, element: <Login /> },
    { path: routes.FARMER, element: <Farmer />, isPrivate: true },
    { path: routes.FPO, element: <FPO />, isPrivate: true },
    { path: routes.BANKER, element: <Banker />, isPrivate: true },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map((route, index) => (
          <Route {...route} key={index} />
          // <RouteValidator key={index} {...route} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
