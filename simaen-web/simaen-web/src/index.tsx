/*
# DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

# This material is based upon work supported under Air Force Contract No. FA8702-15-D-0001.
# Any opinions,findings, conclusions or recommendations expressed in this material are those
# of the author(s) and do not necessarily reflect the views of the Centers for Disease Control.

# (c) 2021 Massachusetts Institute of Technology.

# The software/firmware is provided to you on an As-Is basis

# Delivered to the U.S. Government with Unlimited Rights, as defined in DFARS Part 252.227-7013
# or 7014 (Feb 2014). Notwithstanding any copyright notice, U.S. Government rights in this work
# are defined by DFARS 252.227-7013 or DFARS 252.227-7014 as detailed above. Use of this work
# other than as specifically authorized by the U.S. Government may violate any copyrights that
# exist in this work.

# Copyright (c) 2021 Massachusetts Institute of Technology
# SPDX short identifier: MIT

# Developed as part of: SimAEN, 2021
*/

import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import Header from "./Header";
import Footer from "./Footer";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import ComparisonProvider from "./context/ComparisonProvider";

const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#0D616E",
    },
    secondary: {
      main: "#f9c838",
    },
    text: {
      primary: "#0a4952",
      secondary: "rgba(63,63,63,1.0)",
      hint: "#555562" // used for section headers
    },
    background: {
      default: "#f8f9fa"
    },
  },
  typography: {
    fontFamily: "Overpass",
    h5: {
      fontSize: '1.85rem',
      fontWeight: 600
    }
  }
});

theme.overrides = {
  // outlined select padding is a bit excessive
  MuiSelect: {
    outlined: {
      padding: '9px 7px'
    }
  },

  // don't uppercase button / tab text
  MuiButton: {
    containedSecondary: {
      textTransform: 'none',
      color: theme.palette.text.primary
    }
  },
  MuiTab: {
    wrapper: {
      textTransform: 'none',
      fontWeight: 'bold'
    }
  },
  MuiTooltip: {
    tooltip: {
      // stole from Hint styling
      borderRadius: '4px',
      padding: '7px 10px',
      fontSize: 12,
      backgroundColor: '#3a3a48',
      boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
      color: '#fff', // text color
      textAlign: 'left',
    }
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <ComparisonProvider>
          <Header />
          <App />
          <Footer />
        </ComparisonProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
