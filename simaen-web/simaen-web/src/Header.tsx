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

import React, {useContext} from "react";

import { Link as RouterLink } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";

import AssessmentIcon from '@material-ui/icons/Assessment';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import {ComparisonContext} from "./context/ComparisonProvider";

const useStyles = makeStyles(() => ({
  toolbar: {
    color: 'white',
    "& a": {
      fontWeight: 600,
    }
  },

  title: {
    fontWeight: 700
  },

  spacer: {
    marginLeft: 'auto'
  },

  center: {
    //margin: '0 auto',
    marginLeft: 'auto',

    "& a": {
      margin: '5px'
    }
  }
}));

export default function Header() {
  const classes = useStyles();
  const {compareForms} = useContext(ComparisonContext);

  const chooseCompareColor = () => {
    if (compareForms.length === 2) {
      return "secondary";
    }
    return "inherit";
  }

  return (
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Button
             color="inherit"
             to="/"
             component={RouterLink}
          >
            <img src={process.env.PUBLIC_URL + '/logo.png'} height="48px" width="131px" alt="simAEN Logo"></img>
            beta
          </Button>
          <span className={classes.center}>
            <Button
              to="/model"
              component={RouterLink}
              variant="contained"
              color="secondary"
              startIcon={<AssessmentIcon/>}
            >
              Set & Run Model
            </Button>
            <Button
              color={chooseCompareColor()}
              to="/compare"
              variant="contained"
              component={RouterLink}
              startIcon={<CompareArrowsIcon/>}
              disabled={compareForms.length !== 2}
            >
              Compare
            </Button>
          </span>
          <span className={classes.spacer} />
          <Button
            color="inherit"
            to="/glossary"
            component={RouterLink}
          >
            Glossary
          </Button>
          <Button
            color="inherit"
            to="/details"
            component={RouterLink}
          >
            Model Details
          </Button>
          <Button
            color="inherit"
            href={process.env.PUBLIC_URL + '/SimAEN_User_Guide_Quick_Start.pdf'}
            target="_blank"
          >
            User Guide
          </Button>          
          <Button
            color="inherit"
            to="/faq"
            component={RouterLink}
          >
            FAQ
          </Button>
        </Toolbar>
      </AppBar>
  );
}
