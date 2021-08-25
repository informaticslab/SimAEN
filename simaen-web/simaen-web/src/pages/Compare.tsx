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

import React, { useEffect, useState, useContext } from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tabs from "@material-ui/core/Tabs";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { ComparisonContext } from "../context/ComparisonProvider";

import { TabPanel, a11yProps } from "../components/TabPanel";

import Form from "../components/Compare/Form";
import Cumulative from "../components/Compare/Cumulative";

import { CsvDataCompare } from "../components/CsvData";
import { CSVLink } from "react-csv";


import { getData, getFixedParams } from "../api";
import { FixedParams, SimulationResult } from "../models";
import { FixedParamsPanel } from "../components/FixedParamsPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '15px'
  },

  tabs: {
    "& button": {
      color: theme.palette.text.primary
    }
  }
}));

export default function Compare() {
  const classes = useStyles();
  const {compareForms} = useContext(ComparisonContext);
  
  const [tabState, setTabState] = useState(0);
  const [busy, setBusy] = useState(false);

  const [compareResults, setCompareResults] = useState<(SimulationResult|undefined)[]>(new Array(2));
  const [fixedParams, setFixedParams] = useState<FixedParams>();

  useEffect(() => {
    if (compareForms !== undefined) {
      setBusy(true);
      const first = getData(compareForms[0])
        .then((resp) => setCompareResults((prev) => [resp, prev[1]]));
      const second = getData(compareForms[1])
        .then((resp) => setCompareResults((prev) => [prev[0], resp]));

      Promise.all([first, second]).finally(() => setBusy(false));

    }
  }, [compareForms]);


  useEffect(() => {
    async function fetch(runConfigId: Number) {
        const fixedParams: FixedParams = await getFixedParams(runConfigId);
        setFixedParams(fixedParams);
    }
    if (compareResults?.[0] !== undefined) {
      fetch(compareResults[0].id);
    }
  }, [compareResults])

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue !== 1) {
      setTabState(newValue);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={4}>
          <Form forms={compareForms}>
            {fixedParams !== undefined &&
              <FixedParamsPanel fixedParams={fixedParams} />
            }
          </Form>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h5" color="textPrimary">
          Compare Models
            {busy && <CircularProgress size={25} />}
          </Typography>
          <Tabs value={tabState} onChange={handleTabChange} aria-label="Quick Look Selection"
            textColor="primary" indicatorColor="primary"
            className={classes.tabs}>
            <Tab label="Cumulative" {...a11yProps(0)}/>
            <Tab label="Download CSV" component={CSVLink} filename={"simaen.csv"} data={CsvDataCompare(compareForms, compareResults, fixedParams).join("\n")} />
          </Tabs>
          <br/>

          <TabPanel value={tabState} index={0}>
            <Cumulative models={compareResults}></Cumulative>
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  );
}

