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

import { Fragment } from "react";

import { formatInt, formatFloat } from "../App";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import ExpandMore from "@material-ui/icons/ExpandMore";

import { FixedParamField, fixedParamFieldMap } from "../constants";
import { FixedParams } from "../models";

const Sections = new Set(Object.values(fixedParamFieldMap).map((field) => field.Section));

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100% !important',
        margin: '0 !important'
    },
    mainTitle: {
        fontWeight:'bold',
        color: theme.palette.text.primary,
	padding: '0px 0px 0px 8px'
    },

    title: {
        fontWeight:'bold',
        color: theme.palette.text.hint
    },

    section: {
        padding: '8px'
    },

    details: {
        flexDirection: 'column'
    },

    divider: {
        margin: '5px 0px'
    },
}));

export interface FixedParamsPanelProps {
    fixedParams: FixedParams
}

function combine(value:boolean|number|undefined, field:FixedParamField) {
    if (typeof(value) === 'undefined') return "NaN";

    if (typeof(value) === 'boolean' || typeof(value) === 'string') {
	return value;
    } else if (field.Units === '%') {
      return value + field.Units;
    } else if (field.Label === 'Daily Test Capacity' && value === 0) {
      return 'infinite';
    } else {
	let units = ' ' + field.Units;
	if (field.Units === "hour" || field.Units === "day") {
	    units = units + (value === 1 ? "" : "s"); 
	}
	let val = (Number.isInteger(value) ? formatInt(value) : formatFloat(value));
	return val + units;
    }
}

export function FixedParamsPanel({fixedParams}: FixedParamsPanelProps) {
    const classes = useStyles();

    return (
        <Accordion className={classes.root}>
            <AccordionSummary expandIcon={<ExpandMore />} className={classes.mainTitle}>
                Fixed Model Parameters
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
                {Array.from(Sections).map((section, idx) => (
                    <Grid key={section} container alignItems="center" spacing={2} className={classes.section}>
                        <Grid item xs={12}>
                            {idx > 0 && <Divider className={classes.divider} />}
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                {section}
                            </Typography>
                        </Grid>
                        {Object.entries(fixedParamFieldMap)
                            .filter(([key, field]) => field.Section === section)
                            .map(([key, field]) => (
                            <Fragment key={key}>
                                <Grid item md={9} sm={12}>
                                    <Tooltip title={field.Popover} placement="bottom-end">
                                        <InputLabel
                                            id={key}
                                            htmlFor={'input-' + key}
                                        >
                                            {field.Label}
                                        </InputLabel>
                                    </Tooltip>
                                </Grid>
                                <Grid item md={3} sm={12}>
                                    {fixedParams ? combine(fixedParams[key as keyof FixedParams], field) : ''}
                                </Grid>
                            </Fragment>
                        ))}
                    </Grid>
                ))}
            </AccordionDetails>
        </Accordion>
    )
}
