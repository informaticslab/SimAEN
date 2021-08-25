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

import axios from "axios";
import Link from '@material-ui/core/Link';
import { FixedParams, FormType, SimulationResult } from "./models";

export function getData(data: FormType):Promise<SimulationResult> {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/data`, { params: data })
    .then((res) => {
      return (res.data) as SimulationResult;
    });
}

export function getFixedParams(configId: Number):Promise<FixedParams> {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/fixed_params`, { params: {id: configId} })
    .then((res) => {
      const fixedParams = res.data;
      fixedParams.vaccinated_people_can_spread_asymptomatically =
        Boolean(fixedParams.vaccinated_people_can_spread_asymptomatically);
      return fixedParams as FixedParams;
    });
}

export const RefLink = (props:{n:string}) => <Link underline="always" color="inherit" href="#references"><sup>{props.n}</sup></Link>;
export const SimpleLink = (props:{href:string}) => <Link target="_blank" underline="always" color="inherit" href={props.href}>{props.href}</Link>;
export const NiceLink = (props:{href:string, text:string}) => <Link target="_blank" underline="always" color="inherit" href={props.href}>{props.text}</Link>;

