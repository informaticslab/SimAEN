# -*- coding: utf-8 -*-
# DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

# This material is based upon work supported under Air Force Contract No. FA8702-15-D-0001.
# Any opinions,findings, conclusions or recommendations expressed in this material are those
# of the author(s) and do not necessarily reflect the views of the Centers for Disease Control.

# (c) 2020 Massachusetts Institute of Technology.

# The software/firmware is provided to you on an As-Is basis

# Delivered to the U.S. Government with Unlimited Rights, as defined in DFARS Part 252.227-7013
# or 7014 (Feb 2014). Notwithstanding any copyright notice, U.S. Government rights in this work
# are defined by DFARS 252.227-7013 or DFARS 252.227-7014 as detailed above. Use of this work
# other than as specifically authorized by the U.S. Government may violate any copyrights that
# exist in this work.

# Copyright (c) 2020 Massachusetts Institute of Technology
# SPDX short identifier: MIT

# Developed as part of: SimAEN, 2020
# Authors: DI25756, JO26228, ED22162
"""
Created on Thu Jul 30 15:41:14 2020

@author: DI25756, JO26228, ED22162
"""
import sqlite3 as sl
from random import random, randint, normalvariate, gauss, sample
import numpy as np
import sys
from math import floor
import os               # to identify if JSON file exists
import sys              # to accept input arguments for, among other potential things, grid functionality
import json             # to read JSON file
import pprint           # to show configuration being used in terminal output
import math
import time  # to time simulation
from collections import deque

"""
if __name__ == "__main__":
    from readConfig import readConfig
    #from pytools import process_logs
    from pytools import process_reboot as process_logs
    from pytools.config import ind2config
    import pytools.config # to work with simulation configuration
    # import pytools.process_logs # to process event logs
else:
    from src.readConfig import readConfig
    #from src.pytools import process_logs
    from src.pytools import process_reboot as process_logs
    from src.pytools.config import ind2config
    import src.pytools.config # to work with simulation configuration
    # import src.pytools.process_logs # to process event logs
"""
# Make simulation configuration ("config") a global variable
# global config

# Add global variable tracking number of Individuals
global individual_id

class Test:
    def __init__(self, testee=None, reason=None):
        testee.myWorld.testCount += 1
        self.testId = testee.myWorld.testCount
        self.myWorld = testee.myWorld
        self.testee = testee
        testee.awaiting_test_results = True
        self.infectionStatusAtTest = testee.infectionStatus
        self.reason = reason
        self.added = day
        self.testReceived = -1
        self.minDelay = max(1, floor(self.myWorld.test_delay+gauss(0, self.myWorld.test_delay_sigma)))
        self.testee.test_number += 1
        self.testResult = 0

        
    def processTest(self):
        self.testReceived = day
        if self.testee:
            self.testee.awaiting_test_results = False
            self.testee.tested += 1
            self.testee.dayTested = day
            resultPositive = False
            if self.infectionStatusAtTest == 'Exposed':
                if random() < self.myWorld.p_positive_test_given_exposed:
                    resultPositive = True
            elif self.infectionStatusAtTest == 'Presymptomatic':
                if random() < self.myWorld.p_positive_test_given_presymptomatic:
                    resultPositive = True
            elif self.infectionStatusAtTest == 'Symptomatic':
                if random() < self.myWorld.p_positive_test_given_symptomatic:
                    resultPositive = True
            elif self.infectionStatusAtTest == 'Asymptomatic':
                if random() < self.myWorld.p_positive_test_given_asymptomatic:
                    resultPositive = True
            if resultPositive:
                self.testResult = 1
                if self.testee.testedPositive:
                    print('* Second Positive Test')
                self.testee.testedPositive = True
                self.testee.testResult = 'Positive'
                self.testee.checkForChangeInMovementRestrictions(self.myWorld.p_maximal_restriction_given_positive_test,
                                                                 self.myWorld.p_moderate_restriction_given_positive_test,
                                                                 self.myWorld.p_minimal_restriction_given_positive_test,
                                                                 basis='positiveTest')
                if random() < self.myWorld.p_contact_public_health_after_positive_test:
                    self.testee.addToCallList(reason='performMCT', callType='positive_test_call')

                if random() < self.myWorld.p_upload_key_given_positive_test and self.testee.hasApp:
                    if not self.myWorld.key_upload_requires_call:
                        self.testee.uploadKey()
                    else:
                        self.testee.addToCallList(reason='keyUpload')
            else:
                self.testee.testResult = 'Negative'
                self.testResult = -1
                if self.testee.behavior != 'Normal' and \
                   random() < self.myWorld.p_starting_behavior_after_negative_test_no_symptoms:
                    self.testee.behavior = self.testee.initialBehavior


class Call:
    def __init__(self, originator=None, target=None, reason=None, callType='standard_call'):
        target.myWorld.callCount += 1
        self.callId = target.myWorld.callCount
        self.myWorld = target.myWorld
        self.originator = originator
        self.target = target
        self.reason = reason
        self.added = day
        self.attempts = 0
        self.callType = callType
        self.successful = False
        self.statusAtCall = 'Uncontacted'
        if self.reason == 'identifiedThroughMCT':
            self.duration = self.myWorld.alert_call_time
        elif self.reason == 'keyUpload':
            self.duration = self.myWorld.key_upload_call_time
        elif self.reason == 'performMCT':
            self.duration = self.myWorld.index_trace_call_time
        elif self.reason == 'AENFollowUp':
            self.duration = self.myWorld.alert_call_time
            
    def makeCall(self):
        self.attempts += 1

        callSuccess = False
        if self.target:
            if self.reason == 'identifiedThroughMCT':
                if random() < self.myWorld.p_successful_call_unanticipated:
                    self.target.checkForChangeInMovementRestrictions(self.myWorld.p_maximal_restriction_given_PH_call,
                                                                     self.myWorld.p_moderate_restriction_given_PH_call,
                                                                     self.myWorld.p_minimal_restriction_given_PH_call,
                                                                     basis='identifiedThroughMCT')

                    callSuccess = True
            elif self.reason == 'keyUpload':
                if random() < self.myWorld.p_successful_call_anticipated:
                    if self.target.hasApp and random() < self.myWorld.p_upload_key_given_positive_test:
                        self.target.uploadKey()
                    callSuccess = True

            elif self.reason == 'performMCT':
                if random() < self.myWorld.p_successful_call_anticipated:
                    if self.target.hasApp and \
                       random() < self.myWorld.p_upload_key_given_positive_test and\
                       self.myWorld.key_upload_requires_call:
                        self.target.uploadKey()
                    if self.target.hasBeenContactTraced:
                        self.duration = self.myWorld.alert_call_time
                    else:
                        callSuccess = True
                        self.target.hasBeenContactTraced = True
                        for descendant in self.target.descendants:
                            if descendant.mctTraceableByGenerator and not descendant.falseDiscovery:
                                if random() < self.myWorld.p_test_given_call:
                                    descendant.addToTestList(reason='mct_call')

                                self.myWorld.call_list.append(Call(originator=self.target,
                                                                   target=descendant,
                                                                   reason='identifiedThroughMCT',
                                                                   callType='contact_case'))

                        if random() < self.myWorld.p_identify_individual_using_manual_contact_tracing:
                            if self.target.generator:
                                if random() < self.myWorld.p_test_given_call:
                                    self.target.generator.addToTestList(reason='mct_call')
                                self.myWorld.call_list.append(Call(originator=self.target,
                                                                   target=self.target.generator,
                                                                   reason='identifiedThroughMCT',
                                                                   callType='contact_case'))

            elif self.reason == 'AENFollowUp':
                callSuccess = True
            else:
                print('Unknown call reason: '+self.reason)
            self.successful = callSuccess
            if not callSuccess:
                pass
            else:
                self.statusAtCall = self.target.infectionStatus
                self.target.called = True

            sql = 'INSERT INTO CALLS (id,'
            vals = (self.myWorld.callEntryCounter,)
            for i in self.myWorld.dbCallList:
                sql += i+','
                if i == 'day':
                    vals += (day,)
                elif i == 'target':
                    if not self.target:
                        vals += (0,)
                    else:
                        vals += (self.target.uid,)
                elif i == 'originator':
                    if not self.originator:
                        vals += (0,)
                    else:
                        vals += (self.originator.uid,)
                else:
                    vals += (getattr(self, i),)
                self.myWorld.callEntryCounter += 1
            sql = sql[0:-1]

            sql += ') VALUES ('+'?,'*(len(vals)-1)+'?'+')'
            self.myWorld.db.execute(sql, vals)


class World:
    total_cases = 0                # This keeps track of the number of cases that have ever been generated
    num_called = 0                 # The number of people that have been called by public health
    
    verbose = False
    
    def __init__(self, config, number_to_generate=1, name=None, db=True):
        self.cumulative = []
        self.count = 0
        self.testCount = 0
        self.callCount = 0
        global worldCount
        
        self.index = worldCount         # The id of this world
        worldCount += 1                 # Increment the number of worlds
        if name is None:
            self.name = 'World ' + repr(self.index)        # Default world name
        else:
            self.name = name            # The name of this world
        self.uuid = 'default'
        self.config_group_num = 1
        self.config_num_in_group = 1
        for k in config:
            # print('Setting '+k+' to '+repr(config[k]))
            setattr(self, k, config[k])  # set world attributes based on config dictionary

        # Ensure that probabilities of starting behavior in minimal, moderate, or maximal states do not exceed 100%
        if self.p_start_min + self.p_start_mod + self.p_start_max > 1:
            raise Exception('Sum of starting behavior probabilities exceed 1')

        self.timers = {}
        # All of the currently active individuals
        self.cases = []
        # List of cases that have been tested positive and submited their key via the app
        self.index_cases = []
        # List of people waiting for a test
        self.test_queue = []
        # The list of individuals that have had a contact event, are running the app, are known about, and need to be called by public health    
        self.call_list = []
        # The list of tests that are waiting to be processed and reported
        self.test_list = []
        if self.daily_test_capacity == 0:
            self.daily_test_capacity = float('Inf')
        # The total amount of man-hours that are worked by contact tracers each day
        self.total_available_calling_time = self.n_contact_tracers * self.work_day_length
        # Tracker for the number of calls by public health that reach an individual
        self.number_successfully_called_on_day = 0
        # Tracker for the number of calls by public health does not reach an individual
        self.number_missed_calls_on_day = 0
        # Tracker for the number of new cases on the day
        self.number_new_cases_on_day = 0
        # Tracker for the total number of calls made        
        self.number_called_all_time = 0
        # Tracker for how much time ph spent in calls today, in manhours
        self.call_time_today = 0
        # Tracker for how much time ph spent in calls overall, in manhours
        self.call_time_total = 0
        # Tracker for the number of new false positive cases being tracked today
        self.number_false_positives_today = 0
        # Tracker for the number of false positive cases ever created
        self.number_false_positives_total = 0
        # Tracker for the number of new falsely discovered cases being picked up by the app
        self.number_false_discovered_today = 0
        # Tracker for the number of falsely discovered cases ever created
        self.number_false_discovered_total = 0
        # Tracker for the number of people notified
        self.number_notified = 0
        # Tracker for the number of people notified but are uninfected
        self.number_uninfected_notified = 0
        # Tracker for the number of people who have entered moderate restriction
        self.number_moderate_restriction = 0
        # Tracker for the number of people who have entered moderate restriction but are uninfected
        self.number_uninfected_moderate_restriction = 0
        # Tracker for the number of people who have entered maximal restriction
        self.number_maximal_restriction = 0
        # Tracker for the number of people who have entered maximal restriction but are uninfected
        self.number_uninfected_maximal_restriction = 0
        
        # Tracker that is returned to the matlab frontend
        self.matlab = {
            'day': [],
            'current_cases': [],
            'total_cases': [],
            'called_today': [],
            'missed_today': [],
            'left_on_call_list': [],
            'total_called': [],
            'call_time_today': [],
            'call_time_total': [],
            'new_cases': [],
            'false_positives_today': [],
            'false_positives_total': [],
            'false_discovered_today': [],
            'false_discovered_total': [],
            'number_notified': [],
            'number_uninfected_notified': [],
            'number_moderate_restriction': [],
            'number_uninfected_moderate_restriction': [],
            'number_maximal_restriction': [],
            'number_uninfected_maximal_restriction': []
        }

        try:
            if not db:
                self.db = sl.connect(':memory:')
            else:
                if not os.path.exists('data/' + self.uuid):
                    if not os.path.exists('data/'):
                        os.mkdir('data/')
                    os.mkdir('data/' + self.uuid)
                dbname = 'data/' + self.uuid + '/run' + repr(self.config_group_num) + '_' + repr(
                    self.config_num_in_group) + '.db'
                if os.path.exists(dbname):
                    os.remove(dbname)
                self.db = sl.connect(dbname)
        except Error as e:
            print(e)
        self.dbIndividualList = {'day': 'INTEGER',
                                 'uid': 'INTEGER',
                                 'dateCreated': 'INTEGER',
                                 'generator': 'INTEGER',
                                 'hasApp': 'INTEGER',
                                 'mctTraceableByGenerator': 'INTEGER',
                                 'appDetectsGenerator': 'INTEGER',
                                 'appDetectedByGenerator': 'INTEGER',
                                 'falseDiscovery': 'INTEGER',
                                 'notified': 'INTEGER',
                                 'notificationsSent': 'INTEGER',
                                 'transmitted': 'INTEGER',
                                 'called': 'INTEGER',
                                 'hasBeenContactTraced': 'INTEGER',
                                 'tested': 'INTEGER',
                                 'testedPositive': 'INTEGER',
                                 'keyUploaded': 'INTEGER',
                                 'testResult': 'TEXT',
                                 'infectionStatus': 'TEXT',
                                 'infected': 'INTEGER',
                                 'test_number': 'INTEGER',
                                 'identifiedThroughMCT': 'INTEGER',
                                 'behavior': 'TEXT',
                                 'wearingMask': 'TEXT',
                                 'latentPeriod': 'REAL',
                                 'incubationPeriod': 'REAL',
                                 'reasonForBehavior': 'TEXT',
                                 'notifiedToday': 'INTEGER',
                                 'appUserInteractions': 'INTEGER'}
        self.dbTestList = {'day': 'INTEGER',
                           'testId': 'INTEGER',
                           'testee': 'INTEGER',
                           'infectionStatusAtTest': 'TEXT',
                           'reason': 'TEXT',
                           'added': 'INTEGER',
                           'testReceived': 'INTEGER',
                           'minDelay': 'REAL',
                           'testResult': 'INTEGER'}
        self.dbCallList = {'day': 'INTEGER',
                           'callId': 'INTEGER',
                           'originator': 'INTEGER',
                           'target': 'INTEGER',
                           'reason': 'TEXT',
                           'added': 'INTEGER',
                           'attempts': 'INTEGER',
                           'callType': 'TEXT',
                           'successful': 'INTEGER',
                           'duration': 'REAL'}
        self.setup = {'num_worlds': 'REAL',
                      'starting_cases': 'REAL',
                      'end_day': 'REAL',
                      'max_num_current_cases': 'REAL',
                      'mean_latent_period': 'REAL',
                      'sd_latent_period': 'REAL',
                      'mean_incubation_period': 'REAL',
                      'sd_incubation_period': 'REAL',
                      'recovery_length': 'REAL',
                      'p_asymptomatic_rate': 'REAL',
                      'p_transmission_asymptomatic_given_no_masks': 'REAL',
                      'p_transmission_presymptomatic_given_no_masks': 'REAL',
                      'p_transmission_symptomatic_given_no_masks': 'REAL',
                      'p_test_given_call': 'REAL',
                      'p_test_baseline': 'REAL',
                      'p_test_given_notification': 'REAL',
                      'p_test_given_symptomatic': 'REAL',
                      'test_delay': 'REAL',
                      'test_delay_sigma': 'REAL',
                      'daily_test_capacity': 'REAL',
                      'p_positive_test_given_exposed': 'REAL',
                      'p_positive_test_given_presymptomatic': 'REAL',
                      'p_positive_test_given_symptomatic': 'REAL',
                      'p_positive_test_given_asymptomatic': 'REAL',
                      'p_running_app': 'REAL',
                      'p_app_detects_generator': 'REAL',
                      'false_discovery_rate': 'REAL',
                      'p_upload_key_given_positive_test': 'REAL',
                      'key_upload_requires_call': 'REAL',
                      'p_successful_call_unanticipated': 'REAL',
                      'p_successful_call_anticipated': 'REAL',
                      'p_identify_individual_using_manual_contact_tracing': 'REAL',
                      'max_contacts_recalled': 'REAL',
                      'n_contact_tracers': 'REAL',
                      'work_day_length': 'REAL',
                      'max_call_attempts': 'REAL',
                      'missed_call_time': 'REAL',
                      'index_trace_call_time': 'REAL',
                      'alert_call_time': 'REAL',
                      'key_upload_call_time': 'REAL',
                      'p_start_min': 'REAL',
                      'p_start_mod': 'REAL',
                      'p_start_max': 'REAL',
                      'p_mask_given_norm': 'REAL',
                      'p_mask_given_min': 'REAL',
                      'p_mask_given_mod': 'REAL',
                      'p_mask_given_max': 'REAL',
                      'mask_effect': 'REAL',
                      'p_contact_public_health_after_positive_test': 'REAL',
                      'p_contact_public_health_after_AEN_notification': 'REAL',
                      'mean_total_contacts': 'REAL',
                      'sigma_total_contacts': 'REAL',
                      'mean_new_cases': 'REAL',
                      'sigma_new_cases': 'REAL',
                      'mean_new_cases_minimal': 'REAL',
                      'sigma_new_cases_minimal': 'REAL',
                      'mean_new_cases_moderate': 'REAL',
                      'sigma_new_cases_moderate': 'REAL',
                      'mean_new_cases_maximal': 'REAL',
                      'sigma_new_cases_maximal': 'REAL',
                      'p_starting_behavior_after_negative_test_no_symptoms': 'REAL',
                      'p_maximal_restriction_given_symptomatic': 'REAL',
                      'p_moderate_restriction_given_symptomatic': 'REAL',
                      'p_minimal_restriction_given_symptomatic': 'REAL',
                      'p_maximal_restriction_given_positive_test': 'REAL',
                      'p_moderate_restriction_given_positive_test': 'REAL',
                      'p_minimal_restriction_given_positive_test': 'REAL',
                      'p_maximal_restriction_given_PH_call': 'REAL',
                      'p_moderate_restriction_given_PH_call': 'REAL',
                      'p_minimal_restriction_given_PH_call': 'REAL',
                      'p_maximal_restriction_given_AEN_notification': 'REAL',
                      'p_moderate_restriction_given_AEN_notification': 'REAL',
                      'p_minimal_restriction_given_AEN_notification': 'REAL',
                      'p_vaccinated': 'REAL',
                      'vaccinated_people_can_spread_asymptomatically': 'REAL'}
        with self.db:
            # self.db.execute("DROP TABLE INDIVIDUALS")
            for table in [('INDIVIDUALS', self.dbIndividualList), ('TESTS', self.dbTestList), ('CALLS', self.dbCallList), ('SETUP', self.setup)]:
                sql = 'CREATE TABLE '+table[0]+' (id INTEGER NOT NULL PRIMARY KEY,'
                for i in table[1]:
                    sql += i+' '+table[1][i]+','
                sql = sql[0:-1]
                sql += ')'
                self.db.execute(sql)
        
        sql = 'INSERT INTO SETUP (id,'    
        vals = (0,)
        for key in self.setup:
            sql = sql+key+','
            vals += (getattr(self, key),)
        sql = sql[0:-1]

        sql+= ') VALUES ('+'?,'*(len(vals)-1)+'?'+')'
        self.db.execute(sql, vals)
            
        self.individualEntryCounter = 1
        self.testEntryCounter = 1
        self.callEntryCounter = 1
        # Generate all of the initial cases
        startingInfected = 0
        for i in range(int(number_to_generate)):
            self.cases.append(Individual(myWorld=self, startingCase=True, daysInSystem=randint(0, self.recovery_length - 1), behavior='Normal'))
            if self.cases[-1].infected == 1:
                startingInfected += 1

        print('STARTING CASES: '+repr(startingInfected))
    def num_active_cases(self):
        t = time.time()
        num_active = {'Uninfected': 0,
                      'Exposed': 0,
                      'Presymptomatic': 0,
                      'Symptomatic': 0,
                      'Asymptomatic': 0,
                      'Recovered': 0}
        for case in self.cases:
            num_active[case.infectionStatus] += 1
        if 'num_active_cases' in self.timers.keys():
            self.timers['num_active_cases'] += time.time()-t
        else:
            self.timers['num_active_cases'] = time.time()-t    
        return(num_active)

    def advanceDay(self):
        self.cumulative.append(self.count)
        global day
        # Update records for plotting (P)
        self.matlab['day'].append(day)
        current_cases = self.num_active_cases()
        self.matlab['current_cases'].append(current_cases['Exposed']+current_cases['Presymptomatic']+current_cases['Symptomatic']+current_cases['Asymptomatic'])
        self.matlab['total_cases'].append(self.total_cases)
        self.matlab['called_today'].append(self.number_successfully_called_on_day)
        self.matlab['missed_today'].append(self.number_missed_calls_on_day)
        self.matlab['left_on_call_list'].append(len(self.call_list))
        self.matlab['total_called'].append(self.number_called_all_time)
        self.matlab['call_time_today'].append(self.call_time_today)
        self.matlab['call_time_total'].append(self.call_time_total)
        self.matlab['new_cases'].append(self.number_new_cases_on_day)
        self.matlab['false_positives_today'].append(self.number_false_positives_today)
        self.matlab['false_positives_total'].append(self.number_false_positives_total)
        self.matlab['false_discovered_today'].append(self.number_false_discovered_today)
        self.matlab['false_discovered_total'].append(self.number_false_discovered_total)
        self.matlab['number_notified'].append(self.number_notified)
        self.matlab['number_uninfected_notified'].append(self.number_uninfected_notified)
        self.matlab['number_moderate_restriction'].append(self.number_moderate_restriction)
        self.matlab['number_uninfected_moderate_restriction'].append(self.number_uninfected_moderate_restriction)
        self.matlab['number_maximal_restriction'].append(self.number_maximal_restriction)
        self.matlab['number_uninfected_maximal_restriction'].append(self.number_uninfected_maximal_restriction)
        
        # Reset all of the trackers
        self.number_successfully_called_on_day = 0
        self.number_new_cases_on_day = 0
        self.number_missed_calls_on_day = 0
        t = time.time()
        # Advance day for each each Individual in this world object
        for case in self.cases:
            case.advanceDay()
        if 'advanceDay' in self.timers.keys():
            self.timers['advanceDay'] += time.time()-t
        else:
            self.timers['advanceDay'] = time.time()-t  
            
    def processTestList(self):
        tests_processed_on_day = 0
        waiting_list = []
        c = 0
        for c,test in enumerate(self.test_list):
            if day-test.added >= test.minDelay:
                if tests_processed_on_day < self.daily_test_capacity:
                    tests_processed_on_day += 1
                    test.processTest()
                else:
                    break
            else:
                waiting_list.append(test)

        for test in self.test_list:
            sql = 'INSERT INTO TESTS (id,'
            vals = (self.testEntryCounter,)
            for i in self.dbTestList:
                sql += i+','
                if i == 'day':
                    vals += (day,)
                elif i == 'testee':
                    vals += (test.testee.uid,)
                else:
                    vals += (getattr(test,i),)
                self.testEntryCounter += 1
            sql = sql[0:-1]
    
            sql+= ') VALUES ('+'?,'*(len(vals)-1)+'?'+')'
            self.db.execute(sql,vals)
        
        self.test_list = self.test_list[c+1:]
        self.test_list.extend(waiting_list)
                
    def processCallList(self):
        t = time.time()
        missed_connections = []
        self.call_time_today = 0
        self.number_successfully_called_on_day = 0
        # print('Starting call list length: '+ repr(len(self.call_list)))
        # Call people until everyone is called or all of the time is used up
        self.call_list = deque(self.call_list)
        while len(self.call_list) > 0 and self.call_time_today < self.total_available_calling_time:
            call = self.call_list.popleft() # Grab the first individual in the call list
                
            if (call.attempts < self.max_call_attempts) and day-call.added < self.recovery_length:
                call.makeCall()
                if not call.successful:
                    missed_connections.append(call)
                    self.call_time_today += self.missed_call_time
                else:
                    self.number_successfully_called_on_day += 1
                    self.call_time_today += call.duration
        
        self.call_list.extend(missed_connections)
        self.number_called_all_time += self.number_successfully_called_on_day
        self.call_time_today = round(self.call_time_today, 2)
        self.call_time_total += self.call_time_today
        self.call_time_total = round(self.call_time_total, 2)
        if 'processCallList' in self.timers.keys():
            self.timers['processCallList'] += time.time()-t
        else:
            self.timers['processCallList'] = time.time()-t
        # print('End call list length: '+ repr(len(self.call_list)))
        
    def transmit(self):
        t = time.time()
        new_cases = []
        self.number_false_positives_today = 0
        self.number_false_discovered_today = 0

        # For every current case, call transmission and add returned new cases to a list
        for case in self.cases:
            if case.infectionStatus not in ['Uninfected','Recovered']:
                new_cases.extend(case.transmit())
        self.cases.extend(new_cases)

        self.number_new_cases_on_day += len(new_cases)
        self.number_false_positives_total += self.number_false_positives_today
        self.number_false_discovered_total += self.number_false_discovered_today
        if 'transmit' in self.timers.keys():
            self.timers['transmit'] += time.time()-t
        else:
            self.timers['transmit'] = time.time()-t
            
    def test(self):
        t = time.time()
        for case in self.cases:
            if case.infectionStatus != 'Recovered':
                case.getsTested()

        if 'test' in self.timers.keys():
            self.timers['test'] += time.time()-t
        else:
            self.timers['test'] = time.time()-t 
            
    def automaticTrace(self):
        t = time.time()
        # TODO: some people are running the app, but it does not detect the person who infects them
        # TODO: add to call list with a flag that they are not going to be contact traced
        for case in self.cases:  # For every person
            if case.generator:  # Avoid crashes due to dereferencing a null pointer
                # If a person is running the app AND
                #   their generator has uploaded their key AND
                #   their app recognized the generator AND 
                #   they have not uploaded a key AND
                #   they have not been notified already
                # then the person will receive a notification
                if case.hasApp and \
                        case.generator.keyUploaded and \
                        case.appDetectsGenerator and \
                        (not case.keyUploaded) and \
                        case.generator.keyUploadDate >= case.dateCreated:
                    
                    if case.generator.uid not in case.notifiedBy: # The AEN is from a new individual
                        case.notifiedBy.append(case.generator.uid)
                        if case.generator and case.notified == 0:
                            case.generator.notificationsSent += 1
                        case.notified += 1         # Immediately send this person an automatic notification
                        
                        if random() < self.p_test_given_notification and\
                            (not case.awaiting_test_results) and\
                            (not case.testedPositive):
                            case.addToTestList(reason='aen_alert')
                        case.generator.notifiedToday += 1
                        case.dayContactRegistered = case.daysInSystem

                        case.checkForChangeInMovementRestrictions(case.myWorld.p_maximal_restriction_given_AEN_notification,
                                                                  case.myWorld.p_moderate_restriction_given_AEN_notification,
                                                                  case.myWorld.p_minimal_restriction_given_AEN_notification,
                                                                  basis='AEN')
                        
                        self.number_notified += 1
                        if case.infectionStatus == 'Uninfected':
                            self.number_uninfected_notified += 1
    
                        if random() < self.p_contact_public_health_after_AEN_notification: # This is a proxy for this person calling public health themselves after getting notified, which would be independent of the typical call list
                            case.addToCallList(reason='AENFollowUp')
    
                # We also add generators (if they meet the criteria) if one of the Individuals they generated uploaded their key
                # If a person's generator is running the app AND
                #   has uploaded their key AND
                #   their generator is running the app AND
                #   their app detected their generator's app
                #   their generator has not uploaded a key AND
                # then the person will receive a notification
                if case.hasApp and \
                        case.keyUploaded and \
                        case.generator.hasApp and \
                        case.appDetectedByGenerator and \
                        (not case.generator.keyUploaded):
                    
                    if case.uid not in case.generator.notifiedBy:
                        case.generator.notifiedBy.append(case.uid)
                        
                        case.generator.dayContactRegistered = case.generator.daysInSystem
                        if case.generator.notified == 0:
                            case.notificationsSent += 1
                        case.generator.notified += 1         # Immediately send this person an automatic notification
                        if random() < self.p_test_given_notification and\
                            (not case.generator.awaiting_test_results) and\
                            (not case.generator.testedPositive):
                            case.generator.addToTestList(reason='aen_alert')
                        case.notifiedToday += 1
                        case.generator.checkForChangeInMovementRestrictions(case.generator.myWorld.p_maximal_restriction_given_AEN_notification,\
                                                                            case.generator.myWorld.p_moderate_restriction_given_AEN_notification,\
                                                                            case.generator.myWorld.p_minimal_restriction_given_AEN_notification,\
                                                                            basis='AEN')

                        # TODO - do we need this block of code here?  Looks like a copy and paste from previous if statement
                        self.number_notified += 1
                        if case.generator.infectionStatus == 'Uninfected':
                            self.number_uninfected_notified += 1
    
                        if random() < self.p_contact_public_health_after_AEN_notification:  # This is a proxy for this generator calling public health themselves after getting notified, which would be independent of the typical call list
                            case.generator.addToCallList(reason='AENFollowUp')
    
        if 'automaticTrace' in self.timers.keys():
            self.timers['automaticTrace'] += time.time()-t
        else:
            self.timers['automaticTrace'] = time.time()-t 

    def cleanup(self):
        t = time.time()
        maintainedCases = [] # We have to remove people that have been in the system too long
        while self.cases:
            case = self.cases.pop()
            # if case.interactionPossible():
            if case.daysInSystem <= self.recovery_length:
                maintainedCases.append(case)
            elif (case.daysInSystem - case.dayTested) <= self.recovery_length:     # NOTE: We may want to control the time to stay on the index list more precisely
                maintainedCases.append(case)
            elif (case.daysInSystem - case.dayContactRegistered) <= self.recovery_length:
                maintainedCases.append(case)
            else:
                # remove from generator's descendant list
                if case.generator:
                    if len(case.generator.descendants):
                        try:
                            case.generator.descendants.remove(case)
                        except:
                            print('Deletion error')
                            pass
                            
        self.cases = maintainedCases
        maintainedCases = [] # The Index case list needs to be maintained as well
        while self.index_cases:
            case = self.index_cases.pop()
            if case.daysInSystem <= self.recovery_length:
                maintainedCases.append(case)
            elif (case.daysInSystem - case.dayTested) <= self.recovery_length:
                maintainedCases.append(case)
            elif (case.daysInSystem - case.dayContactRegistered) <= self.recovery_length:
                maintainedCases.append(case)
        self.index_cases = maintainedCases
        
        if not len(self.cases):
            return False
        else:
            return True


class Individual:
    def __init__(self, myWorld, generator=None, startingCase=False, daysInSystem=0, hasApp=None, mctTraceableByGenerator=None, appDetectsGenerator=False, appDetectedByGenerator=False, infectionStatus='Exposed', behavior='Proportional', wearingMask=None):

        self.myWorld = myWorld                  # The world this person belongs to
        self.dateCreated = day
        self.generator = generator              # The id of the person that came into close contact with this person        
        self.descendants = []                   # The id(s) of this Individual's descendant(s)
        self.daysInSystem = daysInSystem        # The number of days that the person has been in the system
        self.myWorld.total_cases += 1           # Increment the number of people
        self.uid = self.myWorld.total_cases     # A unique (within each world) identifier for each Individual
        self.awaiting_test_results = False
        self.dayTested = 0                      # The day the person was tested
        self.testedPositive = False
        self.dayContactRegistered = 0
        self.startingCase = startingCase

        # Individual state trackers
        if hasApp is None and random() < self.myWorld.p_running_app:
            self.hasApp = True          # True if this person is running the app
        elif hasApp is None:
            self.hasApp = False
        else:
            self.hasApp = hasApp

        if mctTraceableByGenerator is None and random() < self.myWorld.p_identify_individual_using_manual_contact_tracing:
            self.mctTraceableByGenerator = True
        elif mctTraceableByGenerator is None:
            self.mctTraceableByGenerator = False
        else:
            self.mctTraceableByGenerator = mctTraceableByGenerator

        self.appDetectsGenerator = appDetectsGenerator
        self.appDetectedByGenerator = appDetectedByGenerator

        self.falseDiscovery = False
        self.notified = 0                       # The person has been notified automatically by the app
        self.notificationsSent = 0
        self.notifiedBy = []                    # The list of people who they have received an AEN notification from
        self.called = False                     # The person has been called by public health
        self.hasBeenContactTraced = False       # True once the person has been contact traced
        self.tested = 0                         # The person has gone and been tested
        self.keyUploaded = False                # True if the person has uploaded a received key to the sytem. Just a shorthand to not have to interogate the index list as often.
        self.appUserInteractions = 0
        self.keyUploadDate = float('inf')       # The date that the person uploaded their key
        self.testResult = 'Untested'            # The person's actual test results. Possible options: Positive, Negative
        self.infectionStatus = infectionStatus  # Infection Status affects ability to transmit, and likelyhood of getting tested. Possible options: Exposed, Presymptomatic, Asymptomatic, Symptomatic, Uninfected, Recovered
        if infectionStatus != 'Uninfected':
            self.infected = True
        else:
            self.infected = False
        self.test_number = 0
        self.identifiedThroughMCT = False
        if behavior == 'Proportional':
            self.behavior = 'Normal'
            self.checkForChangeInMovementRestrictions(self.myWorld.p_start_max, self.myWorld.p_start_mod, self.myWorld.p_start_min, initialization = True, basis = 'initialization')
        else:
            self.behavior = behavior                # Behavior affects amount of transmission. Possible options: minimal_restriction, moderate_restriction, maximal_restriction
        if random() < self.myWorld.p_vaccinated:
            self.behavior = 'Vaccinated'
        self.initialBehavior = self.behavior

        if wearingMask is None:
            self.wearingMask = self.checkForMask()
        else:
            self.wearingMask = wearingMask
        self.dayEnteredQuarantine = -1
        if self.behavior == 'maximal_restriction':
            self.dayEnteredQuarantine = day
        self.timesOnCallList = 0                # The number of times this person has been added to the call list
        # The amount of time between exposure and the person becoming infectious
        self.latentPeriod = int(max((1, self.myWorld.mean_latent_period + gauss(0, self.myWorld.sd_latent_period))))
        # The amount of time between exposure and the person becoming clinical
        self.incubationPeriod = int(max((self.latentPeriod + 1, self.myWorld.mean_incubation_period + gauss(0, self.myWorld.sd_incubation_period))))        
        self.transmitted = 0
        self.reasonForBehavior = 'Normal'
        self.notifiedToday = 0
        self.contacts = int(np.ceil(np.random.lognormal(mean=self.myWorld.mean_total_contacts,sigma=self.myWorld.sigma_total_contacts)))*[None]
        
    def recontact(self, infectionStatus='Uninfected', generatorHasApp=False):
        self.dateCreated = day
        self.daysInSystem = 0
        if self.hasApp and generatorHasApp and random() < self.myWorld.p_app_detects_generator:
            self.appDetectsGenerator = True
            self.appDetectedByGenerator = True
        else:
            self.appDetectsGenerator = False
            self.appDetectedByGenerator = False
        self.falseDiscovery = False
        self.infectionStatus = infectionStatus  
        if infectionStatus == 'Uninfected':
            self.infected = False
        else:
            self.infected = True
        self.behavior = 'Normal'
        self.initialBehavior = self.behavior
        self.wearingMask = self.checkForMask()
        self.reasonForBehavior = 'Normal'

    def rollNewIndividual(self):
        # Note: 'self' is the generator of a potential new Individual

        # Get behavior
        newBehavior = Individual.rollMovementRestriction(self.myWorld.p_start_max, self.myWorld.p_start_mod, self.myWorld.p_start_min, initialization = True)

        # Get mask use
        newWearingMask = Individual.rollMaskUse(newBehavior, self.myWorld.p_mask_given_norm, self.myWorld.p_mask_given_max, self.myWorld.p_mask_given_mod, self.myWorld.p_mask_given_min)

        # Get infectionStatus of potential new Individual
        if self.infectionStatus in ['Exposed', 'Uninfected', 'Recovered']:  # Generators in these states do not infect others
            newInfectionStatus = 'Uninfected'
        else: # Generators in the other states can infect others            
            if self.infectionStatus == 'Asymptomatic':
                newInfectionStatus = Individual.rollInfectionStatus(self.myWorld.p_transmission_asymptomatic_given_no_masks, self.wearingMask, newWearingMask, self.myWorld.mask_effect)
            elif self.infectionStatus == 'Presymptomatic':
                newInfectionStatus = Individual.rollInfectionStatus(self.myWorld.p_transmission_presymptomatic_given_no_masks, self.wearingMask, newWearingMask, self.myWorld.mask_effect)
            elif self.infectionStatus == 'Symptomatic':
                newInfectionStatus = Individual.rollInfectionStatus(self.myWorld.p_transmission_symptomatic_given_no_masks, self.wearingMask, newWearingMask, self.myWorld.mask_effect)
            else:
                newInfectionStatus = Individual.rollInfectionStatus(self.myWorld.p_transmission_symptomatic_given_no_masks, self.wearingMask, newWearingMask, self.myWorld.mask_effect)

        # Get app use
        newHasApp = random() < self.myWorld.p_running_app

        # Get app detects generator and app detected by generator
        if self.hasApp and newHasApp and random() < self.myWorld.p_app_detects_generator:
            newAppDetectsGenerator = True
            newAppDetectedByGenerator = True
        else:
            newAppDetectsGenerator = False
            newAppDetectedByGenerator = False

        # Get mctTraceableByGenerator
        newMctTraceableByGenerator = random() < self.myWorld.p_identify_individual_using_manual_contact_tracing

        # Get interaction possible
        newInteractionPossible = Individual.getInteractionPossible(newInfectionStatus, newMctTraceableByGenerator, newAppDetectsGenerator, newAppDetectedByGenerator)

        if newInteractionPossible:
            # Create new Individual
            newIndividual = Individual(myWorld=self.myWorld,
                                       generator=self,
                                       mctTraceableByGenerator=newMctTraceableByGenerator,
                                       hasApp=newHasApp,
                                       appDetectsGenerator=newAppDetectsGenerator,
                                       appDetectedByGenerator=newAppDetectedByGenerator,
                                       infectionStatus=newInfectionStatus,
                                       behavior=newBehavior,
                                       wearingMask=newWearingMask)
        else:
            # Do not create new individual
            newIndividual = None

        return newIndividual

    @staticmethod
    def rollMovementRestriction(p_max, p_mod, p_min, initialization=False):
        if initialization:  # For when agent is created
            output = 'Normal'

            r = random()

            if r <= p_max:
                output = 'maximal_restriction'
            elif r <= p_mod + p_max:
                output = 'moderate_restriction'
            elif r <= p_min + p_mod + p_max:
                output = 'minimal_restriction'
        
        else: # For when existing agent's behavior is changing
            output = 'Normal'
            if random() < p_max:
                output = 'maximal_restriction'
            elif random() < p_mod:
                output = 'moderate_restriction'
            elif random() < p_min:
                output = 'minimal_restriction'
            
        return output

    @staticmethod
    def rollMaskUse(behavior, p_mask_norm, p_mask_max, p_mask_mod, p_mask_min):
        if behavior == 'Normal':
            return random() < p_mask_norm
        elif behavior == 'maximal_restriction':
            return random() < p_mask_max
        elif behavior == 'moderate_restriction':
            return random() < p_mask_mod
        elif behavior == 'minimal_restriction':
            return random() < p_mask_min
        elif behavior == 'Vaccinated':
            return random() < p_mask_norm
        else:
            raise Exception('Invalid behavior %s' % behavior)

    @staticmethod
    def getInteractionPossible(infectionStatus, mctTBG, appDetectsGenerator, appDetectedByGenerator):
        # This should only be used when individuals are created.
        if infectionStatus not in ['Uninfected', 'Recovered']: # (1)
            return True
        elif mctTBG: # (2)
            return True
        elif appDetectsGenerator or appDetectedByGenerator: # (3)
            return True
        else:
            return False        

    @staticmethod
    def rollInfectionStatus(p_transmission_no_masks, maskIndex, maskContact, maskEffect):
        p_transmission = p_transmission_no_masks
        if maskIndex:
            p_transmission = p_transmission * (1 - maskEffect)
        if maskContact:
            p_transmission = p_transmission * (1 - maskEffect)

        status = 'Exposed' if random() < p_transmission else 'Uninfected'
        return status

    def interactionPossible(self):
    # An agent can only 'interact' with others upon creation if it is (1) infected OR (2) recognizable through MCT OR (3) recognizable through AEN

        return Individual.getInteractionPossible(self.infectionStatus, self.mctTraceableByGenerator, self.appDetectsGenerator, self.appDetectedByGenerator)        

    def uploadKey(self):
        if not self.keyUploaded and self.hasApp:
            self.myWorld.count += 1
            self.keyUploaded = True
            self.keyUploadDate = day
        
    def checkForMask(self):

        return Individual.rollMaskUse(self.behavior, self.myWorld.p_mask_given_norm, self.myWorld.p_mask_given_max, self.myWorld.p_mask_given_mod, self.myWorld.p_mask_given_min)

        # if self.behavior == 'Normal':
        #     return random() < self.myWorld.p_mask_given_norm
        # elif self.behavior == 'maximal_restriction':
        #     return random() < self.myWorld.p_mask_given_max
        # elif self.behavior == 'moderate_restriction':
        #     return random() < self.myWorld.p_mask_given_mod
        # elif self.behavior == 'minimal_restriction':
        #     return random() < self.myWorld.p_mask_given_min
        
    def maximalRestriction(self, initialization=False):
        if self.behavior != 'maximal_restriction':
            self.myWorld.number_maximal_restriction += 1

            if not initialization:
                wearingMaskBefore = self.wearingMask
                self.wearingMask = self.wearingMask or random() < self.myWorld.p_mask_given_max
            else:
                self.wearingMask = random() < self.myWorld.p_mask_given_max

            if self.infectionStatus == 'Uninfected':
                self.myWorld.number_uninfected_maximal_restriction += 1
        
        self.behavior = 'maximal_restriction'
        if self.dayEnteredQuarantine == -1:
            self.dayEnteredQuarantine = day
        
    def moderateRestriction(self, initialization=False):
        if self.behavior != 'maximal_restriction':
            if self.behavior != 'moderate_restriction':

                if not initialization:
                    wearingMaskBefore = self.wearingMask
                    self.wearingMask = self.wearingMask or random() < self.myWorld.p_mask_given_mod
               
                else:
                    self.wearingMask = random() < self.myWorld.p_mask_given_mod

                    self.myWorld.number_moderate_restriction += 1
                    if self.infectionStatus == 'Uninfected':
                        self.myWorld.number_uninfected_moderate_restriction += 1
            self.behavior = 'moderate_restriction'
    
    def minimalRestriction(self, initialization=False):
        if self.behavior != 'maximal_restriction' and self.behavior != 'moderate_restriction' and self.behavior != 'minimal_restriction':
            
            if not initialization:
                wearingMaskBefore = self.wearingMask

                self.wearingMask = self.wearingMask or random() < self.myWorld.p_mask_given_min
            else:
                self.wearingMask = random() < self.myWorld.p_mask_given_min

            self.behavior = 'minimal_restriction'
    
    def checkForChangeInMovementRestrictions(self, p_max, p_mod, p_min, initialization = False, basis = 'unspecified'):
        if self.behavior == 'Vaccinated':
            return
        oldBehavior = self.behavior

        potentialNewRestriction = Individual.rollMovementRestriction(p_max, p_mod, p_min, initialization = initialization)

        if potentialNewRestriction == 'Normal':
            pass
        elif potentialNewRestriction == 'maximal_restriction':
            self.maximalRestriction(initialization = initialization)
        elif potentialNewRestriction == 'moderate_restriction':
            self.moderateRestriction(initialization = initialization)
        elif potentialNewRestriction == 'minimal_restriction':
            self.minimalRestriction(initialization = initialization)
        else:
            raise Exception('Invalid potentialNewRestriction %s' % potentialNewRestriction)            

        if oldBehavior != self.behavior:
            self.reasonForBehavior = basis
        
    def advanceDay(self): # This is a general container for things that happen when a day goes by
        sql = 'INSERT INTO INDIVIDUALS (id,'
        vals = (self.myWorld.individualEntryCounter,)
        for i in self.myWorld.dbIndividualList:
            sql += i+','
            if i == 'day':
                vals += (day,)
            elif i == 'generator':
                if self.generator is None:
                    vals += (-1,)
                else:
                    vals += (self.generator.uid,)
            else:
                vals += (getattr(self, i),)
        sql = sql[0:-1]

        sql += ') VALUES ('+'?,'*(len(vals)-1)+'?'+')'
        self.myWorld.db.execute(sql, vals)
            
        self.notifiedToday = 0
        self.myWorld.individualEntryCounter += 1
        self.daysInSystem += 1 # Increment number of days this person has been in the system
        if self.infectionStatus == 'Recovered':
            return
        # Mark down Individiual's state before day's changes to let us know if we need to generate events to log
        oldInfectionStatus = self.infectionStatus
        # oldBehavior = self.behavior # behavior before any potential changes -- need this to know when to log behavior changes

        if self.infectionStatus == 'Exposed' and self.daysInSystem >= self.latentPeriod:
            self.infectionStatus = 'Presymptomatic'            
        if self.infectionStatus == 'Presymptomatic' and self.daysInSystem >= self.incubationPeriod:
            if random() < self.myWorld.p_asymptomatic_rate or self.behavior == 'Vaccinated':
                self.infectionStatus = 'Asymptomatic'
            else:
                self.infectionStatus = 'Symptomatic'
        if self.daysInSystem >= self.myWorld.recovery_length and self.infectionStatus != 'Uninfected':
            self.infectionStatus = 'Recovered'
            if self.generator:
                maintained_contacts = []
                for case in self.generator.contacts:
                    if case is not None:
                        if case.infectionStatus != 'Recovered':
                            maintained_contacts.append(case)
                    else:
                        maintained_contacts.append(None)
                self.generator.contacts = maintained_contacts
            self.infected = False
        # If infection status changed, log it
        if oldInfectionStatus != self.infectionStatus:            
            if self.infectionStatus == 'Recovered':
                self.myWorld.recovered += 1
        
        # Update this person's behavior
        if self.infectionStatus != 'Recovered':
            self.updateBehavior()
        if self.behavior == 'maximal_restriction':
            if day-self.dayEnteredQuarantine > self.myWorld.recovery_length:
                self.behavior = 'Normal'
        
    def updateBehavior(self):
        # Every day we will check if a person alters their behavior based on their status (tested, called, etc.)
        if self.infectionStatus == 'Symptomatic':
            self.checkForChangeInMovementRestrictions(self.myWorld.p_maximal_restriction_given_symptomatic,
                                                      self.myWorld.p_moderate_restriction_given_symptomatic,
                                                      self.myWorld.p_minimal_restriction_given_symptomatic,
                                                      basis='symptomatic')
        if self.testResult == 'Positive':
            self.checkForChangeInMovementRestrictions(self.myWorld.p_maximal_restriction_given_positive_test,
                                                      self.myWorld.p_moderate_restriction_given_positive_test,
                                                      self.myWorld.p_minimal_restriction_given_positive_test,
                                                      basis='positiveTest')

    def addToCallList(self, reason='unknown', callType=None):
        self.myWorld.call_list.append(Call(target=self, reason=reason, callType=callType))
        self.timesOnCallList += 1

    def addToTestList(self, reason=None):
        if not self.awaiting_test_results and not self.testedPositive:
            self.myWorld.test_list.append(Test(testee=self, reason=reason))

    def transmit(self):
        # Establish new Individuals generated by this Individual
        
        # Initialize lists and counters to be outputted
        newContacts = [] 
        numNewCases = 0 
        newNewDetectedTrueCloseContacts = 0 

        if self.infectionStatus not in ['Recovered', 'Uninfected']: # Can only create new Individuals if infectious
            # Get number of new Individuals (i.e., number of true close contacts)
            if self.behavior == 'maximal_restriction':
                numNewCases = np.random.lognormal(mean=self.myWorld.mean_new_cases_maximal,sigma=self.myWorld.sigma_new_cases_maximal)
            elif self.behavior == 'moderate_restriction':
                numNewCases = np.random.lognormal(mean=self.myWorld.mean_new_cases_moderate,sigma=self.myWorld.sigma_new_cases_moderate)
            elif self.behavior == 'minimal_restriction':
                numNewCases = np.random.lognormal(mean=self.myWorld.mean_new_cases_minimal,sigma=self.myWorld.sigma_new_cases_minimal)
            elif self.behavior == 'Vaccinated':
                if self.myWorld.vaccinated_people_can_spread_asymptomatically:
                    numNewCases = np.random.lognormal(mean=self.myWorld.mean_new_cases,sigma=self.myWorld.sigma_new_cases)
                else:
                    numNewCases = 0
            else:
                numNewCases = np.random.lognormal(mean=self.myWorld.mean_new_cases,sigma=self.myWorld.sigma_new_cases)
            
            numNewCases = int(min(10,numNewCases))
            numNewCases = min(len(self.contacts)-1,numNewCases)
            contacts = sample(range(len(self.contacts)),numNewCases)
            
            ##
            
            # Keep track of the number of flashes
            num_flashes = 0
            
            # Roll the dice on a new Individual for each new case
            for i in range(numNewCases):
                new_individual = self.rollNewIndividual()
                if new_individual is None:
                    num_flashes += 1                    
                else:
                    if self.contacts[contacts[i]] is None:
                        self.contacts[contacts[i]] = new_individual
                        newContacts.append(new_individual)
                    elif self.contacts[contacts[i]].infectionStatus == 'Recovered':
                        pass
                    else:
                        if not self.contacts[contacts[i]].infected:
                            self.contacts[contacts[i]].recontact(infectionStatus=new_individual.infectionStatus,generatorHasApp=self.hasApp)
                        else:
                            self.transmitted -= 1
                            
                    if new_individual.infected:
                        self.transmitted += 1
                    if new_individual.appDetectsGenerator:
                        newNewDetectedTrueCloseContacts += 1
                    if new_individual.hasApp:
                        self.appUserInteractions += 1
                    
                    if new_individual.infectionStatus == 'Uninfected' and new_individual.appDetectsGenerator:
                        self.myWorld.number_false_positives_today += 1
                
            numNewFalseDiscovered = round((newNewDetectedTrueCloseContacts * self.myWorld.false_discovery_rate) / (1 - self.myWorld.false_discovery_rate))
            # TODO: CAP ALERT!
            numNewFalseDiscovered = int(min(numNewFalseDiscovered, 3))
            numNewFalseDiscovered = min(len(self.contacts), numNewFalseDiscovered)
            if self.hasApp:
                # numNewFalseDiscovered = (1 / self.myWorld.false_discovery_rate) - 1
               
                # for individual in range(newNewDetectedTrueCloseContacts):
                contacts = sample(range(len(self.contacts)), numNewFalseDiscovered)
                for i in range(numNewFalseDiscovered):
                    if self.contacts[contacts[i]] is None:
                        new_individual = Individual(myWorld=self.myWorld, generator=self, infectionStatus='Uninfected', hasApp=True, mctTraceableByGenerator=False)
                        new_individual.appDetectsGenerator = True
                        new_individual.appDetectedByGenerator = True
                        new_individual.falseDiscovery = True
                        self.contacts[contacts[i]] = new_individual
                        newContacts.append(new_individual)
                    else:
                        if self.contacts[contacts[i]].hasApp:
                            self.contacts[contacts[i]].appDetectsGenerator = self.contacts[contacts[i]].appDetectsGenerator or \
                                                                         random() < self.myWorld.p_app_detects_generator
                            self.contacts[contacts[i]].appDetectedByGenerator = self.contacts[contacts[i]].appDetectsGenerator

                    # self.myWorld.number_false_positives_today += 1
                    self.myWorld.number_false_discovered_today += 1
                    self.appUserInteractions += 1
                # print(repr(self.appUserInteractions))
        # Assign newContacts to Individual's descendant list
        self.descendants.extend(newContacts)
        return newContacts
    
    def getsTested(self):  # We assume there is some baseline probability of getting tested
                           # and a different probability of getting tested if you have been called by public health
        if not self.awaiting_test_results and not self.testedPositive:
            if random() < self.myWorld.p_test_baseline:
                self.addToTestList(reason='baseline')
            
            if self.infectionStatus == 'Symptomatic':
                if random() < self.myWorld.p_test_given_symptomatic:
                    self.addToTestList(reason='symptomatic')


def main(config={}, configFile='', verbose=False, retain_db=True):

    print('=================================')
    print('======  Simulation Start  =======')
    print('=================================')

    # Get start time
    tic = time.time()

    # Handle simulation configuration
    defaultConfigFile = 'config.json'    

    if config != {}: # If a config dictionary has been specified as an argument to main(), use it and don't use a config file
        print('**********************************************************')
        print('Using configuration dictionary specified as input argument')
        print('**********************************************************')

    elif configFile == '' and os.path.exists(defaultConfigFile): # no config file specified; default file exists 

        print('**************************')
        print('Using default config file.')
        print('**************************')
        print('Config file: %s' % defaultConfigFile)
        
        with open(defaultConfigFile, 'r') as fp:            
            config = json.load(fp)
        print('Config #: '+repr(config['config_group_num']))
        print('Run #   : '+repr(config['config_num_in_group']))
    elif configFile == '' and not os.path.exists(defaultConfigFile):  # no config file specified, default file does not exist
        config = readConfig('pytools/config.txt')  # use default in config.txt

        print('********************************')
        print('Using default config parameters.')
        print('********************************')

        pprint.pprint(config)
    elif configFile != '' and os.path.exists(configFile):  # config file specified, exists

        print('***************************')
        print('Using specified config file.')
        print('***************************')
        print('Config file: %s' % configFile)

        with open(configFile, 'r') as fp:            
            config = json.load(fp)
    else: # config file specified, does not exist
        raise Exception('Specified config file %s not found.' % configFile)

    global day
    day = 0
    end_day = config['end_day']
    global_num_active_cases = 0
    global_num_total_cases = 0
    
    # Create worlds
    global worldCount
    worldCount = 0
    active_worlds = []
    for i in range(int(config['num_worlds'])):
        pprint.pprint(config)
        active_worlds.append(World(config, number_to_generate=config['starting_cases'], db=retain_db))
    
    # Make sure user sees terminal output
    sys.stdout.flush()

    # Run sim
    while True:
        global_num_active_cases = 0
        global_num_total_cases= 0
        for world in active_worlds:
            # Update each world
            world.recovered = 0
            world.advanceDay()
            world.transmit()
            world.test()
            world.automaticTrace()
            world.processCallList()
            world.processTestList()
            keep_running = world.cleanup()
            # print('****'+repr(world.recovered)+'****')
            # Contribute this world to the global trackers
            global_num_active_cases += len(world.cases)
            global_num_total_cases += world.total_cases
            # Print some results
            if verbose:
                print('World:                    '+repr(world.name))
                print('Day:                      '+repr(day)+'/'+repr(end_day))
                print('Cases:                    '+repr(len(world.cases)))
                print('Called today:             '+repr(world.number_successfully_called_on_day))
                print('Remaining on call list:   '+repr(len(world.call_list)))
                print('Missed calls today:       '+repr(world.number_missed_calls_on_day))
                print('Call time today:          '+repr(world.call_time_today) + ' hours')
                print('Call time total:          '+repr(world.call_time_total) + ' hours')
                print('Current index cases:      '+repr(len(world.index_cases)))
                print('New falsely discovered:   '+repr(world.number_false_discovered_today))
                print('New false positives:      '+repr(world.number_false_positives_today))
                print('Total regional cases:     '+repr(world.total_cases))
                print()
        if verbose:
            print('Global')
            print('Active global cases:   '+repr(global_num_active_cases))
            print('Total global cases:    '+repr(global_num_total_cases))
            print()
        else:
            pass
            print('Day: '+repr(day)+'/'+repr(end_day))
            print('Cases: '+repr(len(world.cases))+'/'+repr(config['max_num_current_cases']))
            print()

        # Break conditions for the while loop
        if day >= end_day:
            print('Maximum day (%d) reached.' % end_day)
            break
        elif global_num_active_cases <= 0:
            print('No active cases.')
            break
        elif global_num_active_cases > config['max_num_current_cases']:
            print('Maximum number of cases (%d) exceeded.' % config['max_num_current_cases'])
            break
        elif not keep_running:
            print('Everyone got better!')
            break
        
        # Increment the day
        day += 1

        # Make sure user sees terminal output
        sys.stdout.flush()
    for world in active_worlds:
        if retain_db:
            world.db.commit()
            world.db.close()

    # Get end time
    toc = time.time() 
    #print('=================================')
    #print('=====  Simulation Complete  =====')
    #print('=================================')
    print('Simulation duration: %0.1f seconds.' % (toc - tic))

    return active_worlds[0].db

##########################
#### CALL MAIN METHOD ####
##########################

# System arguments beyond the first one come from Grid runs.  Arguments:
#
# [0]: script name (not used)
# [1]: run index
# [2]: base results directory plus run index


if __name__ == "__main__":

    if len(sys.argv) == 1: # No files specified
        worlds = main()

    elif len(sys.argv) == 3: # (1) index and (2) base results directory plus run index
        # Get index
        ind = int(sys.argv[1])
        print('Index: %d' % ind)

        # Locate JSON file
        # file contains (a) setup, (b) NRPC, (c) groups, (d) writeLog, and (e) num_configs
        base_folder = os.path.dirname(sys.argv[2])
        print('Base folder: %s' % base_folder)
        setup_file = base_folder + '/config/setup.json'

        # Load JSON file
        with open(setup_file, 'r') as fp:
            setup_data = json.load(fp)

        ## Generate configuration
        setup = setup_data['setup']        
        NRPC = setup_data['NRPC']
        groups = setup_data['groups']
        writeLog = setup_data['writeLog']
        NC = setup_data['num_configs']

        config = ind2config(setup, groups, NRPC, ind)
        ##

        ## Generate eventFile and arrayFile
        ndig_configs = math.ceil(math.log10(NC + 1))
        ndig_nrpc = math.ceil(math.log10(NRPC + 1))

        eventFile = base_folder + '/logs/events/config%0*d_%0*d.json' % (ndig_configs, config['config_group_num'], ndig_nrpc, config['config_num_in_group'])
        arrayFile = base_folder + '/logs/arrays/config%0*d_%0*d.json' % (ndig_configs, config['config_group_num'], ndig_nrpc, config['config_num_in_group'])
        ##

        # Run the main routine
        main(writeLog = writeLog, config = config, eventFileIn = eventFile, arrayFileIn = arrayFile)

    # elif len(sys.argv) == 2: # Config file specified

        # configFile = sys.argv[1]
        # main(configFile = configFile)

    # elif len(sys.argv) == 3: # Config and log file specified

        # configFile = sys.argv[1]
        # baseLogFile = sys.argv[2]

        # eventFile = os.path.dirname(baseLogFile) + '/events/' + os.path.basename(baseLogFile)
        # arrayFile = os.path.dirname(baseLogFile) + '/arrays/' + os.path.basename(baseLogFile)

        # main(configFile = sys.argv[1], eventFileIn = eventFile, arrayFileIn = arrayFile)

    else:
        raise Exception("Invalid input arguments")
