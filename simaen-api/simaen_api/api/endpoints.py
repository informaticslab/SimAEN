# -*- coding: utf-8 -*-
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

from flask_restx import Resource, Namespace, reqparse, fields, inputs

from simaen_api.api import (
    data_interface
)

import simaen_api

ns = Namespace('api', path='/api',
               description='SimAEN API')

# {'starting_cases': '200', 'test_delay': 0, 'p_running_app': 0.25, 'risk_settings': 'narrow', 'key_upload_requires_call': False, 'n_contact_tracers': '100', 'interaction_level': 'medium', 'mean_total_contacts': 2.1, 'p_maximal_restriction_given_ph_call': 0.5, 'p_maximal_restriction_given_aen_notification': 0.5, 'p_vaccinated': 0, 'p_mask_given_norm': 0.25}}

args_parser = reqparse.RequestParser()
args_parser.add_argument('starting_cases', type=int, required=True)
args_parser.add_argument('test_delay', type=int, required=True)
args_parser.add_argument('p_running_app', type=int, required=True)
args_parser.add_argument('risk_settings', type=str, required=True)
args_parser.add_argument('key_upload_requires_call', type=inputs.boolean, required=True)
args_parser.add_argument('n_contact_tracers', type=int, required=True)
args_parser.add_argument('interaction_level', type=str, required=True)
args_parser.add_argument('p_maximal_restriction_given_ph_call', type=int, required=True)
args_parser.add_argument('p_maximal_restriction_given_aen_notification', type=int, required=True)
args_parser.add_argument('p_vaccinated', type=int, required=True)
args_parser.add_argument('p_mask_given_norm', type=int, required=True)

other_parser = reqparse.RequestParser()
other_parser.add_argument('data', type=str, required=True)


simResult = ns.model('SimulationResult', {
    'id': fields.Integer(),
    'infected': fields.List(fields.Integer),
    'r': fields.Float(),
    'pos_and_quar': fields.List(fields.Integer),
    'cases_prevented': fields.Integer(),
    'isolated_due_to_en': fields.Integer(),
    'false_quar_due_to_en': fields.Integer(),
    'quar_and_not_infected': fields.List(fields.Integer),
    'infected_and_aen': fields.List(fields.Integer),
    'infected_and_mct': fields.List(fields.Integer),
    'infected_and_both': fields.List(fields.Integer),
    'infected_and_pos': fields.List(fields.Integer),
    'infected_and_none': fields.List(fields.Integer),
    'aen_followup_calls': fields.List(fields.Integer),
    'mct_calls': fields.List(fields.Integer),
    'other_calls': fields.List(fields.Integer),
    'aen_triggered_tests': fields.List(fields.Integer),
    'mct_triggered_tests': fields.List(fields.Integer),
    'symptomatic_tests': fields.List(fields.Integer),
    'pos_aen': fields.List(fields.Integer),
    'pos_mct': fields.List(fields.Integer),
    'pos_both': fields.List(fields.Integer),
    'pos_none': fields.List(fields.Integer),
    'pos_aen_sym': fields.List(fields.Integer),
    'pos_mct_sym': fields.List(fields.Integer),
    'pos_both_sym': fields.List(fields.Integer),
    'pos_none_sym': fields.List(fields.Integer),
    'pos_aen_asym': fields.List(fields.Integer),
    'pos_mct_asym': fields.List(fields.Integer),
    'pos_both_asym': fields.List(fields.Integer),
    'pos_none_asym': fields.List(fields.Integer),
    'neg_aen': fields.List(fields.Integer),
    'neg_mct': fields.List(fields.Integer),
    'neg_both': fields.List(fields.Integer),
    'neg_none': fields.List(fields.Integer),
    'quar_aen': fields.List(fields.Integer),
    'quar_mct': fields.List(fields.Integer),
    'quar_both': fields.List(fields.Integer),
    'quar_none': fields.List(fields.Integer),
})


@ns.route('/data', methods=['GET'])
class DataAPI(Resource):
    @ns.doc(description='Get model data',
            parser=args_parser)
    @ns.marshal_with(simResult)
    def get(self):

        print("DataAPI: Received [GET] request")

        args = args_parser.parse_args()
        print(args)

        # normalize percentages to [0...1]
        for key in args.keys():
            if key.startswith('p_'):
                args[key] = args[key] / 100

        if 'key_upload_requires_call' in args.keys():
            args['key_upload_requires_call'] = int(args['key_upload_requires_call'])

        if 'interaction_level' in args.keys():
            interaction_level = args['interaction_level']
            del args['interaction_level']

            if interaction_level == 'low':
                args['mean_new_cases'] = 2.1
                args['mean_total_contacts'] = 2.1
            elif interaction_level == 'medium':
                args['mean_new_cases'] = 2.5
                args['mean_total_contacts'] = 2.7
            else:
                args['mean_new_cases'] = 2.9
                args['mean_total_contacts'] = 3.2


        if 'risk_settings' in args.keys():
            risk_settings = args['risk_settings']
            del args['risk_settings']
            
            if risk_settings == 'narrow':
                args['p_app_detects_generator'] = .36
                args['false_discovery_rate'] = 0.122
            elif risk_settings == 'medium':
                args['p_app_detects_generator'] = .67
                args['false_discovery_rate'] = 0.23
            else:
                args['p_app_detects_generator'] = .86
                args['false_discovery_rate'] = 0.3

        # affix this to a single value
        args['p_upload_key_given_positive_test'] = .50

        # if no AEN, take the "sub-parameters" for AEN out of the query
        if 'p_running_app' in args.keys() and args['p_running_app'] == 0:
            for k in ['p_app_detects_generator', 'false_discovery_rate',
                      'key_upload_requires_call', 'p_maximal_restriction_given_aen_notification']:
                if k in args.keys():
                    del args[k]

        res = data_interface.fetch_precomputed_aggregate_data(args, printing=True)

        if len(res) == 0:
            # slow version
            res = data_interface.fetch_and_aggregate_data(args, printing=True)

        return res


id_parser = reqparse.RequestParser()
id_parser.add_argument('id', type=int, required=True)


simResult = ns.model('FixedParams', {
    'num_worlds':                                          fields.Float(),
    'end_day':                                             fields.Integer(),
    'max_num_current_cases':                               fields.Integer(),
    'mean_latent_period':                                  fields.Float(),
    'sd_latent_period':                                    fields.Float(),
    'recovery_length':                                     fields.Float(),
    'p_asymptomatic_rate':                                 fields.Integer(),
    'p_transmission_asymptomatic_given_no_masks':          fields.Integer(),
    'p_transmission_presymptomatic_given_no_masks':        fields.Integer(),
    'p_transmission_symptomatic_given_no_masks':           fields.Integer(),
    'p_test_given_call':                                   fields.Integer(),
    'p_test_baseline':                                     fields.Integer(),
    'p_test_given_notification':                           fields.Integer(),
    'p_test_given_symptomatic':                            fields.Integer(),
    'test_delay_sigma':                                    fields.Float(),
    'daily_test_capacity':                                 fields.Float(),
    'p_positive_test_given_exposed':                       fields.Integer(),
    'p_positive_test_given_presymptomatic':                fields.Integer(),
    'p_positive_test_given_symptomatic':                   fields.Integer(),
    'p_positive_test_given_asymptomatic':                  fields.Integer(),
    'p_upload_key_given_positive_test':                    fields.Integer(),
    'p_successful_call_unanticipated':                     fields.Integer(),
    'p_successful_call_anticipated':                       fields.Integer(),
    'p_identify_individual_using_manual_contact_tracing':  fields.Integer(),
    'max_contacts_recalled':                               fields.Float(),
    'work_day_length':                                     fields.Float(),
    'max_call_attempts':                                   fields.Float(),
    'missed_call_time':                                    fields.Float(),
    'index_trace_call_time':                               fields.Float(),
    'alert_call_time':                                     fields.Float(),
    'key_upload_call_time':                                fields.Float(),
    'p_start_min':                                         fields.Integer(),
    'p_start_mod':                                         fields.Integer(),
    'p_start_max':                                         fields.Integer(),
    'p_mask_given_min':                                    fields.Integer(),
    'p_mask_given_mod':                                    fields.Integer(),
    'p_mask_given_max':                                    fields.Integer(),
    'mask_effect':                                         fields.Float(),
    'p_contact_public_health_after_positive_test':         fields.Integer(),
    'p_contact_public_health_after_aen_notification':      fields.Integer(),
    'sigma_total_contacts':                                fields.Float(),
    'sigma_new_cases':                                     fields.Float(),
    'mean_new_cases_minimal':                              fields.Float(),
    'sigma_new_cases_minimal':                             fields.Float(),
    'mean_new_cases_moderate':                             fields.Float(),
    'sigma_new_cases_moderate':                            fields.Float(),
    'mean_new_cases_maximal':                              fields.Float(),
    'sigma_new_cases_maximal':                             fields.Float(),
    'p_starting_behavior_after_negative_test_no_symptoms': fields.Integer(),
    'p_maximal_restriction_given_symptomatic':             fields.Integer(),
    'p_moderate_restriction_given_symptomatic':            fields.Integer(),
    'p_minimal_restriction_given_symptomatic':             fields.Integer(),
    'p_maximal_restriction_given_positive_test':           fields.Integer(),
    'p_moderate_restriction_given_positive_test':          fields.Integer(),
    'p_minimal_restriction_given_positive_test':           fields.Integer(),
    'p_maximal_restriction_given_aen_notification':        fields.Integer(),
    'p_moderate_restriction_given_aen_notification':       fields.Integer(),
    'p_minimal_restriction_given_aen_notification':        fields.Integer(),
    'vaccinated_people_can_spread_asymptomatically':       fields.Float(),
    'mean_incubation_period':                              fields.Float(),
    'sd_incubation_period':                                fields.Float(),
    'p_maximal_restriction_given_ph_call':                 fields.Integer(),
    'p_moderate_restriction_given_ph_call':                fields.Integer(),
    'p_minimal_restriction_given_ph_call':                 fields.Integer(),
})


@ns.route('/fixed_params', methods=['GET'])
class DataAPI(Resource):
    @ns.doc(description='Get model params not part of form',
            parser=id_parser)
    @ns.marshal_with(simResult)
    def get(self):

        args = id_parser.parse_args()
        print(args)

        res = data_interface.fetch_fixed_params(args)

        # normalize percentages to [0...100]
        for key in res.keys():
            if key.startswith('p_') and res[key] is not None:
                res[key] = res[key] * 100

            # should have been named p_mask_works :)
            if key == 'mask_effect' and res[key] is not None:
                res[key] = res[key] * 100
        
        return res
