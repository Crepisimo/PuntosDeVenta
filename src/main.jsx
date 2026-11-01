import React from "react";
import ReactDOM from "react-dom/client";
import { AuthGate } from "./secureClient.jsx";
import App from "./POSCrepismoTichiAMB.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(AuthGate,{admin:false},React.createElement(App)));
