import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { persistor, store } from "./state/store";

import { PersistGate } from "redux-persist/integration/react";
import { setStoreInstance } from "./api/axios.instance";

// Import the setter from your axios instance file


// Set the store instance for axios usage
setStoreInstance(store);

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
