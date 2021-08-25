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


import { SCALE, values, results } from "../constants";

import { FormType, SimulationResult, FixedParams } from "../models";
import { fixedParamFieldMap } from "../constants";

export function CsvDataCompare(compareForms: FormType[], 
                               compareResults: (SimulationResult|undefined)[],
			       fixedParams: FixedParams|undefined) : string[]{

  if (compareResults && compareResults[0] && compareResults[1] && fixedParams) {

    var csv = [];

    for (var i = 0; i < compareResults.length; i++) {
    	let label = i+1;
        var partial = CsvData(compareForms[i], compareResults[i], fixedParams);
        for (var j in partial) {
	    csv.push("Scenario "+label+","+partial[j]);
        }
    }

    return csv;

  } else {
    return ["something went wrong",
            "please refresh and try again"];
  }
}

export function CsvData(form: FormType, model: SimulationResult|undefined, fixedParams: FixedParams|undefined ): string[] {

  if (model && form && fixedParams) {

    var csv = [
        "input,\"" + values.starting_cases.Label + "\"," + form.starting_cases * SCALE,
        "input,\"" + values.interaction_level.Label + "\"," + values.interaction_level.titles[form.interaction_level],
        "input,\"" + values.p_vaccinated.Label + "\"," + form.p_vaccinated,
        "input,\"" + values.p_mask_given_norm.Label + "\"," + form.p_mask_given_norm,
        "input,\"" + values.test_delay.Label + "\"," + form.test_delay,
        "input,\"" + values.p_running_app.Label + "\"," + form.p_running_app,
        "input,\"" + values.risk_settings.Label + "\"," + form.risk_settings,
        "input,\"" + values.p_maximal_restriction_given_aen_notification.Label + "\"," + 
            form.p_maximal_restriction_given_aen_notification,
        "input,\"" + values.key_upload_requires_call.Label + "\"," +
	    form.key_upload_requires_call,
        "input,\"" + values.n_contact_tracers.Label + "\"," + form.n_contact_tracers,
        "input,\"" + values.p_maximal_restriction_given_ph_call.Label + "\"," + 
	    form.p_maximal_restriction_given_ph_call,

        "output,\"" + results.c_r.Label + "\"," + model.r,
	"output,\"" + results.c_cases_prevented.Label + " " + results.due_to_en.Label + "\"," + 
            model.cases_prevented,
	"output,\"" + results.c_false_quar.Label + " " + results.due_to_en.Label + "\"," + 
	    model.false_quar_due_to_en,

	"output,Day," + Array.from(Array(model["infected"].length).keys()).join(),

	//"output,\"" + results.c_new_infections.Label + "\"," + model.infected,
	"output,\"New Infections\"," + model.infected,
	"output,\"" + results.c_false_quar.Label + "\"," + model.quar_and_not_infected,
	"output,\"" + results.c_cases_isolated.Label + "\"," + model.pos_and_quar,

	"output,\"New Infections " + results.pie_got_en.Label + "\"," + 
	    model.infected_and_aen,
	"output,\"New Infections " + results.pie_got_call.Label + "\"," +
	    model.infected_and_mct,
	"output,\"New Infections " + results.pie_test_only.Label + "\"," +
	    model.infected_and_pos,
	"output,\"New Infections " + results.pie_got_both.Label + "\"," +
	    model.infected_and_both,
	"output,\"New Infections " + results.pie_not_detected.Label + "\"," +
	    model.infected_and_none,

	"output,\"Public Health Calls " + results.due_to_en.Label + "\"," +
	    model.aen_followup_calls,
	"output,\"Public Health Calls " + results.due_to_ct.Label + "\"," +
	    model.mct_calls,
	"output,\"Public Health Calls (Other)\"," + model.other_calls,

	"output,\"Quarantines " + results.due_to_en.Label + "\"," + model.quar_aen,
	"output,\"Quarantines " + results.due_to_ct.Label + "\"," + model.quar_mct,
	"output,\"Quarantines " + results.due_to_both.Label + "\"," + model.quar_both,
	"output,\"Quarantines " + results.due_to_symptoms.Label + "\"," + model.quar_none,

	"output,\"Tests " + results.due_to_en.Label + "\"," + model.aen_triggered_tests,
	"output,\"Tests " + results.due_to_ct.Label + "\"," + model.mct_triggered_tests,
	"output,\"Tests " + results.due_to_symptoms.Label + "\"," + model.symptomatic_tests,

	"output,\"" + results.people_tested_pos.Label + " & Received EN Only\"," + 
	    model.pos_aen,
	"output,\"" + results.people_tested_pos.Label + " & Received CT Call Only\"," + 
	    model.pos_mct,
	"output,\"" + results.people_tested_pos.Label + " & Received Both\"," + 
	    model.pos_both,
	"output,\"" + results.people_tested_pos.Label + " & Received Neither\"," + 
	    model.pos_none,

	"output,\"" + results.symptomatic_pos.Label + ", Received EN Only\"," + 
	    model.pos_aen_sym,
	"output,\"" + results.symptomatic_pos.Label + ", Received CT Call Only\"," + 
	    model.pos_mct_sym,
	"output,\"" + results.symptomatic_pos.Label + ", Received Both\"," + 
	    model.pos_both_sym,
	"output,\"" + results.symptomatic_pos.Label + ", Received Neither\"," + 
	    model.pos_none_sym,

	"output,\"" + results.asymptomatic_pos.Label + ", Received EN Only\"," + 
	    model.pos_aen_asym,
	"output,\"" + results.asymptomatic_pos.Label + ", Received CT Call Only\"," + 
	    model.pos_mct_asym,
	"output,\"" + results.asymptomatic_pos.Label + ", Received Both\"," + 
	    model.pos_both_asym,
	"output,\"" + results.asymptomatic_pos.Label + ", Received Neither\"," + 
	    model.pos_none_asym,

	"output,\"" + results.people_tested_neg.Label + " & Received EN Only\"," + 
	    model.neg_aen,
	"output,\"" + results.people_tested_neg.Label + " & Received CT Call Only\"," + 
	    model.neg_mct,
	"output,\"" + results.people_tested_neg.Label + " & Received Both\"," + 
	    model.neg_both,
	"output,\"" + results.people_tested_neg.Label + " & Received Neither\"," + 
	    model.neg_none,
    ];


    Object.entries(fixedParamFieldMap)
          .map(([key, field]) => (
	      csv.push("fixed input," + field.Label + "," + 
	               fixedParams?.[key as keyof FixedParams]?.toString())
		       ));


/*
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
                                    {fixedParams?.[key as keyof FixedParams]?.toString()}
                                </Grid>
                            </Fragment>
*/

    return csv;
  } else {
    return ["something went wrong",
            "please refresh and try again"];
  }
}




