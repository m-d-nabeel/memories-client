import ReactDOM from "react-dom/client";
// Browser router in vite to handle anything in
// project related to react-router-dom
import { Provider } from "react-redux";
import { applyMiddleware, compose, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import reducers from "./reducers";
import "./main.css";

const store = legacy_createStore(reducers, compose(applyMiddleware(thunk)));
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </Provider>
);
