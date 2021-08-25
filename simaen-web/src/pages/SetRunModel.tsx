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

import React, { useEffect, useState } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { TabPanel, a11yProps } from "../components/TabPanel";

import Form from "../components/SetRunModel/Form";
import Cumulative from "../components/SetRunModel/Cumulative";
import { defaultForm } from "../constants";
import CumulativeByDay from "../components/SetRunModel/CumulativeByDay";
import BreakdownByDay from "../components/SetRunModel/BreakdownByDay";
import { CsvData } from "../components/CsvData";
import { CSVLink } from "react-csv";

import { FixedParamsPanel } from "../components/FixedParamsPanel";
import { FixedParams, FormType, SimulationResult } from "../models";
import { getData, getFixedParams } from "../api";

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

export default function SetRunModel() {
  const classes = useStyles();
  const [form, setForm] = React.useState<FormType>(defaultForm);

  const [tabState, setTabState] = useState(0);
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState<SimulationResult>();
  const [fixedParams, setFixedParams] = useState<FixedParams>();

  useEffect(() => {
    if (form !== undefined) {
      setBusy(true);
      getData(form)
        .then((resp) => setModel(resp))
        .finally(() => setBusy(false));
    }
  }, [form]);

  useEffect(() => {
      async function fetch(runConfigId: Number) {
          const fixedParams: FixedParams = await getFixedParams(runConfigId);
          setFixedParams(fixedParams);
      }
      if (model) {
        fetch(model.id);
      }
  }, [model])

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue !== 3) {
      setTabState(newValue);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={4}>
          <Form form={form} setForm={setForm}>
            {fixedParams !== undefined &&
              <FixedParamsPanel fixedParams={fixedParams} />
            }
          </Form>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h5" color="textPrimary">
            Analysis Quick Look
            {busy && <CircularProgress size={25} />}
          </Typography>
          <Tabs value={tabState} onChange={handleChange} aria-label="Quick Look Selection"
            textColor="primary" indicatorColor="primary"
            className={classes.tabs}>
            <Tab label="Cumulative" {...a11yProps(0)}/>
            <Tab label="Cumulative By Day" {...a11yProps(1)} />
            <Tab label="Breakdown By Day" {...a11yProps(2)} />
            <Tab label="Download CSV" component={CSVLink} filename={"simaen.csv"} data={CsvData(form, model, fixedParams).join("\n")} />
          </Tabs>
          <br/>
          <Typography color="textPrimary">Over {model?.infected?.length || 0} days of the model run, model averages were:</Typography>

          <TabPanel value={tabState} index={0}>
            <Cumulative model={model}></Cumulative>
          </TabPanel>
          <TabPanel value={tabState} index={1}>
            <CumulativeByDay model={model}></CumulativeByDay>
          </TabPanel>
          <TabPanel value={tabState} index={2}>
            <BreakdownByDay model={model}></BreakdownByDay>
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  );
}
