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

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import clsx from 'clsx';
import Brightness1Icon from '@material-ui/icons/Brightness1';

import { ResponsivePie } from "@nivo/pie";
import { BasicTooltip } from "@nivo/tooltip"


import {
  formatInt, formatFloat,
  formatIntDelta, formatFloatDelta
} from "../../App";

import {LabeledBar} from "../LabeledBar";

import {
  SimulationResult, accumulate, 
  sumTotalTests, sumTotalCalls,
  sumTotalQuarantines, sumTotalNegative, 
  sumTotalPositive, sumTotalPositiveSymptomatic, 
  sumTotalPositiveAsymptomatic, percentsInfected, Infected } from "../../models";
import { results } from "../../constants";
import { TestColors, ComparisonColors, InfectionColors } from "../../colors";

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

  stackLabel: {
    paddingRight: 10,
    color: 'white',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
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

  columnA: {
    backgroundColor: ComparisonColors.A
  },
  
  columnB: {
    backgroundColor: ComparisonColors.B
  },

  bordered: {
    borderRight: '1px dashed lightgrey'
  },

  titleRow: {
    "&> .MuiTableCell-root": {
      fontWeight:'bold',
      color: theme.palette.text.hint
    }
  },

  labelCell: {
    whiteSpace: 'nowrap'
  },

  smallerText: {
    fontSize:'smaller'
  },

  deltaRow: {
    "& .MuiTypography-root, .MuiTableCell-root" : {
      fontWeight: 'bold',
      color: 'black'
    }
  },

}));

type Obj = {[key:string]:any};
type KeysOfType<T, VT> = {
  [K in keyof T]: T[K] extends VT ? K : never
}[keyof T];

function diffResult<T extends Obj, K extends KeysOfType<T, number>>(results: T[], key: K): number {
  if (results.length !== 2) {
    return -0;
  }
  const valA = results[0][key];
  const valB = results[1][key];
  return valB - valA;
}

export type CumulativeProps = {
  models: (SimulationResult | undefined)[]
}


export default function Cumulative({models}: CumulativeProps) {
  const Bullet = (props:{color:string}) => <Brightness1Icon className={classes.bullet} style={{color: props.color}}/>;
  const classes = useStyles();

  const availableModels = useMemo(() =>
    models.filter((model): model is SimulationResult => model !== undefined)
  , [models]);

  const cumulativeResults = useMemo(() =>
    availableModels.map((model) => accumulate(model))
  , [availableModels]);

  const totalTests = cumulativeResults.map((result) => sumTotalTests(result));
  const totalCalls = cumulativeResults.map((result) => sumTotalCalls(result));
  const totalQuarantines = cumulativeResults.map((result) => sumTotalQuarantines(result));
  const totalNeg = cumulativeResults.map((result) => sumTotalNegative(result));
  const totalPos = cumulativeResults.map((result) => sumTotalPositive(result));
  const totalPosSym = cumulativeResults.map((result) => sumTotalPositiveSymptomatic(result));
  const totalPosAsym = cumulativeResults.map((result) => sumTotalPositiveAsymptomatic(result));

  const percent_infected: Infected[] = cumulativeResults.map((result) => percentsInfected(result));

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="comparison table" size="small">
              <TableHead>
                <TableRow className={classes.titleRow}>
                  <Tooltip title="" placement="bottom-end">
                    <TableCell className={classes.bordered}>Model Metrics</TableCell>
		  </Tooltip>       
      <Tooltip title={results.c_r.Popover} placement="bottom-end">
                    <TableCell className={classes.bordered}>{results.c_r.Label}</TableCell>
		  </Tooltip>                  
		  <Tooltip title={results.c_new_infections.Popover} placement="bottom-end">
                    <TableCell className={classes.bordered}>{results.c_new_infections.Label}</TableCell>
		  </Tooltip>                  
		  <Tooltip title={results.c_cases_prevented_en.Popover} placement="bottom-end">
                    <TableCell className={classes.bordered}>{results.c_cases_prevented.Label} {results.due_to_en.Label}</TableCell>
		  </Tooltip>                  
		  <Tooltip title={results.c_cases_isolated.Popover} placement="bottom-end">
                    <TableCell className={classes.bordered}>{results.c_cases_isolated.Label}</TableCell>
		  </Tooltip>
		  <Tooltip title={results.c_false_quar.Popover} placement="bottom-end">
                    <TableCell className={classes.bordered}>{results.c_false_quar.Label}</TableCell>
		  </Tooltip>                  
		  <Tooltip title={results.c_false_quar_en.Popover} placement="bottom-end">
                    <TableCell className={classes.bordered}>{results.c_false_quar.Label} {results.due_to_en.Label}</TableCell>
		  </Tooltip>
                </TableRow>
              </TableHead>
              <TableBody>
                  { models.map((_, i) => (
                  <TableRow key={i}>
                    <TableCell component="th" scope="row" className={clsx(classes.bordered, classes.labelCell)}>Scenario {i + 1}</TableCell>

                    <TableCell align="right" className={classes.bordered}>
                      <Typography variant="h5" component="h2">
                        {formatFloat(models[i]?.r)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" className={classes.bordered}>
                      <Typography variant="h5" component="h2">
                        {formatInt(cumulativeResults[i]?.infected)}
                      </Typography>
                    </TableCell>
      
                    <TableCell align="right" className={classes.bordered}>
                      <Typography variant="h5" component="h2">
                        {formatInt(models[i]?.cases_prevented)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" className={classes.bordered}>
                      <Typography variant="h5" component="h2">
                        {formatInt(cumulativeResults[i]?.pos_and_quar)}
                        <div className={classes.smallerText}>
                          ({formatInt((cumulativeResults[i]?.pos_and_quar ?? 0)  / (cumulativeResults[i]?.infected ?? 1) * 100)}%)
                        </div>
                       </Typography>
                    </TableCell>

                    <TableCell align="right"  className={classes.bordered}>
                      <Typography variant="h5" component="h2">
                        {formatInt(cumulativeResults[i]?.quar_and_not_infected)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h5" component="h2">
                        {formatInt(models[i]?.false_quar_due_to_en)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  )) }
                  <TableRow className={classes.deltaRow}>
                    <TableCell component="th" scope="row" className={clsx(classes.bordered, classes.labelCell)}>Difference</TableCell>

                    <TableCell align="right" className={classes.bordered}>
                      <Typography variant="h5" component="h2">
                        {formatFloatDelta(diffResult(availableModels, "r"))}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" className={classes.bordered}>
                      <Typography variant="h5" component="h2">
                        {formatIntDelta(diffResult(cumulativeResults, "infected"))}
                      </Typography>
                    </TableCell>
      
                    <TableCell align="right" className={classes.bordered}>
                      <Typography variant="h5" component="h2">
                        {formatIntDelta(diffResult(availableModels,"cases_prevented"))}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" className={classes.bordered}>
                      <Typography variant="h5" component="h2">
                        {formatIntDelta(diffResult(cumulativeResults, "pos_and_quar"))}
                       </Typography>
                    </TableCell>

                    <TableCell align="right"  className={classes.bordered}>
                      <Typography variant="h5" component="h2">
                        {formatIntDelta(diffResult(cumulativeResults, "quar_and_not_infected"))}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h5" component="h2">
                        {formatIntDelta(diffResult(availableModels, "false_quar_due_to_en"))}
                      </Typography>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>
              <Grid container spacing={1}>

                <Grid item xs={12} className={classes.seriesLabel}>
		  <Tooltip title={results.n_cases_by_detection.Popover} placement="bottom-end">
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      {results.n_cases_by_detection.Label}
		    </Typography>
		  </Tooltip>
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={5} style={{textAlign: 'center'}}>Scenario 1</Grid>
                <Grid item xs={5} style={{textAlign: 'center'}}>Scenario 2</Grid>

                <Grid item xs={2} md={2} lg={2} xl={2} style={{alignSelf: 'center'}}>
               
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

                { cumulativeResults.map((_, i) => (

                    <Grid key={i} item xs={5} md={5} lg={5} xl={5}
                          style={{height: '250px'}}>
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
				percentage: percent_infected[i].infected_and_aen,
				value: cumulativeResults[i].infected_and_aen,
				color: InfectionColors.AEN
			    }, {
				id: results.pie_got_call.Sublabel,
				label: results.pie_got_call.Label,
				percentage: percent_infected[i].infected_and_mct,
				value: cumulativeResults[i].infected_and_mct,
				color: InfectionColors.CT
			    }, {
				id: results.pie_test_only.Sublabel,
				label: results.pie_test_only.Label,
				percentage: percent_infected[i].infected_and_pos,
				value: cumulativeResults[i].infected_and_pos,
				color: InfectionColors.PT
			    }, {
				id: results.pie_got_both.Sublabel,
				label: results.pie_got_both.Label,
				percentage: percent_infected[i].infected_and_both,
				value: cumulativeResults[i].infected_and_both,
				color: InfectionColors.AEN_CT
			    }, {
				id: results.pie_not_detected.Sublabel,
				label: results.pie_not_detected.Label,
				percentage: percent_infected[i].infected_and_none,
				value: cumulativeResults[i].infected_and_none,
				color: InfectionColors.NONE
			    }]}
			/>
		    </Grid>
                ))} 
	      </Grid>
	    </CardContent>
	  </Card>
	</Grid>

        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>
              <Grid container spacing={1}>

                <Grid item xs={4} className={classes.seriesLabelRight}>
                  &nbsp;
                </Grid>
                <Grid item xs={4}>Scenario 1</Grid>
                <Grid item xs={4}>Scenario 2</Grid>

                <Grid item xs={4} className={classes.seriesLabel}>
		  <Tooltip title={results.n_ph_calls_by_reason.Popover} placement="bottom-end">
                    <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                      {results.n_ph_calls_by_reason.Label}
                    </Typography>
		  </Tooltip>
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <Typography className={classes.inlineTitle}>
                      {formatInt(totalCalls[i])} total
                    </Typography>
                  </Grid>
                ))}
                <Grid item xs={3} className={classes.seriesLabelRight}>
                  Due to EN
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <LabeledBar color={TestColors.AEN} value={cumulativeResults[i]?.aen_followup_calls} labelTotal={totalCalls[i]} total={Math.max(...totalCalls)} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                ))}
                <Grid item xs={3} className={classes.seriesLabelRight}>
                  Due to CT
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <LabeledBar color={TestColors.CT} value={cumulativeResults[i]?.mct_calls} labelTotal={totalCalls[i]} total={Math.max(...totalCalls)} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                ))}
                <Grid item xs={3} className={classes.seriesLabelRight}>
                  Other
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <LabeledBar color={TestColors.OTHER} value={cumulativeResults[i]?.other_calls} labelTotal={totalCalls[i]} total={Math.max(...totalCalls)} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                ))}

                <Grid item xs={12}>&nbsp;</Grid>
              
                <Grid item xs={4} className={classes.seriesLabel}>
		  <Tooltip title={results.n_quar_by_detection.Popover} placement="bottom-end">
                    <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                      {results.n_quar_by_detection.Label}
                    </Typography>
		  </Tooltip>
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <Typography className={classes.inlineTitle}>
                      {formatInt(totalQuarantines[i])} total
                    </Typography>
                  </Grid>
                ))}
                <Grid item xs={3} className={classes.seriesLabelRight}>
                  {results.due_to_en.Label}
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <LabeledBar color={TestColors.AEN} value={cumulativeResults[i]?.quar_aen} labelTotal={totalQuarantines[i]} total={Math.max(...totalQuarantines)} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                ))}
                <Grid item xs={3} className={classes.seriesLabelRight}>
                  {results.due_to_ct.Label}
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <LabeledBar color={TestColors.CT} value={cumulativeResults[i]?.quar_mct} labelTotal={totalQuarantines[i]} total={Math.max(...totalQuarantines)} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                ))}
                <Grid item xs={3} className={classes.seriesLabelRight}>
                  {results.due_to_both.Label}
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <LabeledBar color={TestColors.OTHER} value={cumulativeResults[i]?.quar_both} labelTotal={totalQuarantines[i]} total={Math.max(...totalQuarantines)} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                ))}
                <Grid item xs={3} className={classes.seriesLabelRight}>
                  {results.due_to_symptoms.Label}
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <LabeledBar color={TestColors.OTHER} value={cumulativeResults[i]?.quar_none} labelTotal={totalQuarantines[i]} total={Math.max(...totalQuarantines)} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                ))}

                <Grid item xs={12}>&nbsp;</Grid>
              
                <Grid item xs={4} className={classes.seriesLabel}>
		  <Tooltip title={results.n_tests_by_reason.Popover} placement="bottom-end">
                    <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                      {results.n_tests_by_reason.Label}
                    </Typography>
		  </Tooltip>
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <Typography className={classes.inlineTitle}>
                      {formatInt(totalTests[i])} total
                    </Typography>
                  </Grid>
                ))}
                <Grid item xs={3} className={classes.seriesLabelRight}>
                  {results.due_to_en.Label}
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <LabeledBar color={TestColors.AEN} value={cumulativeResults[i]?.aen_triggered_tests} labelTotal={totalTests[i]} total={Math.max(...totalTests)} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                ))}
                <Grid item xs={3} className={classes.seriesLabelRight}>
                  {results.due_to_ct.Label}
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <LabeledBar color={TestColors.CT} value={cumulativeResults[i]?.mct_triggered_tests} labelTotal={totalTests[i]} total={Math.max(...totalTests)} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                ))}
                <Grid item xs={3} className={classes.seriesLabelRight}>
                  {results.due_to_symptoms.Label}
                </Grid>
                { models.map((_, i) => (
                  <Grid item xs={4} key={i}>
                    <LabeledBar color={TestColors.OTHER} value={cumulativeResults[i]?.symptomatic_tests} labelTotal={totalTests[i]} total={Math.max(...totalTests)} labelClass={classes.seriesLabel}></LabeledBar>
                  </Grid>
                ))}
                
                </Grid>
            </CardContent>
          </Card>
        </Grid>
      
      
        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={4} className={classes.seriesLabelRight}>
                  &nbsp;
                </Grid>
                <Grid item xs={4}>Scenario 1</Grid>
                <Grid item xs={4}>Scenario 2</Grid>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />} >
                    <Grid item xs={4} className={classes.seriesLabel}>
                      <Tooltip title={results.people_tested_pos.Popover} placement="bottom-end">
                        <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                          {results.people_tested_pos.Label}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    { models.map((_, i) => (
                      <Grid item xs={4} key={i}>
                        <Typography className={classes.inlineTitle}>
                          {formatInt(totalPos[i])} total
                        </Typography>
                      </Grid>
                    ))}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                    <Grid item xs={3} className={classes.seriesLabelRight}>
                      Received EN only
                    </Grid>
                    { models.map((_, i) => (
                      <Grid item xs={4} key={i}>
                        <LabeledBar color={InfectionColors.AEN} value={cumulativeResults[i]?.pos_aen} labelTotal={totalPos[i]} total={Math.max(...totalPos)} labelClass={classes.seriesLabel}></LabeledBar>
                      </Grid>
                    ))}
                    <Grid item xs={3} className={classes.seriesLabelRight}>
                      Received CT call only
                    </Grid>
                    { models.map((_, i) => (
                      <Grid item xs={4} key={i}>
                        <LabeledBar color={InfectionColors.CT} value={cumulativeResults[i]?.pos_mct} labelTotal={totalPos[i]} total={Math.max(...totalPos)} labelClass={classes.seriesLabel}></LabeledBar>
                      </Grid>
                    ))}
                    <Grid item xs={3} className={classes.seriesLabelRight}>
                      Received Both
                    </Grid>
                    { models.map((_, i) => (
                      <Grid item xs={4} key={i}>
                        <LabeledBar color={InfectionColors.AEN_CT} value={cumulativeResults[i]?.pos_both} labelTotal={totalPos[i]} total={Math.max(...totalPos)} labelClass={classes.seriesLabel}></LabeledBar>
                      </Grid>
                    ))}
                    <Grid item xs={3} className={classes.seriesLabelRight}>
                      Received Neither
                    </Grid>
                    { models.map((_, i) => (
                      <Grid item xs={4} key={i}>
                        <LabeledBar color={InfectionColors.NONE} value={cumulativeResults[i]?.pos_none} labelTotal={totalPos[i]} total={Math.max(...totalPos)} labelClass={classes.seriesLabel}></LabeledBar>
                      </Grid>
                    ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />} >
                    <Grid item xs={4} className={classes.seriesLabel}>
                      <Tooltip title={results.symptomatic_pos.Popover} placement="bottom-end">
                        <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                          {results.symptomatic_pos.Label}
                        </Typography>
                      </Tooltip>
                    </Grid>
                  { models.map((_, i) => (
                    <Grid item xs={4} key={i}>
                      <Typography className={classes.inlineTitle}>
                        {formatInt(totalPosSym[i])} total
                      </Typography>
                    </Grid>
                  ))}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received EN only
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.AEN} value={cumulativeResults[i]?.pos_aen_sym} labelTotal={totalPosSym[i]} total={Math.max(...totalPosSym)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received CT call only
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.CT} value={cumulativeResults[i]?.pos_mct_sym} labelTotal={totalPosSym[i]} total={Math.max(...totalPosSym)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received Both
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.AEN_CT} value={cumulativeResults[i]?.pos_both_sym} labelTotal={totalPosSym[i]} total={Math.max(...totalPosSym)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received Neither
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.NONE} value={cumulativeResults[i]?.pos_none_sym} labelTotal={totalPosSym[i]} total={Math.max(...totalPosSym)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>

              
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />} >
                    <Grid item xs={4} className={classes.seriesLabel}>
		                  <Tooltip title={results.asymptomatic_pos.Popover} placement="bottom-end">
                        <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                          {results.asymptomatic_pos.Label}
                        </Typography>
		                  </Tooltip>
                    </Grid>
                    { models.map((_, i) => (
                      <Grid item xs={4} key={i}>
                        <Typography className={classes.inlineTitle}>
                          {formatInt(totalPosAsym[i])} total
                        </Typography>
                      </Grid>
                    ))}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received EN only
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.AEN} value={cumulativeResults[i]?.pos_aen_asym} labelTotal={totalPosAsym[i]} total={Math.max(...totalPosAsym)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received CT call only
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.CT} value={cumulativeResults[i]?.pos_mct_asym} labelTotal={totalPosAsym[i]} total={Math.max(...totalPosAsym)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received Both
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.AEN_CT} value={cumulativeResults[i]?.pos_both_asym} labelTotal={totalPosAsym[i]} total={Math.max(...totalPosAsym)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received Neither
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.NONE} value={cumulativeResults[i]?.pos_none_asym} labelTotal={totalPosAsym[i]} total={Math.max(...totalPosAsym)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />} >
                    <Grid item xs={4} className={classes.seriesLabel}>
                      <Tooltip title={results.people_tested_neg.Popover} placement="bottom-end">
                        <Typography className={`${classes.title} ${classes.inline}`} color="textSecondary" gutterBottom>
                          {results.people_tested_neg.Label}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    { models.map((_, i) => (
                      <Grid item xs={4} key={i}>
                        <Typography className={classes.inlineTitle}>
                          {formatInt(totalNeg[i])} total
                        </Typography>
                      </Grid>
                    ))}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received EN only
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.AEN} value={cumulativeResults[i]?.neg_aen} labelTotal={totalNeg[i]} total={Math.max(...totalNeg)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received CT call only
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.CT} value={cumulativeResults[i]?.neg_mct} labelTotal={totalNeg[i]} total={Math.max(...totalNeg)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received Both
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.AEN_CT} value={cumulativeResults[i]?.neg_both} labelTotal={totalNeg[i]} total={Math.max(...totalNeg)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                      <Grid item xs={3} className={classes.seriesLabelRight}>
                        Received Neither
                      </Grid>
                      { models.map((_, i) => (
                        <Grid item xs={4} key={i}>
                          <LabeledBar color={InfectionColors.NONE} value={cumulativeResults[i]?.neg_none} labelTotal={totalNeg[i]} total={Math.max(...totalNeg)} labelClass={classes.seriesLabel}></LabeledBar>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                
              </Grid>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </div>
  );
}
