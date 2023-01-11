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

import { Link as RouterLink } from "react-router-dom";
import Link from '@material-ui/core/Link';
import { RefLink, NiceLink } from '../api';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from '@material-ui/core/CardMedia';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import workflowGraphic from '../images/SIMAEN_Details_Workflow.png';
import modelGraphic from '../images/SIMAEN_Details_Model.gif';
import parametersGraphic from '../images/SIMAEN_Details_Parameters.png';
import graphGraphic from '../images/SIMAEN_Details_Graph.gif';
import blemurGraphic from '../images/SIMAEN_Details_BLEMUR.png';
import inputsOutputsGraphic from '../images/SIMAEN_Details_InputsOutputs.png';

import { LitReference, references } from '../references';

const useStyles = makeStyles((theme) => ({
  media: {
    width: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    objectFit: 'scale-down',
  },
  popMedia: {
    filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,.3)) drop-shadow(0px 0px 10px rgba(0,0,0,.3))',
  },
  bold: {
    fontWeight: 600,
  },

  explanation: {
    color: theme.palette.text.hint
  },

  cardsWrapper: {
    padding: '20px'
  },

  card: {
    height: '100%',
    padding: '0px 20px 0px 20px'
  },

  sideBySide: {
    padding: '20px 0px 20px 0px'

  },
  overlay: {
    padding: '0px 0px 0px 30px',
    alignSelf: 'center'
  }


}));

type propsType = {
  currentTab?: number;
  setCurrentTab?: (value: number) => void;
};

const formatReference = (ref:LitReference) => (
     <Typography variant="inherit">{ref.Authors} ({ref.Date}). {ref.Title}. {ref.Publication}. <NiceLink href={ref.Href} text={ref.LinkText}/> </Typography>
);

export default function ModelDetails(props: propsType) {
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
	    Model Details
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Introduction
                </Typography>
		<Typography variant="body1" component="p" paragraph className={classes.explanation}>
                    Exposure Notification (EN) is a new technology that has been introduced as a prevention measure during the COVID-19 pandemic, to supplement traditional contact tracing. It uses Bluetooth Low Energy (BLE) radios within smartphones as proximity sensors. It is coupled with defined close contact algorithms to alert individuals that they may have been exposed to COVID-19.<RefLink n="1"/>
                </Typography>
		<Typography variant="body1" component="p" paragraph className={classes.explanation}>
		    To estimate the impact of EN, “simulation automated exposure notification” (SimAEN) was developed by researchers at MIT Lincoln Laboratory with CDC funding. SimAEN aims to estimate the impact of EN implementation on reducing the spread of COVID-19, along with other key public health interventions, such as traditional contact tracing, mask wearing, vaccination, and testing.  
                </Typography>
		<Typography variant="body1" component="p" paragraph className={classes.explanation}>
		    SimAEN is structured to compare the relative impacts of different public health interventions.  
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Model Workflow and Assumptions
                </Typography>
                <CardMedia
                  className={classes.media}
                  image={workflowGraphic}
                  title="Model Workflow"
                  component="img"
                />
		<Typography variant="body1" component="p" paragraph className={classes.explanation}>
		  <br/>The workflow SimAEN uses is a simplified version of real-world actions surrounding COVID-19 exposure and interactions with public health.
                </Typography>

		<Grid container item className={classes.sideBySide}>
		   <Grid container item xs={6} >
                       <CardMedia 
                         className={classes.media}
                         image={modelGraphic}
                         title="Animation of Days 0 to 1"
                         component="img"
                       />
		   </Grid>
                   <Grid container item xs={6} className={classes.overlay}>
    		       <Typography variant="body1" component="p" paragraph className={classes.explanation}>
		         Each agent in the model represents a person, with the model governing interactions and likelihoods on a personal level. The model starts with only infected people and advances one day at a time. Each person receives an updated infection status, interacts with other persons, and updates their status (e.g., enters quarantine or gets a test). 
                       </Typography>
		   </Grid>
		</Grid>
		<Grid container item className={classes.sideBySide}>
		   <Grid container item xs={6}>
                      <CardMedia
                        className={`${classes.media} ${classes.popMedia}`}
                        image={parametersGraphic}
                        title="Selecting Parameter Values"
                        component="img"
                      />
		   </Grid>
                   <Grid container item xs={6} className={classes.overlay}>
      		     <Typography variant="body1" component="p" paragraph className={classes.explanation}>
                        Parameters govern how many people the initial infected person contacts, the likelihood the contact will become infected, will get tested, will get contacted by public health, and so on. This saves computation time by only creating and using agents while they are needed by the model. 
                      </Typography>
		   </Grid>
		</Grid>
		<Typography variant="body1" component="p" paragraph className={classes.explanation}>
                  Though the web app limits parameter adjustment to improve calculation speed, the model code can be rapidly adapted to incorporate additional parameters, including testing delays and time for transitioning out of quarantine after negative tests, or to adapt to different disease spread models.<RefLink n="2"/>
                </Typography>
		<Typography variant="body1" component="span" paragraph className={classes.explanation}>
		  <ul>
		    <li>For more details on model design, see <NiceLink href="https://www.ll.mit.edu/sites/default/files/publication/doc/simulation-automated-exposure-notification-(simaen)-schuldt-acta-5.pdf" text="the project report" />.</li>
		    <li>For more details on model parameters, settings, and references, see the <Link to="/glossary" color="inherit" variant="body1" underline="always" component={RouterLink}>Glossary</Link>.</li>
		    <li><NiceLink href="https://github.com/informaticslab/SimAEN" text="Download the model code" />.</li>
		  </ul>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Parameters and Validation
                </Typography>
		<Typography variant="body1" component="p" paragraph className={classes.explanation}>
		  Default values for probabilities were calibrated based on documented EN experiences in the United Kingdom<RefLink n="3"/> and Switzerland<RefLink n="4"/>, as well as MIT LL EN performance testing, and subject matter expert interviews. Researchers additionally looked to established literature<RefLink n="5-9"/> to model how COVID-19 spreads throughout the population.
                </Typography>
		<Grid container item className={classes.sideBySide}>
		   <Grid container item xs={6}>
                      <CardMedia
                        className={classes.media}
                        image={graphGraphic}
                        title="Averaging of Model Runs"
                        component="img"
                      />
		   </Grid>
                   <Grid container item xs={6} className={classes.overlay}>
   		      <Typography variant="body1" component="p" paragraph className={classes.explanation}>
		        Because agent actions in agent-based models are governed by probabilities, each model run is not identical. Twenty simulations were performed with SimAEN, and results were averaged across all runs to determine “output” numbers shown in this web application. Documented EN experiences<RefLink n="4-5"/> were used to calibrate model output by comparing model averages to expected output based on literature review.
		      </Typography>
		   </Grid>
		</Grid>
		<Grid container item className={classes.sideBySide}>
		   <Grid container item xs={6}>
                      <CardMedia
                        className={classes.media}
                        image={blemurGraphic}
                        title="Detection When Too Close For Too Long"
                        component="img"
                      />
		   </Grid>
                   <Grid container item xs={6} className={classes.overlay}>
		       <Typography variant="body1" component="p" paragraph className={classes.explanation}>
  		           Researchers used a MIT LL model developed to quantify EN performance. BLEMUR, the Bluetooth Low Energy Model for User Risk, predicts whether a phone using the Google|Apple EN protocol<RefLink n="1"/> will detect a phone that is actually too-close-for-too-long, or will create a false positive. BLEMUR is backed by measurements of EN performance on smartphones in laboratory and real-world environments.
		       </Typography>
		   </Grid>
		</Grid>
		<Typography variant="body1" component="p" paragraph className={classes.explanation}>
		  SimAEN has over 50 input parameters; all of these are variable in the open source code. We exposed eleven of them to the user as "variable" inputs in the web tool to give people a feel for model behavior, while the rest use "fixed" values. A high-level overview of the relationships between model inputs (parameters) and outputs (metrics) is shown in the diagram below. 
Each 30-day model run generates and captures the complex interactions between probabilities, agent interactions, and the effects of interactions. 
The grey modules on the left represent the parameters that users can vary. These match the input menus on the <Link to="/model" color="inherit" variant="inherit" underline="always" component={RouterLink} >Set & Run Model</Link> page. The model outputs from the Analysis Quick Look section are represented by the blue modules on the right. The modules and connections in the center show a simplified view of SimAEN's internal state. The model's internal components include aspects of disease spread and intervention strategies, represented by white modules. Those modules which directly translate into model outputs are highlighted in blue.
                </Typography>
		<Typography variant="body1" component="p" paragraph className={classes.explanation}>
The model includes several feedback loops. Positive (amplifying) effects are shown with green solid arrows, and negative (reducing) effects are shown with red dashed arrows. As each model run plays out over 30 days, the numbers of tests, calls, infections, isolations, and quarantines are tracked and reported out. As each model run is not identical, we run the module multiple times and average the outputs to produce a more accurate prediction for a given combination of input parameters.
                </Typography>
                <CardMedia
                  className={classes.media}
                  image={inputsOutputsGraphic}
                  title="Complex Relationships of Model Inputs and Outputs"
                  component="img"
                />
		<Typography variant="body1" component="span" paragraph className={classes.explanation}>
		<ul>
		  <li>For more performance and validation details, see see <NiceLink href="https://www.ll.mit.edu/sites/default/files/publication/doc/simulation-automated-exposure-notification-(simaen)-schuldt-acta-5.pdf" text="the project report" />.</li>
		  <li>For MIT LL BLE datasets, see the <NiceLink href="https://github.com/mitll/PACT" text="github repository"/>.</li>
		</ul>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card} role="doc-endnotes">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  References
                </Typography>
		<Typography variant="body1" component="span" paragraph className={classes.explanation} id="references">
		  <ol>		
		    <li><NiceLink href="https://www.google.com/covid19/exposurenotifications/" text="Google|Apple Exposure Notifcation Specifications" /> </li>
		    <li>{formatReference(references.simaen_phr)}</li>
		    <li>{formatReference(references.simaen_report)}</li>
		    <li>{formatReference(references.briers)}</li>
		    <li>{formatReference(references.pluss)}</li>
		    <li>{formatReference(references.pierlinck)}</li>
		    <li>{formatReference(references.backer)}</li>
		    <li>{formatReference(references.watson)}</li>
		    <li>{formatReference(references.poletti)}</li>
		    <li>{formatReference(references.laxminarayan)}</li>
		  </ol>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
      </Grid>

      </div>
    </div>
  );
}
