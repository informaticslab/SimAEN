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

import { ReactNode } from "react";

import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import Divider from "@material-ui/core/Divider";
import {default as Grid, GridSize} from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";

import { diffForms, FormType } from "../../models";
import { values, SCALE } from "../../constants";
import { ComparisonColors } from "../../colors";


const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "auto",
    },

    // using InputLabel color="primary" not working
    "& label": {
      color: theme.palette.text.primary
    },
    margin: "auto",

    position: "sticky",
    top: '10px',
    maxHeight: 'calc(100vh - 20px)',
    overflowY: 'auto'
  },
  title: {
    fontWeight:'bold',
    color: theme.palette.text.hint
  },
 
  divider: {
    margin: '5px 0px'
  },

  en_subparam: {
    display: 'none'
  },

  column: {
    backgroundColor: ComparisonColors.A,
    alignSelf: 'stretch',

    '&.header': {
      color: 'white',
      backgroundColor: ComparisonColors.darkA,
    }
  },

  columnDiff: {
    borderStyle: 'solid',
    borderColor: 'red',    

    backgroundColor: ComparisonColors.A,
    alignSelf: 'stretch',

    '&.header': {
      color: 'white',
      backgroundColor: ComparisonColors.darkA,
    }
  },

  highlight: {
    backgroundColor: ComparisonColors.B
  }
}));

export type FormProps = {
  forms?: FormType[];
  children?: ReactNode
};

const TextColSize: {sm: GridSize, md: GridSize} = {sm: 12, md: 6};
const ValColSize: {sm: GridSize, md: GridSize} = {sm: 6, md: 3};

export default function Form({forms, children}: FormProps) {
  const classes = useStyles();

  const hideSubparams0 = forms?.[0]?.p_running_app === 0;
  const hideSubparams1 = forms?.[1]?.p_running_app === 0;
  const hideSubparams = hideSubparams0 && hideSubparams1;


  const lookup = (obj : Object, val : any) => {
  	let ret = "";
  	for (const [key, value] of Object.entries(obj)) {
	    if (value === val) {
	       return key; 
	    }
	}
	return ret;
  };


  const highlightColumnDiffs = (diff:boolean) =>
    clsx(classes.column, diff && classes.highlight);

  const formDiffs = diffForms(forms || []);

  return (
      <Paper className={classes.root}>
        <form noValidate autoComplete="off">
          <Grid container alignItems="center" spacing={2}>

            <Grid item {...TextColSize}>
              &nbsp;
            </Grid>
            <Grid item {...ValColSize} className={`${classes.column} color="textSecondary" `}>
              Scenario 1
            </Grid>
            <Grid item {...ValColSize} className={`${classes.column} color="textSecondary" `}>
              Scenario 2
            </Grid>

            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Population
              </Typography>
            </Grid>

            <Grid item {...TextColSize}>
	      <Tooltip title={values.starting_cases.Popover} placement="bottom-end">
                <InputLabel
                  id="label-starting-cases"
                >
		  {values.starting_cases.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.starting_cases)}>
                {(forms?.[0]?.starting_cases || 0) * SCALE}
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.starting_cases)}>
                {(forms?.[1]?.starting_cases || 0) * SCALE}
            </Grid>

            <Grid item {...TextColSize}>
	      <Tooltip title={values.interaction_level.Popover} placement="bottom-end">
                <InputLabel
                  id="label-interaction_level"
                  color="secondary">
		  {values.interaction_level.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.interaction_level)}>
                {forms?.[0]?.interaction_level ? values.interaction_level.titles[forms?.[0]?.interaction_level] : ""}
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.interaction_level)}>
                {forms?.[0]?.interaction_level ? values.interaction_level.titles[forms?.[1]?.interaction_level] : ""}
            </Grid>

            <Grid item {...TextColSize}>
	      <Tooltip title={values.p_vaccinated.Popover} placement="bottom-end">
                <InputLabel
                  id="label-p_vaccinated">
		  {values.p_vaccinated.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.p_vaccinated)}>
                {lookup(values.p_vaccinated, forms?.[0]?.p_vaccinated)} - {forms?.[0]?.p_vaccinated}%
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.p_vaccinated)}>
                {lookup(values.p_vaccinated, forms?.[1]?.p_vaccinated)} - {forms?.[1]?.p_vaccinated}%
            </Grid>

            <Grid item {...TextColSize}>
	      <Tooltip title={values.p_mask_given_norm.Popover} placement="bottom-end">
                <InputLabel
                  id="label-p_mask_given_norm">
		  {values.p_mask_given_norm.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.p_mask_given_norm)}>
                {lookup(values.p_mask_given_norm, forms?.[0]?.p_mask_given_norm)} - {forms?.[0]?.p_mask_given_norm}%
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.p_mask_given_norm)}>
                {lookup(values.p_mask_given_norm, forms?.[1]?.p_mask_given_norm)} - {forms?.[1]?.p_mask_given_norm}%
            </Grid>

            <Grid item {...TextColSize}>
	      <Tooltip title={values.test_delay.Popover} placement="bottom-end">
                <InputLabel
                  id="label-test-delay">
		  {values.test_delay.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.test_delay)}>
                {lookup(values.test_delay, forms?.[0]?.test_delay)} - {forms?.[0]?.test_delay} days
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.test_delay)}>
                {lookup(values.test_delay, forms?.[1]?.test_delay)} - {forms?.[1]?.test_delay} days
            </Grid>

            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Exposure Notification (EN)
              </Typography>
            </Grid>

            <Grid item {...TextColSize}>
	      <Tooltip title={values.p_running_app.Popover} placement="bottom-end">
                <InputLabel
                  id="label-p_running_app">
		  {values.p_running_app.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.p_running_app)}>
                {lookup(values.p_running_app, forms?.[0]?.p_running_app)} - {forms?.[0]?.p_running_app}%
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.p_running_app)}>
                {lookup(values.p_running_app, forms?.[1]?.p_running_app)} - {forms?.[1]?.p_running_app}%
            </Grid>

            <Grid item {...TextColSize} className={hideSubparams ? classes.en_subparam : undefined}>
	      <Tooltip title={values.risk_settings.Popover} placement="bottom-end">
                <InputLabel
                  id="label-risk_settings">
		  {values.risk_settings.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={hideSubparams ? classes.en_subparam : highlightColumnDiffs(formDiffs.risk_settings || hideSubparams0 !== hideSubparams1)}>
                {hideSubparams0 ? "" : lookup(values.risk_settings, forms?.[0]?.risk_settings)}&nbsp;
            </Grid>
            <Grid item {...ValColSize} className={hideSubparams ? classes.en_subparam : highlightColumnDiffs(formDiffs.risk_settings || hideSubparams0 !== hideSubparams1)}>
                {hideSubparams1 ? "" : lookup(values.risk_settings, forms?.[1]?.risk_settings)}&nbsp;
            </Grid>

            <Grid item {...TextColSize} className={hideSubparams ? classes.en_subparam : undefined}>
	      <Tooltip title={values.p_maximal_restriction_given_aen_notification.Popover} placement="bottom-end">
                <InputLabel
                  id="label-p_maximal_restriction_given_aen_notification">
		  {values.p_maximal_restriction_given_aen_notification.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={hideSubparams ? classes.en_subparam : highlightColumnDiffs(formDiffs.p_maximal_restriction_given_aen_notification || hideSubparams0 !== hideSubparams1)}>
                {hideSubparams0 ? "" : (lookup(values.p_maximal_restriction_given_aen_notification, forms?.[0]?.p_maximal_restriction_given_aen_notification) + " - " + (forms?.[0]?.p_maximal_restriction_given_aen_notification || "" )+ "%")} &nbsp;
            </Grid>
            <Grid item {...ValColSize} className={hideSubparams ? classes.en_subparam : highlightColumnDiffs(formDiffs.p_maximal_restriction_given_aen_notification || hideSubparams0 !== hideSubparams1)}>
                {hideSubparams1 ? "" : (lookup(values.p_maximal_restriction_given_aen_notification, forms?.[1]?.p_maximal_restriction_given_aen_notification) + " - " + (forms?.[1]?.p_maximal_restriction_given_aen_notification || "") + "%")} &nbsp;
            </Grid>

            <Grid item {...TextColSize} className={hideSubparams ? classes.en_subparam : undefined}>
	      <Tooltip title={values.key_upload_requires_call.Popover} placement="bottom-end">
                <InputLabel
                  id="label-key_upload_requires_call">
		  {values.key_upload_requires_call.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={hideSubparams ? classes.en_subparam : highlightColumnDiffs(formDiffs.key_upload_requires_call || hideSubparams0 !== hideSubparams1)}>
              {hideSubparams0 ? "" : forms?.[0]?.key_upload_requires_call ? "Yes" : "No"}&nbsp;
            </Grid>
            <Grid item {...ValColSize} className={hideSubparams ? classes.en_subparam : highlightColumnDiffs(formDiffs.key_upload_requires_call || hideSubparams0 !== hideSubparams1)}>
              {hideSubparams1 ? "" : forms?.[1]?.key_upload_requires_call ? "Yes" : "No"}&nbsp;
            </Grid>

            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Manual Contact Tracing
              </Typography>
            </Grid>

            <Grid item {...TextColSize}>
	      <Tooltip title={values.n_contact_tracers.Popover} placement="bottom-end">
                <InputLabel
                  id="label-contact-tracers">
		  {values.n_contact_tracers.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.n_contact_tracers)}>
                {(forms?.[0]?.n_contact_tracers || 0) * SCALE}
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.n_contact_tracers)}>
                {(forms?.[1]?.n_contact_tracers || 0) * SCALE}
            </Grid>

            <Grid item {...TextColSize}>
	      <Tooltip title={values.p_maximal_restriction_given_ph_call.Popover} placement="bottom-end">
                <InputLabel
                  id="label-p_maximal_restriction_given_ph_call">
		  {values.p_maximal_restriction_given_ph_call.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.p_maximal_restriction_given_ph_call)}>
                {lookup(values.p_maximal_restriction_given_ph_call, forms?.[0]?.p_maximal_restriction_given_ph_call)} - {forms?.[0]?.p_maximal_restriction_given_ph_call}%
            </Grid>
            <Grid item {...ValColSize} className={highlightColumnDiffs(formDiffs.p_maximal_restriction_given_ph_call)}>
                {lookup(values.p_maximal_restriction_given_ph_call, forms?.[1]?.p_maximal_restriction_given_ph_call)} - {forms?.[1]?.p_maximal_restriction_given_ph_call}%
            </Grid>

          </Grid>
        </form>
        {children}
      </Paper>
  );
}
