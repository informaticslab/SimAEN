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

import React, { useState } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { LineSeries, FlexibleWidthXYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LineSeriesPoint, AreaSeries, Crosshair, DiscreteColorLegend, AbstractSeriesPoint } from "react-vis";
import { SimulationResult, sum } from "../../models";
import { results } from "../../constants";
import { InfectionColors, TestColors } from "../../colors";

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
  
  card: {
    height: '100%'
  },

  legend: {
    "& path": {
      strokeWidth: "4"
    }
  }
}));

const pivot = (values: number[] | undefined): LineSeriesPoint[] => {
  if (values && values.length) {
    return values.map((val, idx) => ({x: idx, y: val}));
  }
  return [];
}

const updateCrosshairs = (setCrosshairs: React.Dispatch<React.SetStateAction<AbstractSeriesPoint[]>>, idx: number, val: AbstractSeriesPoint) => {
  setCrosshairs((prev) => {
    const n = prev.slice();
    n[idx] = val;
    return n;
  })
}

export type BreakdownByDayProps = {
  model: SimulationResult | undefined
}

export default function BreakdownByDay({model}: BreakdownByDayProps) {
  const classes = useStyles();

  const [crosshairs1, setCrosshairs1] = useState<AbstractSeriesPoint[]>([]);
  const [crosshairs2, setCrosshairs2] = useState<AbstractSeriesPoint[]>([]);

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                EN Alerts vs Positive Testing
              </Typography>
              <FlexibleWidthXYPlot
                height={400}
                margin={{left: 50}}
                // prevent a negative axis range when all values are zero
                yDomain={sum(model?.pos_aen, 0) === 0 && sum(model?.aen_triggered_tests, 0) === 0 ? [0, 1] : undefined}
                onMouseLeave={() => setCrosshairs1([])}>
                  <LineSeries
                    color={InfectionColors.AEN}
                    data={pivot(model?.pos_aen)}
                    onNearestX={(p) => updateCrosshairs(setCrosshairs1, 0, p)}
                    style={{
                      strokeWidth: '3px'
                    }}
                  />
                  <LineSeries
                    color={TestColors.OTHER}
                    data={pivot(model?.aen_triggered_tests)}
                    onNearestX={(p) => updateCrosshairs(setCrosshairs1, 1, p)}
                    style={{
                      strokeWidth: '3px'
                    }}
                  />
                  <HorizontalGridLines />
                  <VerticalGridLines />
                  <XAxis title="Days" style={{
                    title: {
                      fontSize: '12pt',
                      fontWeight: 'bold',
                      fill: 'black',
                      textShadow: 'white 0px 0px 10px, white 1px 1px 2px'
                    }
                  }}/>
                  <YAxis title="Testing Due to EN" style={{
                    title: {
                      fontSize: '12pt',
                      fontWeight: 'bold',
                      fill: 'black',
                      textShadow: 'white 0px 0px 10px, white 1px 1px 2px'
                    }
                  }}/>
                  <Crosshair values={crosshairs1}
                    itemsFormat={(a) => {
                      return [
                        {title: 'Positive Test With EN', value: a[0].y},
                        {title: 'Test Due to EN Only', value: a[1].y},
                      ];
                    }}
                    titleFormat={(a) => {
                      return {title: 'Day', value: a[0].x}
                    }}
                  />
              </FlexibleWidthXYPlot>
              <DiscreteColorLegend
                className={classes.legend}
                orientation="horizontal"
                items={[{
                  title: 'Positive Test With EN',
                  color: InfectionColors.AEN
                }, {
                  title: 'Test Due to EN Only',
                  color: TestColors.OTHER
                }]}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Breakdown of Positive Tests By Reason
              </Typography>
              <FlexibleWidthXYPlot
                height={400}
                margin={{left: 50}}
                stackBy="y"
                onMouseLeave={() => setCrosshairs2([])}
                >
                <AreaSeries
                  color={InfectionColors.AEN}
                  data={pivot(model?.pos_aen)}
                  onNearestX={(p) => updateCrosshairs(setCrosshairs2, 0, p)}
                />
                <AreaSeries
                  color={InfectionColors.CT}
                  data={pivot(model?.pos_mct)}
                  onNearestX={(p) => updateCrosshairs(setCrosshairs2, 1, p)}
                />
                <AreaSeries
                  color={InfectionColors.AEN_CT}
                  data={pivot(model?.pos_both)}
                  onNearestX={(p) => updateCrosshairs(setCrosshairs2, 2, p)}
                />
                <AreaSeries
                  color={InfectionColors.NONE}
                  data={pivot(model?.pos_none)}
                  onNearestX={(p) => updateCrosshairs(setCrosshairs2, 3, p)}
                />
                <HorizontalGridLines />
                <VerticalGridLines />
                <XAxis title="Days" 
                 style={{
                  title: {
                    fontSize: '12pt',
                    fontWeight: 'bold',
                    fill: 'black',
                    textShadow: 'white 0px 0px 10px, white 1px 1px 2px'
                  }
                }}/>
                <YAxis title="Positive Cases" style={{
                  title: {
                    fontSize: '12pt',
                    fontWeight: 'bold',
                    fill: 'black',
                    textShadow: 'white 0px 0px 10px, white 1px 1px 2px'
                  }
                }}/>
                <Crosshair values={crosshairs2}
                  itemsFormat={(a) => {
                    return [
                      {title: results.pie_got_en.Label, value: a[0]?.y},
                      {title: results.pie_got_call.Label, value: a[1]?.y - a[1]?.y0},
                      {title: 'Both '+results.pie_got_both.Label, value: a[2]?.y - a[2]?.y0},
                      {title: 'Received Neither', value: a[3]?.y - a[3]?.y0},
                      {title: 'Total', value: a.reduce((accum: number, i:{y:number, y0:number}) =>
                        accum + (i.y - (i.y0 || 0)), 0)}
                    ];
                  }}
                  titleFormat={(a) => {
                    return {title: 'Day', value: a[0].x}
                  }}
                />
              </FlexibleWidthXYPlot>
              <DiscreteColorLegend
                className={classes.legend}
                orientation="horizontal"
                items={[{
                  title: results.pie_got_en.Label,
                  color: InfectionColors.AEN
                }, {
                  title: results.pie_got_call.Label,
                  color: InfectionColors.CT
                }, {
                  title: 'Both '+results.pie_got_both.Label,
                  color: InfectionColors.AEN_CT
                }, {
                  title: 'Received Neither',
                  color: InfectionColors.NONE
                }]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </div>
  );
}
