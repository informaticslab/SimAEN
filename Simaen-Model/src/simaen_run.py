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
import WorkflowModel as simaen
import readConfig
from multiConfig import generateConfig
import uuid
#from processTreeReduced import process
from webUIprocess import process
#from DBProcess import process
from random import random
import json
import numpy as np
# Read the default configuration
config = readConfig.default()

# Specify deviations from the default configuration
#    Variables we want to evaluate over a collection of values are specified using a list
config['end_day'] = 30
config['starting_cases'] = 522
config['p_running_app'] = 0.750
config['p_upload_key_given_positive_test'] = 0.72
config['test_delay'] = 2
config['mean_new_cases'] = 2.1
config['n_contact_tracers'] = 5
config['p_app_detects_generator'] = 0.86
config['false_discovery_rate'] =    0.3
config['p_vaccinated'] = 0
config['mean_total_contacts'] = 2.5
config['p_mask_given_norm'] = 0.25

config['key_upload_requires_call'] = 0
config['p_maximal_restriction_given_AEN_notification'] = 0.9

# Specify variables that change in unison
#   Example: groups = (["p_app_detects_generator","false_discovery_rate"],)
groups = (["p_app_detects_generator","false_discovery_rate"],)

# Specify the number of iterations for each configuration
trials = 5
uuid = str(uuid.uuid4())
values = []

output = 0
f = {'infected_and_mct':[],'infected_and_aen':[],'infected':[],'quar_and_not_infected':[],'quar_and_not_infected_aen':[],'R':[]}
for n, setup in enumerate(generateConfig(config,groups=groups)):
    for i in range(trials):
        setup['config_group_num'] = n
        setup['config_num_in_group'] = i
        setup['uuid'] = uuid

        db = simaen.main(config=setup, verbose=False, retain_db=False)
        v = process(db)
        db.close()
        if f is None:
            f = {}
            for key in v:
                f[key] = []
        for val in f:
            f[val].append(v[val])
        print('Trial #'+repr(i))