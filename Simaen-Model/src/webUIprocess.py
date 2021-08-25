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
import sqlite3 as sl
from os import path, listdir
from pathlib import Path
import numpy as np
from collections import Counter


def intersect(set_a, set_b, negate=False):
    idx_a = [x for (x, d) in set_a]
    idx_b = [x for (x, d) in set_b]
    if len(idx_a) == 0 or len(idx_b) == 0:
        if not negate:
            return []
        else:
            if len(idx_a) == 0:
                total_length = max(idx_b) + 1
            elif len(idx_b) == 0:
                total_length = max(idx_a) + 1
            else:
                return []
    else:
        total_length = max((max(idx_a), max(idx_b))) + 1
    vec_a = np.zeros((total_length, 1))
    vec_b = np.zeros((total_length, 1))
    for (x, d) in set_a:
        if vec_a[x] == 0:
            vec_a[x] = d
    for (x, d) in set_b:
        vec_b[x] = 1
    if negate:
        vec_b = np.logical_not(vec_b)
    vec_int = np.multiply(vec_a, vec_b)
    vec_int = np.transpose(vec_int).tolist()[0]
    idx = [x for x in range(len(vec_int))]  # A list of all potential user ids
    return [(int(x), int(d)) for (x, d) in zip(idx, vec_int) if d > 0]


def getResults(data, n_days):
    cases = cases = n_days*[0] # np.zeros((n_days, 1))
    if data:
        uid = [u for (u, d) in data if d == 1]
        for ii in range(2, n_days):
            nuid = [u for (u, d) in data if d == ii]
            nc = [x for x in nuid if x not in uid]
            newCases = len(nc)
            cases[ii] = newCases
            uid = nuid
    return cases


def process(db):
    output = dict()
    cur = db.cursor()
    cur.execute("SELECT MAX(day) from INDIVIDUALS")
    days = cur.fetchall()[0][0]

    cur.execute("SELECT uid,generator from INDIVIDUALS WHERE infected == 1 AND generator > 0 GROUP BY uid")
    data = cur.fetchall()
    cur.execute(
        "SELECT uid from INDIVIDUALS WHERE infected == 1 AND dateCreated < " + str(days - 15) + " AND dateCreated > 5")
    subdata = cur.fetchall()
    subdata = [x[0] for x in subdata]
    data = [x for x in data if x[1] in subdata]
    infected = set([x for (x, y) in data])
    infected_generator = [y for (x, y) in data]
    generator = set(subdata)
    R = len(infected) / max(len(generator), 1)
    gc = 0
    ic = 0
    for g in generator:
        gc += 1
        ic += len([x for x in infected_generator if x == g])
    print(repr(R))

    cur.execute("SELECT testee,day from TESTS WHERE testReceived > 0 AND testResult == -1")
    neg = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT uid,day from INDIVIDUALS WHERE testedPositive > 0")
    pos = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT uid,day from INDIVIDUALS WHERE infected == 1")
    infected = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT uid,day from INDIVIDUALS WHERE hasApp > 0")
    has_app = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT uid,day from INDIVIDUALS WHERE infectionStatus == 'Asymptomatic'")
    asymp = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT uid,day from INDIVIDUALS WHERE infectionStatus == 'Symptomatic'")
    symp = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT uid,day from INDIVIDUALS WHERE notified > 0")
    aen = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT testee,day from TESTS WHERE reason == 'aen_alert'")
    aen_triggered_tests = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT testee,day from TESTS WHERE reason == 'mct_call'")
    mct_triggered_tests = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT testee,day from TESTS WHERE reason == 'baseline'")
    baseline_tests = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT testee,day from TESTS WHERE reason == 'symptomatic'")
    symptomatic_tests = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT target,day from CALLS WHERE reason == 'identifiedThroughMCT' AND successful == 1")
    mct = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT target,day from CALLS WHERE reason == 'AENFollowUp' AND successful == 1")
    aen_followup_calls = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT target,day from CALLS WHERE reason == 'keyUpload' AND successful == 1")
    key_upload_calls = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT target,day from CALLS WHERE reason == 'performMCT' AND successful == 1")
    perform_mct_calls = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT uid,day FROM INDIVIDUALS WHERE keyUploaded > 0")
    key_upload = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT uid,day from INDIVIDUALS WHERE behavior == 'maximal_restriction'")
    quar = [(u, d) for (u, d) in cur.fetchall()]

    cur.execute("SELECT uid,day from INDIVIDUALS WHERE behavior == 'Vaccinated'")
    vaccinated = [(u, d) for (u, d) in cur.fetchall()]

    db.close()

    output['infected'] = getResults(infected, days) # 1

    output['R'] = (R,) # 2

    val = intersect(pos, quar)
    output['pos_and_quar'] = getResults(val, days) # 3

    output['cases_prevented'] = (0,) # 4

    val = intersect(quar, infected, negate=True)
    output['quar_and_not_infected'] = getResults(val, days) # 5

    temp = intersect(infected, aen)
    val = intersect(temp, mct, negate=True)
    output['infected_and_aen'] = getResults(val, days) # 6

    temp = intersect(infected, aen, negate=True)
    val = intersect(temp, mct)
    output['infected_and_mct'] = getResults(val, days) # 7

    temp = intersect(infected, mct)
    val = intersect(temp, aen)
    output['infected_and_both'] = getResults(val, days) # 8

    temp = intersect(infected, mct, negate=True)
    temp = intersect(temp, aen, negate=True)
    val = intersect(temp, pos)
    output['infected_and_pos'] = getResults(val, days) # 9

    temp = intersect(infected, mct, negate=True)
    temp = intersect(temp, aen, negate=True)
    val = intersect(temp, pos, negate=True)
    output['infected_and_none'] = getResults(val, days) # 10

    output['aen_followup_calls'] = getResults(aen_followup_calls, days) # 11

    output['mct_calls'] = getResults(mct, days) # 12

    val = key_upload_calls
    val.extend(perform_mct_calls)
    output['other_calls'] = getResults(val, days) # 13

    output['aen_triggered_tests'] = getResults(aen_triggered_tests, days) # 14

    output['mct_triggered_tests'] = getResults(mct_triggered_tests, days) # 15

    val = symptomatic_tests
    val.extend(baseline_tests)
    output['symptomatic_tests'] = getResults(val, days) # 16

    temp = intersect(pos, aen)
    val = intersect(temp, mct, negate=True)
    output['pos_aen'] = getResults(val, days) # 17

    temp = intersect(pos, aen, negate=True)
    val = intersect(temp, mct)
    output['pos_mct'] = getResults(val, days) # 18

    temp = intersect(pos, aen)
    val = intersect(temp, mct)
    output['pos_both'] = getResults(val, days) # 19

    temp = intersect(pos, aen, negate=True)
    val = intersect(temp, mct, negate=True)
    output['pos_none'] = getResults(val, days) # 20

    temp = intersect(pos, aen)
    temp = intersect(temp, symp)
    val = intersect(temp, mct, negate=True)
    output['pos_aen_sym'] = getResults(val, days) # 21

    temp = intersect(pos, aen, negate=True)
    temp = intersect(temp, symp)
    val = intersect(temp, mct)
    output['pos_mct_sym'] = getResults(val, days) # 22

    temp = intersect(pos, aen)
    temp = intersect(temp, symp)
    val = intersect(temp, mct)
    output['pos_both_sym'] = getResults(val, days) # 23

    temp = intersect(pos, aen, negate=True)
    temp = intersect(temp, symp)
    val = intersect(temp, mct, negate=True)
    output['pos_none_sym'] = getResults(val, days) # 24

    temp = intersect(pos, aen)
    temp = intersect(temp, symp, negate=True)
    val = intersect(temp, mct, negate=True)
    output['pos_aen_asym'] = getResults(val, days) # 25

    temp = intersect(pos, aen, negate=True)
    temp = intersect(temp, symp, negate=True)
    val = intersect(temp, mct)
    output['pos_mct_asym'] = getResults(val, days) # 26

    temp = intersect(pos, aen)
    temp = intersect(temp, symp, negate=True)
    val = intersect(temp, mct)
    output['pos_both_asym'] = getResults(val, days) # 27

    temp = intersect(pos, aen, negate=True)
    temp = intersect(temp, symp, negate=True)
    val = intersect(temp, mct, negate=True)
    output['pos_none_asym'] = getResults(val, days) # 28

    temp = intersect(neg, aen)
    val = intersect(temp, mct, negate=True)
    output['neg_aen'] = getResults(val, days)  # 29

    temp = intersect(neg, aen, negate=True)
    val = intersect(temp, mct)
    output['neg_mct'] = getResults(val, days)  # 30

    temp = intersect(neg, aen)
    val = intersect(temp, mct)
    output['neg_both'] = getResults(val, days)  # 31

    temp = intersect(neg, aen, negate=True)
    val = intersect(temp, mct, negate=True)
    output['neg_none'] = getResults(val, days)  # 32

    temp = intersect(quar, aen)
    val = intersect(temp, mct, negate=True)
    output['quar_aen'] = getResults(val, days)  # 33

    temp = intersect(quar, aen, negate=True)
    val = intersect(temp, mct)
    output['quar_mct'] = getResults(val, days)  # 34

    temp = intersect(quar, aen)
    val = intersect(temp, mct)
    output['quar_both'] = getResults(val, days)  # 35

    temp = intersect(quar, aen, negate=True)
    val = intersect(temp, mct, negate=True)
    output['quar_none'] = getResults(val, days)  # 36

    temp = intersect(quar, infected, negate=True)
    val = intersect(temp, aen)
    output['quar_and_not_infected_aen'] = getResults(val, days) # 37


    for n, condition in enumerate(output):
        print('('+repr(n+1)+') '+condition+' : ',end='')
        if condition == 'R' or condition == 'cases_prevented':
            print(repr(sum(output[condition])))
        else:
            print(repr(int(np.sum(output[condition]) * 100)))
            #print(repr(int(np.sum(output[condition])) * 100))
    return output
