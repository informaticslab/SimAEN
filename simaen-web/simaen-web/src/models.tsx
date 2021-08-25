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

export type FormType = {
  starting_cases: number;
  n_contact_tracers: number;
  test_delay: number;
  key_upload_requires_call: boolean;
  p_running_app: number;
  interaction_level: string;
  p_vaccinated: number;
  p_mask_given_norm: number;
  p_maximal_restriction_given_ph_call: number;
  p_maximal_restriction_given_aen_notification: number;
  risk_settings: string;
};

export type CumulativeResult = {
  readonly infected: number;
  readonly r: number;
  readonly pos_and_quar: number;
  readonly cases_prevented: number;
  readonly isolated_due_to_en: number;
  readonly false_quar_due_to_en: number;
  readonly quar_and_not_infected: number;
  readonly infected_and_aen: number;
  readonly infected_and_mct: number;
  readonly infected_and_both: number;
  readonly infected_and_pos: number;
  readonly infected_and_none: number;
  readonly aen_followup_calls: number;
  readonly mct_calls: number;
  readonly other_calls: number;
  readonly aen_triggered_tests: number;
  readonly mct_triggered_tests: number;
  readonly symptomatic_tests: number;
  readonly pos_aen: number;
  readonly pos_mct: number;
  readonly pos_both: number;
  readonly pos_none: number;
  readonly pos_aen_sym: number;
  readonly pos_mct_sym:  number;
  readonly pos_both_sym: number;
  readonly pos_none_sym: number;
  readonly pos_aen_asym: number;
  readonly pos_mct_asym: number;
  readonly pos_both_asym: number;
  readonly pos_none_asym: number;
  readonly neg_aen: number;
  readonly neg_mct: number;
  readonly neg_both:  number;
  readonly neg_none: number;
  readonly quar_aen: number;
  readonly quar_mct: number;
  readonly quar_both: number;
  readonly quar_none: number;
}

export type SimulationResult = {
  readonly id: number;
  readonly infected: number[];
  readonly r: number;
  readonly pos_and_quar: number[];
  readonly cases_prevented: number;
  readonly isolated_due_to_en: number;
  readonly false_quar_due_to_en: number;
  readonly quar_and_not_infected: number[];
  readonly infected_and_aen: number[];
  readonly infected_and_mct: number[];
  readonly infected_and_both: number[];
  readonly infected_and_pos: number[];
  readonly infected_and_none: number[];
  readonly aen_followup_calls: number[];
  readonly mct_calls: number[];
  readonly other_calls: number[];
  readonly aen_triggered_tests: number[];
  readonly mct_triggered_tests: number[];
  readonly symptomatic_tests: number[];
  readonly pos_aen: number[];
  readonly pos_mct: number[];
  readonly pos_both: number[];
  readonly pos_none: number[];
  readonly pos_aen_sym: number[];
  readonly pos_mct_sym: number[];
  readonly pos_both_sym: number[];
  readonly pos_none_sym: number[];
  readonly pos_aen_asym: number[];
  readonly pos_mct_asym: number[];
  readonly pos_both_asym: number[];
  readonly pos_none_asym: number[];
  readonly neg_aen: number[];
  readonly neg_mct: number[];
  readonly neg_both: number[];
  readonly neg_none: number[];
  readonly quar_aen: number[];
  readonly quar_mct: number[];
  readonly quar_both: number[];
  readonly quar_none: number[];
}

export type FixedParams = {
  readonly end_day: number;
  readonly max_num_current_cases: number;
  readonly mean_latent_period: number;
  readonly sd_latent_period: number;
  readonly recovery_length: number;
  readonly p_asymptomatic_rate: number;
  readonly p_transmission_asymptomatic_given_no_masks: number;
  readonly p_transmission_presymptomatic_given_no_masks: number;
  readonly p_transmission_symptomatic_given_no_masks: number;
  readonly p_test_given_call: number;
  readonly p_test_baseline: number;
  readonly p_test_given_notification: number;
  readonly p_test_given_symptomatic: number;
  readonly test_delay_sigma: number;
  readonly daily_test_capacity: number;
  readonly p_positive_test_given_exposed: number;
  readonly p_positive_test_given_presymptomatic: number;
  readonly p_positive_test_given_symptomatic: number;
  readonly p_positive_test_given_asymptomatic: number;
  readonly p_upload_key_given_positive_test: number;
  readonly p_successful_call_unanticipated: number;
  readonly p_successful_call_anticipated: number;
  readonly p_identify_individual_using_manual_contact_tracing:  number;
  readonly max_contacts_recalled: number;
  readonly work_day_length: number;
  readonly max_call_attempts: number;
  readonly missed_call_time: number;
  readonly index_trace_call_time: number;
  readonly alert_call_time: number;
  readonly key_upload_call_time: number;
  readonly p_start_max: number;
  readonly p_mask_given_max: number;
  readonly mask_effect: number;
  readonly p_contact_public_health_after_positive_test: number;
  readonly p_contact_public_health_after_aen_notification: number;
  readonly mean_new_cases_maximal: number;
  readonly sigma_new_cases_maximal: number;
  readonly p_starting_behavior_after_negative_test_no_symptoms: number;
  readonly p_maximal_restriction_given_symptomatic: number;
  readonly p_maximal_restriction_given_positive_test: number;
  readonly p_maximal_restriction_given_aen_notification: number;
  readonly vaccinated_people_can_spread_asymptomatically: boolean;
  readonly mean_incubation_period: number;
  readonly sd_incubation_period: number;
  readonly p_maximal_restriction_given_ph_call: number;
}

export type Data = {
  id: string;
  color: string;
  data: { x: number; y: number }[];
};


export const sum = <T extends unknown>(values: number[]| undefined, fallback: T) => {
  if (values && values.length) {
    return values.reduce((accum, val) => accum + val, 0);
  }
  return fallback;
}

export const accumulate = function(result: SimulationResult) : CumulativeResult {
  return Object.fromEntries(
    Object.entries(result)
      .map(([key, val]) => ([
        key,
        sum(val as unknown as number[], 0)
      ])
    )
  ) as CumulativeResult;
}

type FormTypeKey = keyof FormType;

export const diffForms = (forms:FormType[]) => {
  const keys = forms.flatMap((form) => Object.keys(form)) as Array<keyof FormType>;
  const uniqueKeys = new Set(keys).keys();
  const entries = Array.from(uniqueKeys, (key) => 
    [key, !forms.every( (val, i, arr) => val[key] === arr[0][key])]);
  return Object.fromEntries(entries) as {[key in FormTypeKey]: boolean};
}

export const sumTotalTests = (result?: CumulativeResult) => 
  (result?.aen_triggered_tests ?? 0) + 
  (result?.mct_triggered_tests ?? 0) + 
  (result?.symptomatic_tests ?? 0);

export const sumTotalCalls = (result?: CumulativeResult) =>
  (result?.aen_followup_calls ?? 0) + 
  (result?.mct_calls ?? 0) + 
  (result?.other_calls ?? 0);

export const sumTotalQuarantines = (result?: CumulativeResult) =>
  (result?.quar_aen ?? 0) + 
  (result?.quar_mct ?? 0) + 
  (result?.quar_both ?? 0) + 
  (result?.quar_none ?? 0);

export const sumTotalNegative = (result?: CumulativeResult) =>
  (result?.neg_aen ?? 0) + 
  (result?.neg_mct ?? 0) + 
  (result?.neg_both ?? 0) + 
  (result?.neg_none ?? 0);

export const sumTotalPositive = (result?: CumulativeResult) =>
  (result?.pos_aen ?? 0) + 
  (result?.pos_mct ?? 0) + 
  (result?.pos_both ?? 0) + 
  (result?.pos_none ?? 0);

export const sumTotalPositiveSymptomatic = (result?: CumulativeResult) =>
  (result?.pos_aen_sym ?? 0) + 
  (result?.pos_mct_sym ?? 0) + 
  (result?.pos_both_sym ?? 0) + 
  (result?.pos_none_sym ?? 0);

export const sumTotalPositiveAsymptomatic = (result?: CumulativeResult) =>
  (result?.pos_aen_asym ?? 0) +
  (result?.pos_mct_asym ?? 0) +
  (result?.pos_both_asym ?? 0) +
  (result?.pos_none_asym ?? 0);

export type Infected = {
    infected_and_aen: number,
    infected_and_mct: number,
    infected_and_pos: number,
    infected_and_both: number,
    infected_and_none: number
}

export function percentsInfected(result?: CumulativeResult): Infected {
    return {
      infected_and_aen: (result?.infected_and_aen || 0) / (result?.infected || 1) * 100,
      infected_and_mct: (result?.infected_and_mct || 0) / (result?.infected || 1) * 100,
      infected_and_pos: (result?.infected_and_pos || 0) / (result?.infected || 1) * 100,
      infected_and_both: (result?.infected_and_both || 0) / (result?.infected || 1) * 100,
      infected_and_none: (result?.infected_and_none || 0) / (result?.infected || 1) * 100
    };
}
