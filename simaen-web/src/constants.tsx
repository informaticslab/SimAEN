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

import { FixedParams, FormType } from "./models";
import { LitReference, references } from "./references";

export const desiredLabels = [
  "postest",
  "hasapp",
  "keyup",
  "notified",
  "aentest",
  "aenpostest",
  "aennegtest",
  "posaennomct",
  "posaenandmct",
  "posaennomctasy",
  "posaennomctsy",
  "posaenandmctasy",
  "posaenandmctsy",
  "vaxfa",
  "infinquarantine",
  "ninfinquarantine",
];
// export const desiredLabels = [
//   { name: "postest" },
//   { name: "hasapp" },
//   { name: "keyup" },
//   { name: "notified" },
//   { name: "aentest" },
//   { name: "aenpostest" },
//   { name: "aennegtest" },
//   { name: "posaennomct" },
//   { name: "posaenandmct" },
//   { name: "posaennomctasy" },
//   { name: "posaennomctsy" },
//   { name: "posaenandmctasy" },
//   { name: "posaenandmctsy" },
//   { name: "vaxfa" },
//   { name: "infinquarantine" },
//   { name: "ninfinquarantine" },
// ];
export const layout = {
  height: 1000,
  width: 800,
  margin: { left: 20, right: 200, bottom: 100, top: 20 },
};
export const NUMBER_OF_DAYS = 82;
export const MAX_Y = 405;

export const SCALE = 100;

export const button_labels = {
  add_to_comparison: "Add to Comparison",
  clear_comparison: "Clear Comparison"
}

export interface StringMap {
    [key: string]: any
}

// stuck this up here because of typechecking
// keep the keys lowercase, they get looked up from form values
const interactionTitles: StringMap = {
    low: "Shelter in Place",
    medium: "Social Distancing",
    high: "Pre-COVID",
};

export const values = {
  starting_cases: {
    Label: "Number of starting cases",
    Low: 200,
    Medium: 500,
    High: 800,
    Popover: "Total number of active positive cases at the start of the simulation",
    Id: "starting_cases",
  },
  p_test_given_call: {
    Label: "Probability of testing after PH call",
    Low: 25,
    Medium: 50,
    High: 75,
    Popover:
      "Probability that a person who has been called by public health will get tested on any given day",
    Id: "p_test_given_call",
  },
  p_test_given_notification: {
    Label: "Probability of testing after EN",
    Low: 30,
    Medium: 50,
    High: 75,
    Popover:
      "Probability that a person who has received an Exposure Notification will get tested on any given day",
    Id: "p_test_given_notification",
  },
  test_delay: {
    Label: "Test processing time",
    Low: 0,
    Medium: 2,
    High: 4,
    Popover:
      "Duration betwen the time a test is taken to the time results are received",
//      "The mean and standard deviation of number of days that it takes for a test to get back (normal distribution)",
    Id: "test_delay",
  },
  p_running_app: {
    Label: "EN adoption rate",
    None: 0,
    Low: 25,
    Medium: 50,
    High: 75,
    Popover: "Percentage of people that installed and are running the EN service",
    Id: "p_running_app",
  },
  risk_settings: {
    Label: "Risk settings",
    Narrow: "narrow",
    Medium: "medium",
    Wide: "wide",
    Popover:
      "Level of EN sensitivity / specificity that is configured for the population",
    Id: "risk_settings",
  },
/* Moved to API
  p_app_detects_generator: {
    Low: 36,
    Medium: 67,
    High: 86,
    Popover:
      "Probability that a close contact running the app will successfully handshake with their generator (given the generator is also running the app)",
    Id: "p_app_detects_generator",
  },
  false_discovery_rate: {
    Low: 0.122,
    Medium: 0.23,
    High: 0.3,
    Popover:
      "False Discovery Rate (FDR), used to create additional false positives picked up automatically by the system. 0.5 will equal new cases.",
    Id: "false_discovery_rate",
  },
*/
  p_upload_key_given_positive_test: {
    Label: "Percent sharing diagnosis",
    Low: 50,
    Medium: 75,
    High: 100,
    Popover:
      "Probability that a person who is running the EN service, and gets a positive test, will share their diagnosis using EN",
    Id: "p_upload_key_given_positive_test",
  },
  n_contact_tracers: {
    Label: "Number of contact tracers",
    Low: 10,
    Medium: 100,
    Popover: "Number of contact tracers deployed to perform CT activities in the region",
    Id: "n_contact_tracers",
  },
  interaction_level: {
    Label: "Personal interaction level",
    Low: "low",
    Medium: "medium",
    High: "high",
    titles: interactionTitles,
    Popover: "Extent to which a person interacts closely with others",
    Id: "interaction_level",
  },
  p_maximal_restriction_given_ph_call: {
    Label: "Quarantine compliance after CT call",
    Low: 50,
    High: 90,
    Popover:
      "Percentage of people adhering to the guidelines to enter quarantine after receiving a CT call",
    Id: "p_maximal_restriction_given_ph_call",
  },
  p_maximal_restriction_given_aen_notification: {
    Label: "Quarantine compliance after EN",
    Low: 50,
    High: 90,
    Popover:
      "Percentage of people adhering to the guidelines to enter quarantine after receiving an Exposure Notification",
    Id: "p_maximal_restriction_given_aen_notification",
  },
  p_vaccinated: {
    Label: "Population vaccination level",
    Low: 0,
    Medium: 20,
    High: 50,
    Popover: "Percentage of people who received full or partial vaccination",
    Id: "p_vaccinated",
  },
  p_mask_given_norm: {
    Label: "Population mask-wearing level",
    Low: 25,
    Medium: 50,
    High: 75,
    Popover: "Percentage of people who wear masks in indoor or outdoor settings",
    Id: "p_mask_given_norm",
  },
  key_upload_requires_call: {
    Label: "Sharing diagnosis requires interacting with PH",
    Popover: "If checked, sharing diagnosis through EN requires obtaining a one-time code from Public Health; some regions instead issue codes automatically via SMS",
    Id: "key_upload_requires_call",
  },
};

export const results = {
  due_to_en: {
    Label: "Due to EN",
    Id: "due_to_en",
  },
  due_to_ct: {
    Label: "Due to CT",
    Id: "due_to_ct",
  },
  due_to_both: {
    Label: "Due to EN + CT",
    Id: "due_to_both",
  },
  due_to_symptoms: {
    Label: "Due to Symptoms",
    Id: "due_to_symptoms",
  },
  c_new_infections: {
    Label: "Cumulative New Infections",
    Popover: "New infections arising during simulation period",
    Id: "c_new_infections",
  },
  c_r: {
    Label: "Effective Reproduction Number (R)",
    Popover: "Average number of secondary cases per infectious case in a population made up of both susceptible and non-susceptible hosts",
    Id: "c_r",
  },
  c_cases_isolated: {
    Label: "Positive Cases ID'd and Isolated",
    Popover: "Number of positive cases that were detected and adhered with the isolation requirement",
    Id: "c_cases_isolated",
  },
  c_cases_prevented: {
    Label: "Cases Prevented",
    Popover: "",
    Id: "c_cases_prevented",
  },
  c_false_quar: {
    Label: "Unnecessary Quarantines",
    Popover: "Individuals who are not infected but entered quarantine as a result of EN or CT",
    Id: "c_false_quar",
  },

  // custom popovers for combo labels
  c_cases_isolated_en: {
    Popover: "Number of positive cases that were detected due to EN alone, and adhered with the isolation requirement",
  },
  c_cases_prevented_en: {
    Popover: "Number of estimated new infection cases that were averted due to the improved earlier detection by EN and the reduction of consequent infections",
  },
  c_false_quar_en: {
    Popover: "Individuals who are not infected but entered quarantine as a result of EN alone",
  },

  n_cases_by_detection: {
    Label: "Cumulative New Infections by Detection Method",
    Popover: "Cumulative number of new infections, broken out by detection method",
    Id: "c_false_quar",
  },
  n_ph_calls_by_reason: {
    Label: "Number of Public Health Calls by Reason",
    Popover: "Cumulative number of new PH calls, broken out by reason",
    Id: "c_false_quar",
  },
  n_quar_by_detection: {
    Label: "Number of Quarantines by Detection Method",
    Popover: "Cumulative number of people adhering to quarantine guidelines, broken out by detection method",
    Id: "c_false_quar",
  },
  n_tests_by_reason: {
    Label: "Number of Tests by Reason",
    Popover: "Cumulative number of new tests, broken out by reason",
    Id: "c_false_quar",
  },

  people_tested_pos: {
    Label: "People Who Tested Positive",
    Popover: "Cumulative number of people who tested positive, including possibly multiple positive tests per person",
    Id: "people_tested_pos"
  },
  symptomatic_pos: {
    Label: "Symptomatic Positives",
    Popover: "Cumulative number of people who tested positive and were symptomatic",
    Id: "symptomatic_pos"
  },
  asymptomatic_pos: {
    Label: "Asymptomatic Positives",
    Popover: "Cumulative number of people who tested positive and were asymptomatic",
    Id: "asymptomatic_pos"
  },
  people_tested_neg: {
    Label: "People Who Tested Negative",
    Popover: "Cumulative number of people who tested negative, including possibly multiple negative tests per person",
    Id: "people_tested_neg"
  },

  // Pie chart legend
  pie_got_en: {
    Label: "Received an EN",
    Sublabel: "EN Only",
    Popover: "EN received was the only reason for the test",
    Id: "pie_got_en"
  },
  pie_got_call: {
    Label: "Called by CT",
    Sublabel: "CT Only",
    Popover: "CT call was the only reason for the test",
    Id: "pie_got_call"
  },
  pie_got_both: {
    Label: "EN + CT",
    Sublabel: "EN + CT",
    Popover: "Test was triggered by both EN and CT call",
    Id: "pie_got_both"
  },
  pie_test_only: {
    Label: "Positive Test Only",
    Sublabel: "Positive Test",
    Popover: "Test was triggered by another reason, such as symptoms or suveillance testing",
    Id: "pie_test_only"
  },
  pie_not_detected: {
    Label: "Not detected",
    Sublabel: "Not detected",
    Popover: "Infections which were not detected, i.e., no test conducted",
    Id: "pie_not_detected"
  },

};

export type FixedParamField = {
  Section: string,
  Label: string,
  Popover: string,
  Units: string,
  Reference?: LitReference
};
type FixedParamFieldMap = {
  [key in keyof FixedParams]: FixedParamField;
};

export const fixedParamFieldMap:FixedParamFieldMap = {

  end_day: {
   Section: 'Stopping Conditions',
   Label: 'End day',
   Popover: 'Number of days that the simulation lasts',
   Units: ''
  },

  max_num_current_cases: {
    Section: 'Stopping Conditions',
    Label: 'Max current cases',
    Popover: 'Maximum number of current cases before program stops',
    Units: ''
  },

  mean_latent_period: {
    Section: 'Disease Properties',
    Label: 'Mean latent period',
    Popover: 'The mean time between an individual being exposed and becoming infectious',
    Units: 'day',
    Reference: references.pierlinck
  },

  sd_latent_period: {
    Section: 'Disease Properties',
    Label: 'Latent period standard deviation',
    Popover: 'The standard deviation of latent period',
    Units: 'day',
    Reference: references.pierlinck
  },

  mean_incubation_period: {
    Section: 'Disease Properties',
    Label: 'Mean incubation period',
    Popover: 'The mean time between an individual being exposed and becoming clinical',
    Units: 'day',
    Reference: references.backer
  },

  sd_incubation_period: {
    Section: 'Disease Properties',
    Label: 'Incubation period standard deviation',
    Popover: 'The standard deviation of incubation period',
    Units: 'day',
    Reference: references.backer
  },

  recovery_length: {
    Section: 'Disease Properties',
    Label: 'Recovery length',
    Popover: 'Number of days it takes to be sure of recovery from infection',
    Units: 'day',
    Reference: references.pierlinck
  },

  p_asymptomatic_rate: {
    Section: 'Disease Properties',
    Label: 'Asymptomatic rate',
    Popover: 'The likelihood an infected person will be asymptomatic',
    Units: '%',
    Reference: references.poletti
  },

  p_transmission_asymptomatic_given_no_masks: {
    Section: 'Disease Properties',
    Label: 'Asymptomatic transmission rate (no mask)',
    Popover: 'The probability that a true contact event involving an asymptomatic infected person will result in infection',
    Units: '%',
    Reference: references.laxminarayan
  },

  p_transmission_presymptomatic_given_no_masks: {
    Section: 'Disease Properties',
    Label: 'Pre-symptomatic transmission rate (no mask)',
    Popover: 'The probability that a true contact event involving a pre-symptomatic infected person will result in infection',
    Units: '%',
    Reference: references.laxminarayan
  },

  p_transmission_symptomatic_given_no_masks: {
    Section: 'Disease Properties',
    Label: 'Symptomatic transmission rate (no mask)',
    Popover: 'The probability that a true contact event involving a symptomatic infected person will result in infection',
    Units: '%',
    Reference: references.laxminarayan
  },
  
  p_test_given_call: {
    Section: 'Testing Parameters',
    Label: 'Testing rate with call',
    Popover: 'The probability that a person who has been called by public health will get tested on any given day',
    Units: '%'
  },

  p_test_baseline: {
    Section: 'Testing Parameters',
    Label: 'Baseline testing rate',
    Popover: 'The probability that a person who has no symptoms and has not been notified in any way will get a test',
    Units: '%'
  },

  p_test_given_notification: {
    Section: 'Testing Parameters',
    Label: 'Testing rate with EN',
    Popover: 'The probability that a person who has received a notification through the app will get tested on any given day',
    Units: '%'
  },

  p_test_given_symptomatic: {
    Section: 'Testing Parameters',
    Label: 'Testing rate with symptoms',
    Popover: 'The probability that a person who is symptomatic will get tested on any given day',
    Units: '%'
  },

  test_delay_sigma: {
    Section: 'Testing Parameters',
    Label: 'Testing delay standard deviation',
    Popover: 'The standard deviation of number of days that it takes for a test to get back (normal distribution)',
    Units: 'day',
    Reference: references.lazer
  },

  daily_test_capacity: {
    Section: 'Testing Parameters',
    Label: 'Daily Test Capacity',
    Popover: 'The maximum number of tests that can be given in a day',
    Units: 'tests'
  },

  p_positive_test_given_exposed : {
    Section: 'Probability Of Positive Test',
    Label: 'Positivity rate with exposure ',
    Popover: 'The probability that a person who has been exposed will test positive',
    Units: '%'
  },

  p_positive_test_given_presymptomatic: {
    Section: 'Probability Of Positive Test',
    Label: 'Pre-symptomatic positivity rate',
    Popover: 'The probability that someone who is pre-symptomatic will test positive',
    Units: '%'
  },

  p_positive_test_given_symptomatic: {
    Section: 'Probability Of Positive Test',
    Label: 'Symptomatic positivity rate',
    Popover: 'The probability that someone who is symptomatic will test positive',
    Units: '%',
    Reference: references.watson
  },

  p_positive_test_given_asymptomatic: {
    Section: 'Probability Of Positive Test',
    Label: 'Asymptomatic positivity rate',
    Popover: 'The probability that someone who is asymptomatic will test positive',
    Units: '%'
  },

  p_upload_key_given_positive_test: {
    Section: 'Probability Of Positive Test',
    Label: 'Key upload rate with positivity',
    Popover: 'The probability that a person who is running the app who gets a positive test will upload their key to public health',
    Units: '%'
  },

  p_successful_call_unanticipated: {
    Section: 'Contact Tracing Parameters',
    Label: 'Successful call (unanticipated)',
    Popover: 'The probability that a call from public health will reach a person identified through contact tracing',
    Units: '%'
  },

  p_successful_call_anticipated: {
    Section: 'Contact Tracing Parameters',
    Label: 'Successful call (anticipated)',
    Popover: 'The probability that a call from public health will reach a person expecting the call',
    Units: '%'
  },

  p_identify_individual_using_manual_contact_tracing: {
    Section: 'Contact Tracing Parameters',
    Label: 'Contact tracing identification rate',
    Popover: 'The probability that an individual will be found using manual contact tracing',
    Units: '%'
  },

  max_contacts_recalled: {
    Section: 'Contact Tracing Parameters',
    Label: 'Max contacts recalled',
    Popover: 'The maximum number of people an agent can recall through manual contact tracing on a single phone call',
    Units: ''
  },

  work_day_length: {
    Section: 'Contact Tracing Parameters',
    Label: 'Work day length',
    Popover: 'The number of hours each contact tracer can spend on calling',
    Units: 'hour'
  },

  max_call_attempts: {
    Section: 'Contact Tracing Parameters',
    Label: 'Max call attempts',
    Popover: 'The number of time PH will try to contact an individual before giving up',
    Units: ''
  },

  missed_call_time: {
    Section: 'Contact Tracing Parameters',
    Label: 'Missed call time',
    Popover: 'The length of time that a missed call takes',
    Units: 'hour'
  },

  index_trace_call_time: {
    Section: 'Contact Tracing Parameters',
    Label: 'Index case call time',
    Popover: 'The length of time that a contact tracer takes to perform contact tracing on an index case by phone call',
    Units: 'hour'
  },

  alert_call_time: {
    Section: 'Contact Tracing Parameters',
    Label: 'Close contact alert call time',
    Popover: 'The length of time that a contact tracer takes to notify a close contact by phone call',
    Units: 'hour'
  },

  key_upload_call_time: {
    Section: 'Contact Tracing Parameters',
    Label: 'EN key upload call time',
    Popover: 'The length of time it takes for a call to obtain code for key upload',
    Units: 'hour'
  },

  p_start_max: {
    Section: 'Starting Behavior',
    Label: 'Start maximal rate',
    Popover: 'Probability that an individual from the initial batch of infected individuals will start in the maximal Restriction state',
    Units: '%'
  },

  p_mask_given_max: {
    Section: 'Mask Parameters',
    Label: 'Maximal restriction Mask rate',
    Popover: 'The probability that a person will wear a mask while they are in the maximal restriction state',
    Units: '%'
  },

  mask_effect: {
    Section: 'Mask Parameters',
    Label: 'Mask effectiveness',
    Popover: 'Extent to which transmission rates are proportionally reduced for each person wearing a mask (higher numbers mean lower transmission risk)',
    Units: '%'
  },

  p_contact_public_health_after_positive_test: {
    Section: 'Personal Parameters',
    Label: 'Public Health call rate after positive',
    Popover: 'The probability that a person will call public health after a positive test',
    Units: '%'
  },

  p_contact_public_health_after_aen_notification: {
    Section: 'Personal Parameters',
    Label: 'Public Health call rate after EN',
    Popover: 'The probability that a person will call public health after receiving an EN notification',
    Units: '%'
  },

  mean_new_cases_maximal: {
    Section: 'Personal Parameters',
    Label: 'New cases mean maximal',
    Popover: 'The average number of contacts that an individual encounters each day after entering self-isolation',
    Units: '',
    Reference: references.fu
  },

  sigma_new_cases_maximal: {
    Section: 'Personal Parameters',
    Label: 'New cases standard deviation maximal',
    Popover: 'The standard deviation of contacts that an individual encounters each day after entering self-isolation',
    Units: '',
    Reference: references.fu
  },

  p_starting_behavior_after_negative_test_no_symptoms: {
    Section: 'Personal Parameters',
    Label: 'Starting behavior return rate',
    Popover: 'Probability of returning to starting behavior given negative test result and no symptoms',
    Units: '%'
  },

  p_maximal_restriction_given_symptomatic: {
    Section: 'Personal Behavior',
    Label: 'Maximal restriction rate given symptomatic',
    Popover: 'Probabilities associated with entering maximal level of restricted movement given the person is symptomatic',
    Units: '%'
  },
  
  p_maximal_restriction_given_positive_test: {
    Section: 'Personal Behavior',
    Label: 'Maximal restriction rate given positive test',
    Popover: 'Probabilities associated with entering maximal level of restricted movement given the person receives a positive test',
    Units: '%'
  },
  
  p_maximal_restriction_given_ph_call: {
    Section: 'Personal Behavior',
    Label: 'Maximal restriction rate given PH call',
    Popover: 'Probabilities associated with entering maximal level of restricted movement given the person is successfully called by PH',
    Units: '%'
  },
  
  p_maximal_restriction_given_aen_notification: {
    Section: 'Personal Behavior',
    Label: 'Maximal restriction rate given EN',
    Popover: 'Probabilities associated with entering maximal level of restricted movement given the person is notified by EN',
    Units: '%'
  },

  vaccinated_people_can_spread_asymptomatically: {
    Section: 'Vaccination Parameters',
    Label: 'Vaccinated can spread asymptomatically',
    Popover: 'Whether vaccinated individuals who are carriers of the disease are asymptomatic but still able to spread the disease',
    Units: ''
  }
}

export const defaultForm: FormType = {
  starting_cases: values.starting_cases.Low,
  test_delay: values.test_delay.Low,
  p_running_app: values.p_running_app.Low,
  risk_settings: values.risk_settings.Narrow,
  key_upload_requires_call: false,
  n_contact_tracers: values.n_contact_tracers.Low,
  interaction_level: values.interaction_level.Medium,
  p_maximal_restriction_given_ph_call: values.p_maximal_restriction_given_ph_call.Low,
  p_maximal_restriction_given_aen_notification: values.p_maximal_restriction_given_aen_notification.Low,
  p_vaccinated: values.p_vaccinated.Low,
  p_mask_given_norm: values.p_mask_given_norm.Low
}
