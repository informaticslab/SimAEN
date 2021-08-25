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

import makeStyles from "@material-ui/core/styles/makeStyles";

import { formatInt } from "../App";

export type StackedBarData = {
  value: number,
  color: string,
}

export type StackedBarProps = {
  data: StackedBarData[],
  labelClass?: string
}

const useStackedBarStyles = makeStyles({
  root: {
    width: '100%',
    height: '30px',
    display: 'flex'
  },
  bar: {
    display: 'inline-block',
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: '26px'
  },
  label: {
    display: 'inline',
    userSelect: 'none',
    fontSize: '1rem',
    fontWeight: 600
  }
});

export function StackedBar(props: StackedBarProps) {
  const classes = useStackedBarStyles();
  const total = props.data.reduce((accum, item) => accum + item.value, 0);

  return (
    <div className={classes.root}>
      {props.data.map((item, idx) => {
        const percent = (item.value || 0) / (total || 1) * 100;
        return (
          <div
            key={idx}
            className={classes.bar}
            title={`${formatInt(item.value)} (${percent.toFixed()}%)`}
            style={{
              width: `${percent}%`,
              backgroundColor: item.color
            }}
          >
            <span className={`${props.labelClass} ${classes.label}`}>
              {formatInt(item.value)} ({percent.toFixed()}%)
              </span>
          </div>
        )
      })}
    </div>
  );
}