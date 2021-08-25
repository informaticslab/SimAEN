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

export type LabeledBarProps = {
  /** bar color */
  color: string,
  /** value represented by the bar */
  value?: number,

  /** total value represented by the bar */
  total: number,

  /**
   * Optional value to use for calculating the percentage label,
   * if different then the line width percentage
   */
  labelTotal?: number,
  
  /** Optional class applied to the label for custom styling */
  labelClass?: string
}

const useLabeledBarStyles = makeStyles({
  root: {
    width: '100%',
    height: '30px',
    display: 'flex'
  },
  bar: {
    display: 'inline-block'
  },
  label: {
    paddingLeft: '5px',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
    fontWeight: 600
  }
});

export function LabeledBar(props: LabeledBarProps) {
  const classes = useLabeledBarStyles();
  const percent = (props.value || 0) / (props.total || 1) * 100;
  const percentLabel = (props.labelTotal) ?
    (props.value || 0) / (props.labelTotal || 1) * 100 :
    percent;
  return (
    <div className={classes.root}>
      <div className={classes.bar} style={{
        width: `${percent}%`,
        backgroundColor: props.color
      }}></div>
      <div className={`${props.labelClass} ${classes.label}`}>
        {formatInt(props.value)} ({parseInt(percentLabel.toFixed()) < 1 ? "<1" : percentLabel.toFixed()}%)
      </div>
    </div>
  );
}
