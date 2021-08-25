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


import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Typography from '@material-ui/core/Typography';

import { NiceLink } from '../api';
import Card from "@material-ui/core/Card";
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from "@material-ui/core/CardContent";
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';

import Grid from "@material-ui/core/Grid";

import { FixedParamField, fixedParamFieldMap } from "../constants";

interface Data {
  section: string;
  order: number,
  term: string;
  definition: string;
  more: string | JSX.Element;
}

function createData(
  section: string,
  order: number,
  term: string,
  definition: string,
  more: string | JSX.Element = ''
): Data {
  return { section, order, term, definition, more };
}


function toUpperCase(str:string) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}

let tmp = 1;
const rowsFixed = Object.values(fixedParamFieldMap).map((field : FixedParamField) => (
      createData(field.Section, tmp++, toUpperCase(field.Label), field.Popover,
      		 (field.Reference ? <NiceLink href={field.Reference.Href} text={'Source: ' + field.Reference.LinkText} /> : ''))
));


const rowsGeneral = [
  createData('General', 0, 'True Contact',
	     'An interaction between an infectious person and an uninfected person in which they are close enough for disease transmission to be possible.',
	     'The model is agnostic about the definition of "too close for too long." However, it generates a number of "true contacts" each day, based on the assumption that some percentage of contacts meet the criteria. The exposed person may receive an EN, if the infected person uploads their keys after the interaction. They may receive a call from Public Health if the infected person tests positive.'),
  createData('General', 0, 'False Contact',
	     'An interaction between an infectious person and an uninfected person in which they are not close enough for disease transmission to occur, but the EN service recorded an interaction that was "too close for too long." The exposed person may receive an EN, if the infected person uploads their keys after the interaction. They do not receive Public Health calls from conventional contact tracing.',
	     'The model is agnostic about the definition of "too close for too long." However, it generates a number of "false contacts" each day, based on the assumption that some percentage of contacts meet the criteria. The exposed person may receive an EN, if the infected person uploads their keys after the interaction. They do not receive a call from Public Health, as it is assumed that manual contact tracing would not identify them.'),
  createData('General', 0, 'Exposure Notification (EN)',
	     'An implementation of automated digital contact tracing, which estimates COVID-19 exposure based on distance and duration estimates derived from Bluetooth Low Energy signal strength between two smartphones running the EN Service. Infected individuals must share their random "keys" through the service in order to anonymously alert other users who have been "too close for too long" to an infected person. The service forgets data that is older than 14 days.'),
  createData('General', 0, 'Contact Tracing (CT)',
	     'The process of attempting to identify and communicate with people who have recently been in contact with a person diagnosed with an infectious disease, in this case, COVID-19.',
	     'The goal of contact tracing is to let the exposed person know they should monitor their health for signs and symptoms of the disease, as well as to help them get tested, and if appropriate, get treatment. Those who are infected are asked to self-isolate, and those who are identified as a close contact (and for whom infection cannot yet be ruled out) are asked to self-quarantine.'),
  createData('General', 0, 'Non-Pharmaceutical Intervention (NPI)',
	     'Actions that people and communities can take to help slow the spread of an infectious disease, aside from vaccinations and other medicinal interventions.',
	     'NPIs can be personal, such as masking, hand hygiene, self-isolating, and self-quarantining. They can also be community-based, such as temporary closures of schools and workplaces, and environmental, such as increasing ventilation and disinfecting efforts.'),
  createData('General', 0, 'EN Key Upload',
	     'The process of sharing one\'s "diagnosis keys" from the last 14 days, in order to alert other users of Exposure Notifications that they may have been exposed.',
	     'The Exposure Notification Service relies on a national key server to enable all users\'s phones to automatically check whether the Bluetooth messages they received have come from a person who was later diagnosed with COVID. The key sharing process is confidential and is up to the individual to complete. It may require receiving a phone call from Public Health with a one-time use code, or the user may receive the one-time code automatically via text message from Public Health.'),
  createData('General', 0, 'Contact Rate',
	     'The likelihood that people will interact with each other, based on both population-level interaction patterns (e.g., social distancing) as well as personal interaction states (e.g., following a recommendation to quarantine or isolate).', ''),
  createData('General', 0, 'Behavior Restriction',
	     'A reduction in person-to-person interactions following a recommendation to quarantine or isolate.', ''),
  createData('General', 0, 'Testing Demand',
	     'The expected number of tests requested per day, due to individuals experiencing symptoms, or after receiving a contact tracing call from Public Helath or a close contact alert from the Exposure Notification Service.', ''),
  createData('General', 0, 'Public Health Workload',
	     'The efforts demanded of Public Health teams to provide contact tracing services and follow-up calls to infected individuals after testing.', 'SimAEN does not model time devoted to test sample collection or vaccination efforts by Public Health authorities.'),


  createData('General', 0, 'Secondary Attack Rate (SAR)',
	     'The probability that infection occurs in a susceptible person within a reasonable incubation period, given that close contact occurred.', ''),
//	     'The secondary attack rate is related to R, but they are two different measures of the spread of disease (or the potential for new cases). In general terms, the SAR is estimated from observations of index cases and their close contacts (e.g., households), and applies to person-to-person transmission. The effective reproductive number is estimated for an entire population, which is rarely fully susceptible to infection. R is expected to fluctuate over time as members of the population become immune or moderate their behavior to avoid infection. However, when all else is held constant, a higher SAR corresponds to a higher R for a given disease.')
];

const rowsOutputs = [
  createData('Analysis Quick Look', 1, 'Cumulative New Infections',
	     'New infections arising during simulation period.'),
  createData('Analysis Quick Look', 2, 'Effective Reproduction Number (R)', 
	     'Average number of secondary cases per infectious case in a population made up of both susceptible and non-susceptible hosts.', 
	     'This value is the same that is used in media reports of COVID-19 spread. R = 1.0 means that infection rates are holding steady; any value above 1 means that disease spread is growing; any value below 1 means disease spread is slowing down (ideal).'),
  createData('Analysis Quick Look', 3, 'Unnecessary Quarantines', 
	     'Individuals who are not infected but entered quarantine as a result of EN or CT',
	     'Of the people the model knows are not infected, how many received an exposure notification or contact tracing call and chose to isolate.'),
  createData('Analysis Quick Look', 4, 'Positive Cases ID’d and Isolated', 
	     'Number of positive cases that were detected and adhered with the isolation requirement', 
	     "This measures the number of people who have removed themselves from contact with other individuals due to a Public Health phone call, exposure notification alert, or positive test, who the model also knows to be positive for a COVID 19 infection. Higher numbers can indicate that Public Health efforts are reaching more people, but can also mean that the disease is spreading to more people."),
  createData('Analysis Quick Look', 5, 'Cases Prevented Due to EN', 
	     'Number of estimated new infection cases that were averted due to the improved earlier detection by EN and the reduction of consequent infections due to infected people isolating', 
	     "Of the people the model knows are infected, we count how many received an EN alert, and how many of those people also chose to isolate. We then measure the offset between these values in the selected configuration, and their values in the related configuration in which EN adoption is zero. When the user sets EN adoption to zero, this value will also be zero."),
  createData('Analysis Quick Look', 6, 
	     'Cumulative New Infections by Detection Method', 
	     'Cumulative number of new infections identified by the model, broken out by detection method',
	     "Over the 30-day run of the model, how many agents were known to be infected with COVID-19 overall by the model compared to how many people know themselves to be positive. This metric includes asymptomatic carriers that likely would not know they are infected and spreading the virus in the \"real world,\" and measures how many infectious people chose to get a test because of EN, CT, or chose to get tested for some other reason such as onset of symptoms."),
  createData('Analysis Quick Look', 7, 'EN Only', 
	     'EN received was the only reason for the test',
	     'This measures how many of the infected population are being reached and choosing to get tested only by EN efforts. It does not count those that also received a Contact Tracing call (CT).'),
  createData('Analysis Quick Look', 8, 'CT Only', 
	     'CT call was the only reason for the test',
	     'This measures how many of the infected population are only being reached and choosing to get tested by a Contact Tracing call (CT). It does not count those that also received an EN.'),
  createData('Analysis Quick Look', 9, 'EN + CT', 
	     'Test was triggered by both EN and CT call', 
	     'This measures how much overlap there was in CT and EN efforts to the infected population, which resulted in a positive test.'),
  createData('Analysis Quick Look', 10, 'Positive Test Only', 
	     'Test was triggered by another reason, such as symptoms',
	     'Measures how many people were tested due to some reason other than EN or CT, such as the onset of symptoms. It does not count those who received either an EN or CT.'),
  createData('Analysis Quick Look', 11, 'Not Detected', 
	     'Infections which were not detected, i.e., no test conducted or test was a false negative',
	    'This number will include people who received an EN or CT who chose not to get tested, as well as people who tested but received a falsely negative result. Includes the assumed high rate of asymptomatic carriers1 that likely would not know they are infected and spreading the virus in the "real world," as well as symptomatic people that chose not to get tested.'),
  createData('Analysis Quick Look', 12, 'Number of Public Health Calls by Reason', 
	     'Cumulative number of new Public Health calls, broken out by reason',
	     'The model assumes a percentage of people will get CT calls or EN, or will choose to contact Public Health after getting an EN or positive test. This metric includes calls to Public Health by individuals, as well as calls from Public Health to individuals, broken down by whether they were initiated by EN, CT, or a positive test.'),
  createData('Analysis Quick Look', 13, 'Due to EN', 
	     'Calls from people to Public Health because they received an Exposure Notification'),
  createData('Analysis Quick Look', 14, 'Due to CT', 
	     'Calls from Public Health to people who were identified through contact tracing',
	     'Parameters in the model govern how likely it is that a person will answer a contact tracing call, as well as how many times a contact tracer will try to call, and how many calls a contact tracer will make during a day.'),
  createData('Analysis Quick Look', 15, 'Other', 
	     'Calls from people to Public Health after receiving a positive test'),
  createData('Analysis Quick Look', 16, 'Number of Tests by Reason', 
	     'Cumulative number of new tests, broken out by reason'), 
  createData('Analysis Quick Look', 17, 'Due to EN', 
	     'Test was taken because the person received an Exposure Notification (EN)',
	     'The model assumes a percentage of people will get tested after receiving an Exposure Notification of a close contact.'),
  createData('Analysis Quick Look', 18, 'Due to CT', 
	     'Test was taken because the person received a Contact Tracing call (CT)',
	     'The model assumes a percentage of people will get tested after receiving a Contact Tracing call.'),
  createData('Analysis Quick Look', 19, 'Due to Symptoms', 
	     'Test was taken because the person had symptoms',
	     'The model assumes a percentage of people will get tested once they start experiencing symptoms.'),
  createData('Analysis Quick Look', 20, 'People Who Tested Positive', 
	     'Cumulative number of people who tested positive, including possibly multiple positive tests per person',
	     'The model determines a percentage of people will test positive based on their state at the time of test - exposed, pre-symptomatic, symptomatic, or asymptomatic. In the model, a person could potentially test negative at one point, develop symptoms, and retest at another point in the model run; some tests will represent the same person getting tested more than once.'),
  createData('Analysis Quick Look', 21, 'Symptomatic Positives', 
	     'Cumulative number of people who tested positive and were symptomatic at the time of the test'),
  createData('Analysis Quick Look', 22, 'Asymptomatic Positives', 
	     'Cumulative number of people who tested positive and were asymptomatic at the time of the test'),
  createData('Analysis Quick Look', 23, 'People Who Tested Negative', 
	     'Cumulative number of people who tested negative, including possibly multiple negative tests per person'),
]

const rowsInputs = [
  createData('Population', 1, 'Number of Starting Cases', 
	     'Total number of active positive cases at the starting date of the period',
	     'Our model is focused on evaluating the relative impacts of different Public Health interventions. For each selection, it is more important to choose, for instance, a low number of starting cases and a high number of contact tracers if that ratio represents the situation you are trying to evaluate.'),
  createData('Population', 2, 'Personal Interaction Level', 
	     'Extent to which a person interacts closely with others',
	     'Internally, the model uses two parameters to represent different states of interaction: how many people a given person will ever interact with, and the average number of contacts that they encounter each model day. Selections here are suggestions which modify the underlying inputs to represent high, moderate, and low public interaction levels, governing how many people each person in the model will encounter in a given model day.'),
  createData('Population', 3, 'Population Vaccination Level', 
	     'Percentage of people who received full or partial vaccination',
	     'This governs how likely a person in the model is to contract the virus from interactions with others, as well as how likely they are to spread the virus to those they interact with. In the model, vaccinated people have a much lower likelihood of contracting or spreading the virus than unvaccinated people.'),
  createData('Population', 4, 'Population Mask-Wearing Level', 
	     'Percentage of people who wear masks in indoor or outdoor settings',
	     'This governs how likely a person in the model is to contract the virus from interactions with others, as well as how likely they are to spread the virus to those they interact with. In the model, people who wear masks are assumed to do so with every other person they contact. People who wear masks have a lower likelihood of contracting or spreading the virus than those who are not wearing masks.'),
  createData('Population', 5, 'Test Processing Time', 
	     'Duration between the time a test is taken to the time results are received',
	    'Higher test processing time will result in fewer tests being taken overall, and increase the delay between testing and isolation.'),
  createData('Exposure Notification', 6, 'EN Adoption Rate', 
	     'Percentage of people that installed and are using the EN service',
	     'This governs the percentage of people in the model that will have the service installed and running. A percentage of people who have EN installed will receive an alert if they encounter an infected person who also uses the EN service.'),
  createData('Exposure Notification', 7, 'EN Sensitivity Settings', 
	     'EN sensitivity/specificity level that is configured for the population, sometimes called risk settings',
	     'Jurisdictions that enable EN are able to modify sensitivity and specificity levels so that the app prioritizes, for instance, detection over accuracy. This is done through a selection of weights and thresholds for Bluetooth signal strength and duration. In SimAEN, values for probability of detection and false discovery rate are used to model the behavior of EN for each encounter.'),
  createData('Exposure Notification', 8, 'Quarantine Compliance After EN', 
	     'Percentage of people adhering to the guidelines to enter quarantine when receiving an EN',
	     'People who enter quarantine encounter far fewer people. The model assumes a percentage of people will adhere to recommendations to quarantine after receiving an EN.'),
  createData('Exposure Notification', 9, 'Sharing Diagnosis Requires Interaction with PH (true/false)', 
	     'If checked, sharing diagnosis through EN requires receiving a one-time code from Public Health via a phone call',
	     'This directly affects the number of calls to and from Public Health. The model assumes a percentage of people will call Public Health after an EN alert. If a call with Public Health is required for people to share their diagnosis with EN, and the code is required for the app to notify others, this will affect the number of people receiving EN alerts.'),
  createData('Manual Contact Tracing', 10, 'Number of Contact Tracers', 
	     'Number of contract tracers deployed to perform contact tracing activities in the region',
	     'As with other numbers provided, model performance and output is focused on considering relative effects. It is more important to choose, for instance, a low number of starting cases and a high number of contact tracers if that ratio represents the situation you are trying to evaluate.'),
  createData('Manual Contact Tracing', 11, 'Quarantine Compliance After CT call', 
	     'Percentage of people adhering to the guidelines to enter quarantine after receiving a CT call to inform them of close contact status',
	     'People who enter quarantine encounter far fewer people. The model assumes a percentage of people will adhere to recommendations to quarantine after receiving a CT call informing them that they are a close contact. In SimAEN, Public Health does not call to convey test results.')
];


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string | JSX.Element }, b: { [key in Key]: number | string | JSX.Element }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'section', numeric: false, disablePadding: false, label: 'Section' },
  { id: 'order', numeric: false, disablePadding: false, label: 'Order of Appearance' },
  { id: 'term', numeric: false, disablePadding: false, label: 'Term' },
  { id: 'definition', numeric: false, disablePadding: false, label: 'Description' },
];

interface EnhancedTableProps {
  headers: HeadCell[],
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { headers, classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
	    className={classes.bold}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  sectionHead: {
    paddingBottom: 0,
  },
  sectionBody: {
    padding: '0px 0px 0px 0px',
  },
  bold: {
    fontWeight: 600,
    lineHeight: 'normal'
  },

  cardsWrapper: {
    padding: '20px'
  },

  card: {
    height: '100%'
  },

  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },

  table: {
    minWidth: 750,
    alignItems: 'center',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function EnhancedTable(rows : Data[], withSectionOrder:boolean = true) {

  let myHeaders = (withSectionOrder ?  headCells : headCells.slice(2));

  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>(withSectionOrder ? 'order' : 'term');
  const [page] = React.useState(0);
  const [rowsPerPage] = React.useState(rows.length)

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
        <TableContainer>
          <Table
            className={classes.table}
            size='small'
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              headers={myHeaders}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

		  if (withSectionOrder) {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.order}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          {row.section}
                        </TableCell>
                        <TableCell align="left">{row.order}</TableCell>
                        <TableCell align="left">{row.term}</TableCell>
                        <TableCell align="left">{row.definition}<br/><i>{row.more}</i></TableCell>
                      </TableRow>
                    );
		  } else {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.term}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          {row.term}
                        </TableCell>
                        <TableCell align="left">{row.definition}<br/><i>{row.more}</i></TableCell>
                      </TableRow>
                    );
		  }
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={2} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
  );
}

interface GlossaryCardProps {
  title: string;
  content: React.ReactNode;
}

export function GlossaryCard(props: GlossaryCardProps) {
  const classes = useStyles();
  const { title, content } = props;
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
          <Card className={classes.card}>
            <CardHeader title={title} 
	      action={
		<IconButton
		  className={clsx(classes.expand, {
			[classes.expandOpen]: expanded,
		    })}
		    onClick={handleExpandClick}
		    aria-expanded={expanded}
		    aria-label="show more"
		>
		  <ExpandMoreIcon />
		</IconButton>
	      }
	    />
	    <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent className={classes.sectionBody}>
                {content}
              </CardContent>
  	    </Collapse>
          </Card>


  );
}

export default function Glossary() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.cardsWrapper}>
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="stretch"
            spacing={4}
          >

          <Grid item xs={9}>
            <Typography align="center" variant="h3" color="textPrimary">
  	      Glossary of Terms
            </Typography>
          </Grid>

          <Grid item xs={10}>
            <GlossaryCard title="General Usage" 
              content={EnhancedTable(rowsGeneral, false)}
            />
	  </Grid>

          <Grid item xs={10}>
            <GlossaryCard title="Model Inputs (Variable)" 
              content={EnhancedTable(rowsInputs)}
            />
	  </Grid>

          <Grid item xs={10}>
            <GlossaryCard title="Model Inputs (Fixed)" 
              content={EnhancedTable(rowsFixed)}
            />
	  </Grid>

          <Grid item xs={10}>
            <GlossaryCard title="Model Outputs" 
              content={EnhancedTable(rowsOutputs)}
            />
	  </Grid>

        </Grid>

      </div>
    </div>
  );
}
