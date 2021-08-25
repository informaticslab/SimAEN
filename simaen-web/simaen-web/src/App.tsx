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

import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import { Route, Switch } from "react-router-dom";

import About from "./pages/About";
import SetRunModel from "./pages/SetRunModel";
import Compare from "./pages/Compare";
import ModelDetails from "./pages/ModelDetails";
import Glossary from "./pages/Glossary";
import FAQ from "./pages/FAQ";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  }
}));

export const intFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0    
});
export const formatInt = (value: number | undefined): string =>  {
  if (value === undefined) {
    return '';
  }
  return intFormatter.format(value);
}

export const floatFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
export const formatFloat = (value: number | undefined): string => {
  if (value === undefined) {
    return '';
  }
  return floatFormatter.format(value);
}

export const intDeltaFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  signDisplay: 'always'
});
export const formatIntDelta = (value: number | undefined): string =>  {
  if (value === undefined) {
    return '';
  }
  return intDeltaFormatter.format(value);
}

export const floatDeltaFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'always'
});
export const formatFloatDelta = (value: number | undefined): string =>  {
  if (value === undefined) {
    return '';
  }
  return floatDeltaFormatter.format(value);
}

export const Mailto = {
   email: 'simaen@ll.mit.edu',
   subject: 'SimAEN WebApp'
}

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Switch>
          <Route exact path='/'>
            <About/>
          </Route>
          <Route exact path='/model'>
            <SetRunModel/>
          </Route>
          <Route exact path='/compare'>
            <Compare />
          </Route>
          <Route exact path='/faq'>
            <FAQ/>
          </Route>
          <Route exact path='/details'>
            <ModelDetails/>
          </Route>
          <Route exact path='/glossary'>
            <Glossary/>
          </Route>
        </Switch> 
    </div>
  );
}

export default App;
