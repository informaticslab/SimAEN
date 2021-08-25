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

import { Link as RouterLink } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Mailto } from "./App";
import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles({
  appbar: {
    paddingTop: '20px'
  },

  menuButton: {
    fontWeight: 700,
    marginLeft: "38px",
  },

  toolbar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0e5f6b",
  }
});

export default function Footer() {
  const classes = useStyles();

  return (
    <footer>
      <AppBar position="relative" className={classes.appbar}>
        <Grid
          container
          direction="row"
          justify="space-evenly"
        >
          <Grid item xs={2}/>
          <Grid item xs={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              About SimAEN
            </Typography>
            <Typography variant="body2" component="p" paragraph>
The Massachusetts Institute of Technology Lincoln Laboratory (MIT LL) has developed SimAEN: a free, publicly available, online tool to help state and local public health planners and decision makers explore the trade-offs between different non-pharmaceutical interventions (NPIs) on COVID disease spread, and the most effective ways to align and integrate them. It aims to help public health professionals quickly answer questions about workflows, policies, and resource impacts to guide decision-making in the face of evolving circumstances.
            </Typography>
            <Typography variant="body2" component="p" paragraph>
© 2021 LINCOLN LABORATORY, MASSACHUSETTS INSTITUTE OF TECHNOLOGY
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="h5" gutterBottom>
              Site Map
            </Typography>
            <Link
              to="/model"
              color="inherit"
              variant="body2"
              underline="always"
              component={RouterLink}
            >
              Set & Run Model
            </Link>
            <br/>
            <Link
              to="/glossary"
              color="inherit"
              variant="body2"
              underline="always"
              component={RouterLink}
            >
              Glossary
            </Link>
            <br/>
            <Link
              to="/details"
              color="inherit"
              variant="body2"
              underline="always"
              component={RouterLink}
            >
              Model Details
            </Link>
            <br/>
            <Link
              href={process.env.PUBLIC_URL + '/SimAEN_User_Guide_Quick_Start.pdf'}
              target="_blank"
              color="inherit"
              variant="body2"
              underline="always"
            >
              User Guide
            </Link>
            <br/>
            <Link
              to="/faq"
              color="inherit"
              variant="body2"
              underline="always"
              component={RouterLink}
            >
              Frequently Asked Questions
            </Link>            
            <br/><br/>
            <Typography>
            <Button variant="contained" color="secondary" startIcon={<MailIcon/>} href={`mailto:${Mailto.email}?subject=${Mailto.subject}`}>
              Share your feedback
            </Button>
            </Typography>
            <br/>
            <br/>

          </Grid>
        </Grid>
      </AppBar>
    </footer>
  );
}
