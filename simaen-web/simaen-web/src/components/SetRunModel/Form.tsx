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

import React, {ReactNode, useContext} from "react";

import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Divider from "@material-ui/core/Divider";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

import { FormType } from "../../models";
import { SCALE, values, button_labels } from "../../constants";

import {ComparisonContext} from "../../context/ComparisonProvider";

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
  }

}));

export type FormProps = {
  form?: FormType;
  setForm?: (value: FormType) => void;
  children?: ReactNode
};

export default function Form(props: FormProps) {
  const classes = useStyles();
  
  const {compareForms, setCompareForms} = useContext(ComparisonContext);
  
  const state = props?.form;
  const hideSubparams = state?.p_running_app === 0;

  function updateForm<K extends keyof FormType, V extends FormType[K]>(key: K, value: V) {
    if (props.setForm && props.form) {
      props.setForm({
        ...props.form,
        [key]: value
      })
    }
  }

  const handleCompareClick = () => {
    if (state && compareForms.length < 2) {
      // limit forms to two max
      setCompareForms([...compareForms.slice(0, 1), state]);
    } else {
      setCompareForms([]);
    }
  };	

  const chooseLabel = () => {
    if (compareForms.length === 2) {
      return button_labels.clear_comparison;
    }
    return button_labels.add_to_comparison;
  }

  return (
      <Paper className={classes.root}>
        <form noValidate autoComplete="off">
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h5">Set and Run Model</Typography>
            </Grid>

            <Grid item xs={6}>
              <Button variant="outlined" onClick={handleCompareClick}>{chooseLabel()}</Button>
            </Grid>

            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Population
              </Typography>
            </Grid>

            <Grid item md={6} sm={12}>
	      <Tooltip title={values.starting_cases.Popover} placement="bottom-end">
                <InputLabel
                  id="label-starting-cases"
                  htmlFor="input-starting-cases"
                >
                  {values.starting_cases.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12}>
                <Select
                  variant="outlined"
                  native
                  fullWidth
                  labelId="label-starting-cases"
                  inputProps={{
                    name: "starting_cases",
                    id: "input-starting-cases",
                  }}
                  value={state?.starting_cases}
                  onChange={(e) => updateForm("starting_cases", parseInt(e.target.value as string, 10))}
                >
                  <option value={values.starting_cases.Low}>
                    Low - {values.starting_cases.Low * SCALE}
                  </option>
                  <option value={values.starting_cases.Medium}>
                    Medium - {values.starting_cases.Medium * SCALE}
                  </option>
                  <option value={values.starting_cases.High}>
                    High - {values.starting_cases.High * SCALE}
                  </option>
                </Select>
            </Grid>

            <Grid item md={6} sm={12}>
	      <Tooltip title={values.interaction_level.Popover} placement="bottom-end">
                <InputLabel
                  id="label-interaction_level"
                  htmlFor="input-interaction_level"
                  color="secondary">
                  {values.interaction_level.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12}>
                <Select
                  variant="outlined"
                  native
                  fullWidth
                  labelId="label-interaction_level"
                  inputProps={{
                    name: "interaction_level",
                    id: "input-interaction_level",
                  }}
                  value={state?.interaction_level}
                  onChange={(e) => updateForm("interaction_level", e.target.value as string)}
                >
                  <option value={values.interaction_level.Low}>
                    {values.interaction_level.titles.low}
                  </option>
                  <option value={values.interaction_level.Medium}>
                    {values.interaction_level.titles.medium}
                  </option>
                  <option value={values.interaction_level.High}>
                    {values.interaction_level.titles.high}
                  </option>
                </Select>
            </Grid>

            <Grid item md={6} sm={12}>
	      <Tooltip title={values.p_vaccinated.Popover} placement="bottom-end">
                <InputLabel
                  id="label-p_vaccinated"
                  htmlFor="input-p_vaccinated">
                  {values.p_vaccinated.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12}>
                <Select
                  variant="outlined"
                  native
                  fullWidth
                  labelId="label-p_vaccinated"
                  inputProps={{
                    name: "p_vaccinated",
                    id: "input-p_vaccinated",
                  }}
                  value={state?.p_vaccinated}
                  onChange={(e) => updateForm("p_vaccinated", parseInt(e.target.value as string, 10))}
                >
                  <option value={values.p_vaccinated.Low}>
                    Low - {values.p_vaccinated.Low}%
                  </option>
                  <option value={values.p_vaccinated.Medium}>
                    Medium - {values.p_vaccinated.Medium}%
                  </option>
                  <option value={values.p_vaccinated.High}>
                    High - {values.p_vaccinated.High}%
                  </option>
                </Select>
            </Grid>


            <Grid item md={6} sm={12}>
	      <Tooltip title={values.p_mask_given_norm.Popover} placement="bottom-end">
                <InputLabel
                  id="label-p_mask_given_norm"
                  htmlFor="input-p_mask_given_norm">
		  {values.p_mask_given_norm.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12}>
                <Select
                  variant="outlined"
                  native
                  fullWidth
                  labelId="label-p_mask_given_norm"
                  inputProps={{
                    name: "p_mask_given_norm",
                    id: "input-p_mask_given_norm",
                  }}
                  value={state?.p_mask_given_norm}
                  onChange={(e) => updateForm("p_mask_given_norm", parseInt(e.target.value as string, 10))}
                >
                  <option value={values.p_mask_given_norm.Low}>
                    Low - {values.p_mask_given_norm.Low}%
                  </option>
                  <option value={values.p_mask_given_norm.Medium}>
                    Medium - {values.p_mask_given_norm.Medium}%
                  </option>
                  <option value={values.p_mask_given_norm.High}>
                    High - {values.p_mask_given_norm.High}%
                  </option>
                </Select>
            </Grid>

            <Grid item md={6} sm={12}>
	      <Tooltip title={values.test_delay.Popover} placement="bottom-end">
                <InputLabel
                  id="label-test-delay"
                  htmlFor="input-test-delay">
		  {values.test_delay.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12}>
                <Select
                  variant="outlined"
                  native
                  fullWidth
                  labelId="label-test-delay"
                  name="test_delay"
                  id="input-test-delay"
                  value={state?.test_delay}
                  onChange={(e) => updateForm("test_delay", parseInt(e.target.value as string, 10))}
                >
                  <option value={values.test_delay.Low}>
                    Low - {values.test_delay.Low} days
                  </option>
                  <option value={values.test_delay.Medium}>
                    Medium - {values.test_delay.Medium} days
                  </option>
                  <option value={values.test_delay.High}>
                    High - {values.test_delay.High} days
                  </option>
                </Select>
            </Grid>

            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Exposure Notification (EN)
              </Typography>
            </Grid>

            <Grid item md={6} sm={12}>
	      <Tooltip title={values.p_running_app.Popover} placement="bottom-end">
                <InputLabel
                  id="label-p_running_app"
                  htmlFor="input-p_running_app">
		  {values.p_running_app.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12}>
                <Select
                  variant="outlined"
                  native
                  fullWidth
                  labelId="label-p_running_app"
                  name="p_running_app"
                  id="input-p_running_app"
                  value={state?.p_running_app}
                  onChange={(e) => updateForm("p_running_app", parseInt(e.target.value as string, 10))}
                >
                  <option value={values.p_running_app.None}>
                    None - {values.p_running_app.None}%
                  </option>
                  <option value={values.p_running_app.Low}>
                    Low - {values.p_running_app.Low}%
                  </option>
                  <option value={values.p_running_app.Medium}>
                    Medium - {values.p_running_app.Medium}%
                  </option>
                  <option value={values.p_running_app.High}>
                    High - {values.p_running_app.High}%
                  </option>
                </Select>
            </Grid>

	    <Grid item md={6} sm={12} className={hideSubparams ? classes.en_subparam : undefined}>
	      <Tooltip title={values.risk_settings.Popover} placement="bottom-end">
                <InputLabel
                  id="label-risk_settings"
                  htmlFor="input-risk_settings">
                  {values.risk_settings.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12} className={hideSubparams ? classes.en_subparam : undefined}>
                <Select
                  variant="outlined"
                  native
                  fullWidth
                  labelId="label-risk_settings"
                  name="risk_settings"
                  id="input-risk_settings"
                  value={state?.risk_settings}
                  onChange={(e) => updateForm("risk_settings", e.target.value as string)}
                >
                  <option value={values.risk_settings.Narrow}>
                    Narrow
                  </option>
                  <option value={values.risk_settings.Medium}>
                    Medium
                  </option>
                  <option value={values.risk_settings.Wide}>
                    Wide
                  </option>
                </Select>
            </Grid>

            <Grid item md={6} sm={12} className={hideSubparams ? classes.en_subparam : undefined}>
	      <Tooltip title={values.p_maximal_restriction_given_aen_notification.Popover} placement="bottom-end">
                <InputLabel
                  id="label-p_maximal_restriction_given_aen"
                  htmlFor="input-p_maximal_restriction_given_aen">
		  {values.p_maximal_restriction_given_aen_notification.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12} className={hideSubparams ? classes.en_subparam : undefined}>
                <Select
                  variant="outlined"
                  native
                  fullWidth
                  id="input-p_maximal_restriction_given_aen"
                  labelId="label-p_maximal_restriction_given_aen"
                  name="p_maximal_restriction_given_aen"
                  value={state?.p_maximal_restriction_given_aen_notification}
                  onChange={(e) => updateForm("p_maximal_restriction_given_aen_notification", parseInt(e.target.value as string, 10))}
                >
                  <option value={values.p_maximal_restriction_given_aen_notification.Low}>
                    Low - {values.p_maximal_restriction_given_aen_notification.Low}%
                  </option>
                  <option value={values.p_maximal_restriction_given_aen_notification.High}>
                    High - {values.p_maximal_restriction_given_aen_notification.High}%
                  </option>
                </Select>
            </Grid>

            <Grid item md={6} sm={12} className={hideSubparams ? classes.en_subparam : undefined}>
	      <Tooltip title={values.key_upload_requires_call.Popover} placement="bottom-end">
                <InputLabel
                  id="label-key_upload_requires_call"
                  htmlFor="input-key_upload_requires_call">
		  {values.key_upload_requires_call.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12} className={hideSubparams ? classes.en_subparam : undefined}>
              <Switch
                checked={state?.key_upload_requires_call || false}
                onChange={(e) => updateForm("key_upload_requires_call", e.target.checked)}
                color="primary"
                name="key_upload_requires_call"
                id="input-key_upload_requires_call"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Manual Contact Tracing
              </Typography>
            </Grid>

            <Grid item md={6} sm={12}>
	      <Tooltip title={values.n_contact_tracers.Popover} placement="bottom-end">
                <InputLabel
                  id="label-contact-tracers"
                  htmlFor="input-contact-tracers">
		  {values.n_contact_tracers.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12}>
                <Select
                  variant="outlined"
                  native
                  fullWidth
                  labelId="label-contact-tracers"
                  inputProps={{
                    name: "n_contact_tracers",
                    id: "input-contact-tracers",
                  }}
                  value={state?.n_contact_tracers}
                  onChange={(e) => updateForm("n_contact_tracers", parseInt(e.target.value as string, 10))}
                >
                  <option value={values.n_contact_tracers.Low}>
                    Low - {values.n_contact_tracers.Low * SCALE}
                  </option>
                  <option value={values.n_contact_tracers.Medium}>
                    Medium - {values.n_contact_tracers.Medium * SCALE}
                  </option>
                </Select>
            </Grid>

            <Grid item md={6} sm={12}>
	      <Tooltip title={values.p_maximal_restriction_given_ph_call.Popover} placement="bottom-end">
                <InputLabel
                  id="label-p_maximal_restriction_given_ph"
                  htmlFor="input-p_maximal_restriction_given_ph">
		  {values.p_maximal_restriction_given_ph_call.Label}
                </InputLabel>
	      </Tooltip>
            </Grid>
            <Grid item md={6} sm={12}>
                <Select
                  variant="outlined"
                  native
                  fullWidth
		  id="input-p_maximal_restriction_given_ph"
                  labelId="label-p_maximal_restriction_given_ph"
                  name="p_maximal_restriction_given_ph"
                  value={state?.p_maximal_restriction_given_ph_call}
                  onChange={(e) => updateForm("p_maximal_restriction_given_ph_call", parseInt(e.target.value as string, 10))}
                >
                  <option value={values.p_maximal_restriction_given_ph_call.Low}>
                    Low - {values.p_maximal_restriction_given_ph_call.Low}%
                  </option>
                  <option value={values.p_maximal_restriction_given_ph_call.High}>
                    High - {values.p_maximal_restriction_given_ph_call.High}%
                  </option>
                </Select>
            </Grid>
          </Grid>
        </form>
        {props.children}
      </Paper>
  );
}
