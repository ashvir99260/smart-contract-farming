import React, { useMemo } from "react";
import {
  BrowserRouter,
  Route,
  Navigate,
  Routes,
  useLocation,
} from "react-router-dom";

import Banker from "./page/banker";
import Farmer from "./page/farmer";
import FPO from "./page/fpo";
import Login from "./page/login";

import useMetaMask from "./context/MetaMaskContext";

import data from "./data/accountData.json";
import Buyer from "./page/buyer";
import Layout from "./components/Layout";
import Form from "./page/form";

const PrivateRoute = ({ children }) => {
  const { account } = useMetaMask();
  const location = useLocation();

  const validateUserRoute = useMemo(() => {
    if (account) {
      const accountData = data?.[account];
      if (accountData.route === location.pathname) {
        return true;
      }
    }
    return false;
  }, [location, account]);
  if (!validateUserRoute) {
    return <Navigate to="/login" />;
  }
  return <Layout>{children}</Layout>;
};

const routes = {
  ROOT: "/",
  LOGIN: "/login",
  FARMER: "/farmer",
  FPO: "/fpo",
  BANKER: "/banker",
  BUYER: "/buyer",
  FORM: "/form",
};

function Router() {
  const appRoutes = [
    {
      path: routes.ROOT,
      element: <Login />,
    },
    { path: routes.LOGIN, element: <Login /> },
    {
      path: routes.FARMER,
      element: (
        <PrivateRoute>
          <Farmer />
        </PrivateRoute>
      ),
    },
    {
      path: routes.FPO,
      element: (
        <PrivateRoute>
          <FPO />
        </PrivateRoute>
      ),
    },
    {
      path: routes.BANKER,
      element: (
        <PrivateRoute>
          <Banker />
        </PrivateRoute>
      ),
    },
    {
      path: routes.BUYER,
      element: (
        <PrivateRoute>
          <Buyer />
        </PrivateRoute>
      ),
    },
    {
      path: routes.FORM,
      element: <Form />,
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map((route, index) => (
          <Route {...route} key={index} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
