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

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from '@material-ui/core/CardMedia';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Link from '@material-ui/core/Link';

import headerGraphic from '../Simean_Header.png';
import agentGraphic from '../images/SIMAEN_Home_AgentBased.png';
import expertsGraphic from '../images/SIMAEN_Home_Experts.png';
import dataGraphic from '../images/SIMAEN_Home_Data.png';
import validatedGraphic from '../images/SIMAEN_Home_Validated.png';

const useStyles = makeStyles((theme) => ({
  media: {
    width: '100%',
    backgroundColor: 'white'
  },
  mitll: {
    border: 'none',
    boxShadow: 'none',
    width: '100%',
  },
  pos: {
    marginBottom: 12,
  },
  bold: {
    fontWeight: 600,
  },
  banner: {
    height: 170,
    backgroundImage: `url(${headerGraphic})`,
    backgroundSize: 'auto'
  },
  card: {
    height: '100%',
    backgroundColor: 'white'
  },
  cardsWrapper: {
    padding: '20px'
  },

  tryMe: {
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 'large'
  },
  
  screenshot: {
    boxShadow: '-1px 1px 10px 0px grey',
    borderRadius: '2px',
    transform: 'translateX(40px) translateY(80px) rotate(-10deg);',
    height: '325px',
    marginLeft: '50px',
    zIndex: 0
  },

  screenshotWrapper: {
    maxWidth:  '950px'
  },

  overlay: {
    zIndex: 0
  },

  subtitle: {
    color: theme.palette.text.hint
  }
}));

type propsType = {
  currentTab?: number;
  setCurrentTab?: (value: number) => void;
};
export default function About(props: propsType) {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.banner} />
      <div className={classes.cardsWrapper}>
        <Grid container
          direction="row"
          justify="center"
          alignItems="stretch"
          spacing={4}
        >

          <Grid item />
          <Grid item xs={9}>
            <Typography gutterBottom align="center" variant="h3" color="textPrimary">
              Simulated Automated Exposure Notification (SimAEN) 
            </Typography>
            <Typography gutterBottom align="center" variant="h5" className={classes.subtitle}>
              Explore the impact of Exposure Notification, combined with your public health organization's strategies and resources, to help your team make informed choices.
            </Typography>
          </Grid>
          <Grid item />
        </Grid>

        <Grid container
          direction="row"
          justify="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid container item className={classes.screenshotWrapper}>
            <Hidden smDown>
              <Grid container item md={6}>
                  <img src="/screenshot.png" alt="Application Screenshot" className={classes.screenshot}></img>
              </Grid>
            </Hidden>
            <Grid container item xs={12} md={6} className={classes.overlay}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Optimizing Public Health Decisions
                </Typography>
                  <Typography variant="body2" component="p" paragraph>
                    SimAEN is an advanced model of public health options for COVID response. It enables decision-makers to quickly compare and contrast the impacts of Exposure Notifications (EN) and other strategies, and seek the optimal combination and integration of them. It aims to help public health professionals quickly answer questions about workflows, policies, and resource impacts, in the face of evolving circumstances.
                </Typography>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Impacts of Interventions for COVID
                </Typography>
                  <Typography variant="body2" component="p" paragraph>
                    SimAEN leverages the best available research to provide realistic and actionable insights on the interactions between Exposure Notifications (EN), other interventions, public behavior, and disease spread. The model
incorporates data from laboratory performance testing of EN, peer-reviewed research, and metrics from multiple jurisdictions. It focuses on the effects which relate to COVID's impact on a community: the number of COVID infections, the number of tests performed, and the number of people required to quarantine after being identified as a close contact.
                </Typography>
                  <CardActions className={classes.tryMe} >
                    <Button
                      size="large"
                      variant="contained"
                      color="secondary"
                      to="/model"
                      component={RouterLink}
                      className={classes.tryMe}
                    >
                      Try SimAEN
                  </Button>
                  </CardActions>
                </CardContent>
              </Card>
              <Typography gutterBottom align="center" >
                <br/>
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid container
          direction="row"
          justify="center"
          alignItems="stretch"
          spacing={4}
          style={{ backgroundColor: "#0D616E" }}
        >

          <Grid item xs={7}>
            <Typography gutterBottom align="center" variant="h4" style={{ color: "#FFFFFF" }}>
              <br/>SimAEN Features
          </Typography>
{/*            <Typography gutterBottom align="center" variant="h6" style={{ color: "#FFFFFF" }}>
              Consider the impact of your public health organization workflow, policy, and resources based on best available research.
          </Typography> */}
          </Grid>
        </Grid>

        <Grid container
          direction="row"
          justify="center"
          alignItems="stretch"
          spacing={4}
          style={{ backgroundColor: "#0D616E" }}
        >

          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={agentGraphic}
                title="Agent-Based Framework"
                component="img"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Agent-Based Framework
                </Typography>
                <Typography variant="body2" text-align="center" component="p" paragraph>
                  SimAEN is an agent-based framework, which generates individual "people" and monitors their interactions. Model inputs, such as the number of initial COVID infections and the vaccination rate, affect whether interactions between agents result in new infections. 
                  <br/><br/>
              </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={expertsGraphic}
                title="Public Health Experts"
                component="img"
              />
              <CardContent>
                <Typography variant="h5" text-align="center" gutterBottom>
                  Developed With/For Public Health Experts
                </Typography>
                <Typography variant="body2" component="p" paragraph>
                  SimAEN was developed with input from public health decision makers and tested by public health professionals to gear the capabilities towards the needs of public health.
                  <br/><br/>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={validatedGraphic}
                title="Real-world validation"
                component="img"
              />
              <CardContent>
                <Typography variant="h5" text-align="center" gutterBottom>
                  Validated Against<br/>Real-World Data
                </Typography>
                <Typography variant="body2" component="p" paragraph>
                  SimAEN is calibrated with data from jurisdictions across the US and in Europe, enabling public health officials to make decisions based on simulations of real-world data that are much closer to reports of reality on-the-ground.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={dataGraphic}
                title="Parameter exploration"
                component="img"
              />
              <CardContent>
                <Typography variant="h5" text-align="center" gutterBottom>
                  Explore Parameters Based on Your Data
                </Typography>
                <Typography variant="body2" component="p" paragraph>
                Users start with default parameter values based on real-world data, and can change the availability and engagement with contact tracing systems, as well as adherence to quarantine and masking requirements.
                <br/> 
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={4}
          style={{ backgroundColor: "#0D616E", height: '150px' }}
        >

          <Grid item className={classes.tryMe}>
            <Button
              size="large"
              variant="contained"
              color="secondary"
              to="/model"
              component={RouterLink}
              className={classes.tryMe}
            >
              Try SimAEN
          </Button>
          </Grid>
        </Grid>

        <Grid container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={4}
          style={{ backgroundColor: "#FFFFFF" }}
        >

          <Grid item xs={8}>
            <Typography align="center" variant="h4" className={classes.subtitle}>Supporting Information</Typography>
	    <br/>
            <Typography align="center" variant="h6">
              <Link href="https://www.ll.mit.edu/sites/default/files/publication/doc/simulation-automated-exposure-notification-(simaen)-schuldt-acta-5.pdf" target="_blank">
                Read the SimAEN project report
              </Link>
            </Typography>

            <Typography align="center" variant="h6">
              <Link href="https://github.com/informaticslab/SimAEN" target="_blank">
                Download the SimAEN source code
              </Link>
            </Typography>

            <Typography align="center" variant="h6">
              <Link href="https://www.google.com/covid19/exposurenotifications/" target="_blank">
                Dive into the Exposure Notification documentation
              </Link>
            </Typography>

            <Typography align="center" variant="h6">
              <Link href="http://pact.mit.edu/" target="_blank">
                Get technical with the PACT protocol and datasets
              </Link>
            </Typography>

	  </Grid>
          <Grid item xs={7}>
            <Typography align="center" variant="h6" >
	      SimAEN was originally developed by the Humanitarian Assistance and Disaster Response group and others at MIT's <Link href="http://www.ll.mit.edu/" target="_blank">Lincoln Laboratory</Link>, a Federally Funded Research and Development Center.
	    </Typography>
          </Grid>

        </Grid>
      </div>
    </div>
  );
}
