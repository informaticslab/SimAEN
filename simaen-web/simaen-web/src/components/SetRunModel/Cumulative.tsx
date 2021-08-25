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

import React, { useMemo } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {LabeledBar} from "../LabeledBar";
import { formatInt, formatFloat } from "../../App";
import { results } from "../../constants";
import { InfectionColors, TestColors } from "../../colors";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Brightness1Icon from '@material-ui/icons/Brightness1';

import { SimulationResult, accumulate,
  sumTotalTests, sumTotalCalls,
  sumTotalQuarantines, sumTotalNegative, 
  sumTotalPositive, sumTotalPositiveSymptomatic, 
  sumTotalPositiveAsymptomatic, percentsInfected, Infected } from "../../models";

import { ResponsivePie } from "@nivo/pie";
import { BasicTooltip } from "@nivo/tooltip"

const useStyles = makeStyles((theme) => ({
  root: {
    "&> .MuiGrid-item" : {
      padding: '14px'
    }
  },
  title: {
    fontWeight:'bold',
    color: theme.palette.text.hint
  },

  inline: {
    display: 'inline-block'
  },

  inlineTitle: {
    display: 'inline-block',
    paddingLeft: 15,
    fontWeight:'bold'
  },

  seriesLabel: {
    paddingRight: 10,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },

  seriesLabelRight: {
    textAlign: 'right',
    padding: '5px',
    fontSize: '.85rem',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },

  indent: {
    paddingLeft: '15px !important'
  },

  card: {
    height: '100%'
  },

  legend: {
    margin: '5px',
    paddingLeft: '0px',
    listStyle: 'none',

    '& li': {
      display: 'flex',
      alignItems: 'flex-start',
      fontSize: 13,
      paddingRight: '5px',
      whiteSpace: 'nowrap'
    }
  },

  bullet: {
    transform: 'translate(-4px, 2px)',
    fontSize: 'medium'
  },

}));

export type CumulativeProps = {
  model: SimulationResult | undefined
}

export default function Cumulative({model}: CumulativeProps) {
  const classes = useStyles();
  const Bullet = (props:{color:string}) => <Brightness1Icon className={classes.bullet} style={{color: props.color}}/>;

  const cumulativeResult = useMemo(() => model ? accumulate(model) : undefined, [model]);
  
  const totalCalls = sumTotalCalls(cumulativeResult);
  const totalTests = sumTotalTests(cumulativeResult);
  const totalQuarantines = sumTotalQuarantines(cumulativeResult);
  const totalNeg = sumTotalNegative(cumulativeResult);
  const totalPos = sumTotalPositive(cumulativeResult);
  const totalPosSym = sumTotalPositiveSymptomatic(cumulativeResult);
  const totalPosAsym = sumTotalPositiveAsymptomatic(cumulativeResult);

  const percent_infected: Infected = percentsInfected(cumulativeResult);

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item xs={6} md={4}>
          <Card className={classes.card}>
            <CardContent>
	      <Tooltip title={results.c_new_infections.Popover} placement="bottom-end">
                <Typography className={classes.title} color="textSecondary" gutterBottom>
		  {results.c_new_infections.Label}
                </Typography>
	      </Tooltip>
              <Typography variant="h5" component="p">
                 {formatInt(cumulativeResult?.infected)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={4}>
          <Card className={classes.card}>
            <CardContent>
	      <Tooltip title={results.c_r.Popover} placement="bottom-end">
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  {results.c_r.Label}
                </Typography>
	      </Tooltip>
              <Typography variant="h5" component="p">
                {formatFloat(model?.r)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={4}>
          <Card className={classes.card}>
            <CardContent>
	      <Tooltip title={results.c_false_quar.Popover} placement="bottom-end">
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  {results.c_false_quar.Label}
                </Typography>
	      </Tooltip>
              <Typography variant="h5" component="p">
                {formatInt(cumulativeResult?.quar_and_not_infected)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent>
	      <Tooltip title={results.c_cases_isolated.Popover} placement="bottom-end">
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  {results.c_cases_isolated.Label}
                </Typography>
	      </Tooltip>
              <Typography variant="h5" component="p">
                {formatInt(cumulativeResult?.pos_and_quar)} &nbsp;
                ({formatInt((cumulativeResult?.pos_and_quar && cumulativeResult?.infected) ?
		            (cumulativeResult?.pos_and_quar  / cumulativeResult?.infected * 100) : 0)}%)
              </Typography>
{/*              <Typography variant="h5" component="h2" align="right">
                {formatInt(model?.isolated_due_to_en)}
              </Typography>
	      <Tooltip title={results.c_cases_isolated_en.Popover} placement="bottom-end">
                <Typography className={classes.title} color="textSecondary" align="right" gutterBottom>
                  {results.due_to_en.Label}
                </Typography>
	      </Tooltip>
*/}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={4}>
          <Card className={classes.card}>
            <CardContent>
	      <Tooltip title={results.c_cases_prevented_en.Popover} placement="bottom-end">
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  {results.c_cases_prevented.Label} {results.due_to_en.Label}
                </Typography>
	      </Tooltip>
              <Typography variant="h5" component="p">
                {formatInt(model?.cases_prevented)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={4}>
          <Card className={classes.card}>
            <CardContent>
	      <Tooltip title={results.c_false_quar_en.Popover} placement="bottom-end">
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  {results.c_false_quar.Label} {results.due_to_en.Label}
                </Typography>
	      </Tooltip>
              <Typography variant="h5" component="p">
                {formatInt(model?.false_quar_due_to_en)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card className={classes.card}>
            <CardContent  style={{paddingBottom: 0}}>
	      <Tooltip title={results.n_cases_by_detection.Popover} placement="bottom-end">
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  {results.n_cases_by_detection.Label}
                </Typography>
	      </Tooltip>
          <Grid container spacing={1}>
            <Grid item xs={12} md={8} lg={12} className={classes.seriesLabelRight}
              style={{height: '350px'}}>
            <ResponsivePie
                margin={{ top: 30, right: 60, bottom: 20, left: 60 }}
                valueFormat={formatInt}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                colors={{ datum: 'data.color' }}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                arcLinkLabelsSkipAngle={5}
                arcLinkLabelsStraightLength={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={15}
                arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
                tooltip={({datum}) => (
                  <BasicTooltip
                    id={datum.label}
                    value={`${datum.formattedValue} (${datum.data.percentage < 1 ? "<1" : formatInt(datum.data.percentage)}%)`}
                    enableChip={true}
                    color={datum.color}
                  />
                )}
                data={[{
                  id: results.pie_got_en.Sublabel,
                  label: results.pie_got_en.Label,
                  percentage: percent_infected?.infected_and_aen,
                  value: cumulativeResult?.infected_and_aen,
                  color: InfectionColors.AEN
                }, {
                  id: results.pie_got_call.Sublabel,
                  label: results.pie_got_call.Label,
                  percentage: percent_infected?.infected_and_mct,
                  value: cumulativeResult?.infected_and_mct,
                  color: InfectionColors.CT
                }, {
                  id: results.pie_test_only.Sublabel,
                  label: results.pie_test_only.Label,
                  percentage: percent_infected?.infected_and_pos,
                  value: cumulativeResult?.infected_and_pos,
                  color: InfectionColors.PT
                }, {
                  id: results.pie_got_both.Sublabel,
                  label: results.pie_got_both.Label,
                  percentage: percent_infected?.infected_and_both,
                  value: cumulativeResult?.infected_and_both,
                  color: InfectionColors.AEN_CT
                }, {
                  id: results.pie_not_detected.Sublabel,
                  label: results.pie_not_detected.Label,
                  percentage: percent_infected?.infected_and_none,
                  value: cumulativeResult?.infected_and_none,
                  color: InfectionColors.NONE
                }]}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={12} xl={4} className={classes.seriesLabelRight}>
              
            <ul className={classes.legend}>
                  <li><Bullet color={InfectionColors.AEN} /> 
		     <Tooltip title={results.pie_got_en.Popover} placement="bottom-end">
                       <Typography>{results.pie_got_en.Label}</Typography>
 		     </Tooltip>
		  </li>
                  <li><Bullet color={InfectionColors.CT} /> 
		     <Tooltip title={results.pie_got_call.Popover} placement="bottom-end">
		       <Typography>{results.pie_got_call.Label}</Typography>
 		     </Tooltip>
		  </li>
                  <li><Bullet color={InfectionColors.PT} /> 
		     <Tooltip title={results.pie_test_only.Popover} placement="bottom-end">
		       <Typography>{results.pie_test_only.Label}</Typography>
 		     </Tooltip>
		  </li>
                  <li><Bullet color={InfectionColors.AEN_CT} /> 
		     <Tooltip title={results.pie_got_both.Popover} placement="bottom-end">
		       <Typography>{results.pie_got_both.Label}</Typography>
 		     </Tooltip>
		  </li>
                  <li><Bullet color={InfectionColors.NONE} /> 
		     <Tooltip title={results.pie_not_detected.Popover} placement="bottom-end">
		       <Typography>{results.pie_not_detected.Label}</Typography>
 		     </Tooltip>
		  </li>
                </ul>
            </Grid>
          </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Card className={classes.card}>
            <CardContent>
	      <Tooltip title={results.n_ph_calls_by_reason.Popover} placement="bottom-end">
                <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                  {results.n_ph_calls_by_reason.Label}
                </Typography>
	      </Tooltip>
              <Typography className={classes.inlineTitle}>
                {formatInt(totalCalls)} total
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={5} className={classes.seriesLabelRight}>
                  {results.due_to_en.Label}
                </Grid>
                <Grid item xs={7}>
                  <LabeledBar color={TestColors.AEN} value={cumulativeResult?.aen_followup_calls} total={totalCalls} labelClass={classes.seriesLabel}></LabeledBar>
                </Grid>
                <Grid item xs={5} className={classes.seriesLabelRight}>
                  {results.due_to_ct.Label}
                </Grid>
                <Grid item xs={7}>
                  <LabeledBar color={TestColors.CT} value={cumulativeResult?.mct_calls} total={totalCalls} labelClass={classes.seriesLabel}></LabeledBar>
                </Grid>
                <Grid item xs={5} className={classes.seriesLabelRight}>
                  Other
                </Grid>
                <Grid item xs={7}>
                  <LabeledBar color={TestColors.OTHER} value={cumulativeResult?.other_calls} total={totalCalls} labelClass={classes.seriesLabel}></LabeledBar>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>&nbsp;</Grid>

	      <Tooltip title={results.n_quar_by_detection.Popover} placement="bottom-end">
                <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                  {results.n_quar_by_detection.Label}
                </Typography>
	      </Tooltip>
              <Typography className={classes.inlineTitle}>
                {formatInt(totalQuarantines)} total
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={5} className={classes.seriesLabelRight}>
                  {results.due_to_en.Label}
                </Grid>
                <Grid item xs={7}>
                  <LabeledBar color={TestColors.AEN} value={cumulativeResult?.quar_aen} total={totalQuarantines} labelClass={classes.seriesLabel}></LabeledBar>
                </Grid>
                <Grid item xs={5} className={classes.seriesLabelRight}>
                  {results.due_to_ct.Label}
                </Grid>
                <Grid item xs={7}>
                  <LabeledBar color={TestColors.CT} value={cumulativeResult?.quar_mct} total={totalQuarantines} labelClass={classes.seriesLabel}></LabeledBar>
                </Grid>
                <Grid item xs={5} className={classes.seriesLabelRight}>
                  {results.due_to_both.Label}
                </Grid>
                <Grid item xs={7}>
                  <LabeledBar color={TestColors.OTHER} value={cumulativeResult?.quar_both} total={totalQuarantines} labelClass={classes.seriesLabel}></LabeledBar>
                </Grid>
                <Grid item xs={5} className={classes.seriesLabelRight}>
                  {results.due_to_symptoms.Label}
                </Grid>
                <Grid item xs={7}>
                  <LabeledBar color={TestColors.OTHER} value={cumulativeResult?.quar_none} total={totalQuarantines} labelClass={classes.seriesLabel}></LabeledBar>
                </Grid>
              </Grid>

              <Grid item xs={12}>&nbsp;</Grid>

	      <Tooltip title={results.n_tests_by_reason.Popover} placement="bottom-end">
                <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                  {results.n_tests_by_reason.Label}
                </Typography>
	      </Tooltip>
              <Typography className={classes.inlineTitle}>
                {formatInt(totalTests)} total
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={5} className={classes.seriesLabelRight}>
                  {results.due_to_en.Label}
                </Grid>
                <Grid item xs={7}>
                  <LabeledBar color={TestColors.AEN} value={cumulativeResult?.aen_triggered_tests} total={totalTests} labelClass={classes.seriesLabel}></LabeledBar>
                </Grid>
                <Grid item xs={5} className={classes.seriesLabelRight}>
                  {results.due_to_ct.Label}
                </Grid>
                <Grid item xs={7}>
                  <LabeledBar color={TestColors.CT} value={cumulativeResult?.mct_triggered_tests} total={totalTests} labelClass={classes.seriesLabel}></LabeledBar>
                </Grid>
                <Grid item xs={5} className={classes.seriesLabelRight}>
                  {results.due_to_symptoms.Label}
                </Grid>
                <Grid item xs={7}>
                  <LabeledBar color={TestColors.OTHER} value={cumulativeResult?.symptomatic_tests} total={totalTests} labelClass={classes.seriesLabel}></LabeledBar>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Grid item xs={4} className={classes.seriesLabel}>
		    <Tooltip title={results.people_tested_pos.Popover} placement="bottom-end">
                      <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                        {results.people_tested_pos.Label}
                      </Typography>
		    </Tooltip>
                  </Grid>
                  <Grid item xs={8}>
                    <LabeledBar color={InfectionColors.AEN} value={totalPos} total={totalPos + totalNeg} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received EN only
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.AEN} value={cumulativeResult?.pos_aen} total={totalPos} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received CT call only
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.CT} value={cumulativeResult?.pos_mct} total={totalPos} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received Both
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.AEN_CT} value={cumulativeResult?.pos_both} total={totalPos} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received Neither
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.NONE} value={cumulativeResult?.pos_none} total={totalPos} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Grid item xs={5} className={classes.seriesLabelRight}>
		    <Tooltip title={results.symptomatic_pos.Popover} placement="bottom-end">
                      <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                        {results.symptomatic_pos.Label}
		      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={7}>
                    <LabeledBar color={InfectionColors.AEN_CT} value={totalPosSym} total={totalPos} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received EN only
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.AEN} value={cumulativeResult?.pos_aen_sym} total={totalPosSym} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received CT call only
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.CT} value={cumulativeResult?.pos_mct_sym} total={totalPosSym} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received Both
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.AEN_CT} value={cumulativeResult?.pos_both_sym} total={totalPosSym} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received Neither
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.NONE} value={cumulativeResult?.pos_none_sym} total={totalPosSym} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Grid item xs={5} className={classes.seriesLabelRight}>
		    <Tooltip title={results.asymptomatic_pos.Popover} placement="bottom-end">
                      <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                        {results.asymptomatic_pos.Label}
                      </Typography>
		    </Tooltip>
                  </Grid>
                  <Grid item xs={7}>
                    <LabeledBar color={InfectionColors.AEN_CT} value={totalPosAsym} total={totalPos} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received EN only
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.AEN} value={cumulativeResult?.pos_aen_asym} total={totalPosAsym} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received CT call only
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.CT} value={cumulativeResult?.pos_mct_asym} total={totalPosAsym} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received Both
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.AEN_CT} value={cumulativeResult?.pos_both_asym} total={totalPosAsym} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received Neither
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.NONE} value={cumulativeResult?.pos_none_asym} total={totalPosAsym} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Grid item xs={4} className={classes.seriesLabel}>
		    <Tooltip title={results.people_tested_neg.Popover} placement="bottom-end">
                      <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                        {results.people_tested_neg.Label}
                      </Typography>
		    </Tooltip>
                  </Grid>
                  <Grid item xs={8}>
                    <LabeledBar color={InfectionColors.AEN} value={totalNeg} total={totalNeg + totalPos} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received EN only
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.AEN} value={cumulativeResult?.neg_aen} total={totalNeg} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received CT call only
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.CT} value={cumulativeResult?.neg_mct} total={totalNeg} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received Both
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.AEN_CT} value={cumulativeResult?.neg_both} total={totalNeg} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                    <Grid item xs={4} className={classes.seriesLabelRight}>
                      Received Neither
                    </Grid>
                    <Grid item xs={8}>
                      <LabeledBar color={InfectionColors.NONE} value={cumulativeResult?.neg_none} total={totalNeg} labelClass={classes.seriesLabel}></LabeledBar>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
