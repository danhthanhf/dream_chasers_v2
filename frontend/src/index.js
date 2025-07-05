import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import GlobalStyles from "./component/globalStyles";
import { Toaster } from "sonner";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <GlobalStyles>
            <Router>
                <App />
                <Toaster position="top-center" richColors />
            </Router>
        </GlobalStyles>
    </Provider>

    // {/* </React.StrictMode> */}
);
