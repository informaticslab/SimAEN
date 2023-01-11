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
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { Mailto } from "../App";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 140,
  },
  pos: {
    marginBottom: 12,
  },
  bold: {
    fontWeight: 600,
  },

  question: {
    fontWeight:'bold',
    color: theme.palette.text.primary
  },

  answer: {
    color: theme.palette.text.hint
  },

  cardsWrapper: {
    padding: '20px'
  },

  card: {
    height: '100%'
  },

}));

type propsType = {
  currentTab?: number;
  setCurrentTab?: (value: number) => void;
};
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
	    Frequently Asked Questions
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.question} gutterBottom>
                Will SimAEN tell me how many infections to expect in my jurisdiction after the prescribed period?
                </Typography>
                <Typography className={classes.answer} gutterBottom>
No. SimAEN is not designed to be a predictive model for long term spread of infection. The purpose of SimAEN is to allow users to visualize impact of different interventions on stopping the spread of COVID-19. SimAEN can estimate how many infections might be prevented by implementing interventions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.question} gutterBottom>
                  I am interested in changing a variable but I don't see it listed in the interface. Can I access that variable through some other means?
                </Typography>
                <Typography className={classes.answer} gutterBottom>
                  Currently SimAEN only allows users to manipulate the variables described. While SimAEN is able to perform simulations relatively quickly, it is not fast enough for a satisfying real-time interactive experience. Future iterations may permit direct user interaction, but not at the current time. If you really need to see the results of changing your variable of interest, please <Link underline='always' color="inherit" href={`mailto:${Mailto.email}?subject=${Mailto.subject}`}>email us</Link> and we will work with you to complete the simulations of interest.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.question} gutterBottom>
                  Why do some output values not add up?
                </Typography>
                <Typography className={classes.answer} gutterBottom>
                  Because of boundary effects and other transition states there may be counts that appear to cover the entire space but do not fully sum in practice. If you believe there is an error, please <Link underline='always' color="inherit" href={`mailto:${Mailto.email}?subject=${Mailto.subject}`}>email us</Link> and include a screen shot of the scenario you are running.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.question} gutterBottom>
                  Why is the number of infected people so high compared to my region's actual statistics?
                </Typography>
                <Typography className={classes.answer} gutterBottom>
		SimAEN models not just the symptomatic but also the asymptomatic infected individuals. The symptomatic individuals are much more likely to be visible to health officials in the region as they are the ones who get tested or contact public health because of their symptoms. In the case of COVID-19 there is strong evidence that asymptomatic individuals are still capable of spreading the disease so it is critical that this aspect is modeled. However, just like in real life, the asymptomatic individuals in the model are unlikely to interact with public health. This means that while the infection numbers are high the burden on public health will be more closely tied to the symptomatic individuals.                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.question} gutterBottom>
                  Your lowest number of starting cases is too high for my state. Can I take the model results and scale them down to match my population size?
                </Typography>
                <Typography className={classes.answer} gutterBottom>
                  Yes, if you are careful to only scale "numbers of people" and not rates or probabilities. For instance, if you halve <i>both</i> the number of starting cases and the number of contact tracers, then you can also halve all of the "number of people" outputs, and R would be the same.

{ /* “We don’t assume a fixed population because SimAEN is a model of public healthcare, not a model of disease. Instead of creating high fidelity results of how disease will spread within a population we model how changes in the public health workflow affect the rate of disease spread and estimate the number of people who will be impacted by the changes. The number of people that public health interacts with is only a function of the number of people who are infected, as uninfected people (who otherwise have no reason to believe that they are infected) are unlikely to reach out to public health. Whether you are interested in a city or a state, use the estimates corresponding to the cases you are currently seeing.”
*/ }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.question} gutterBottom>
                  Will SimAEN work for small settings like a college campus?
                </Typography>
                <Typography className={classes.answer} gutterBottom>
                  The simulation is optimized to run quickly for a state-level population, by not simulating the unaffected members of the population. However, this can also result in unreliable predictions for small populations where herd immunity effects may be sufficiently dominant to affect the spread of the disease.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.question} gutterBottom>
                  Will SimAEN work for diseases other than COVID?
                </Typography>
                <Typography className={classes.answer} gutterBottom>
                  The SimAEN model as implemented on this web site is tuned for the current understanding of how COVID spreads, the incubation period of the disease, etc. However, if you are interested in modeling interventions for other diseases, the agent-based model is appropriate when tuned correctly for that disease. Please contact the SimAEN development team to discuss your approach.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.question} gutterBottom>
                  I downloaded the report, but I don't understand how the web interface variables map to the variables in the paper. Help!
                </Typography>
                <Typography className={classes.answer} gutterBottom>
                  We have provided a mapping of variable names from the model code to user-friendly labels in the <Link underline='always' color="inherit" href="https://github.com/informaticslab/SimAEN/blob/main/Simaen-Model/parameter_name_mapping.txt" target="_blank">model source code.</Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.question} gutterBottom>
                  Do simulated individuals change their behavior as the conditions in the simulation (for example, number of current infections) change in time?
                </Typography>
                <Typography className={classes.answer} gutterBottom>
                  SimAEN does not change the values of any parameters after the simulation is started. All of the state transition probabilities will be the same for the duration of the simulation. To see all assumptions for the base model, please view the "Fixed Parameters" section at the end of <Link to="/model" color="inherit" variant="body1" underline="always" component={RouterLink}>Set & Run Model</Link>. Citations for values are linked in the <Link to="/glossary" color="inherit" variant="body1" underline="always" component={RouterLink}>Glossary</Link>.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

      </div>
    </div>
  );
}
