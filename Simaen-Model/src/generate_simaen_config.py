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
# Read the default configuration
config = readConfig.default()

# Specify the number of iterations for each configuration
trials = 1

config['starting_cases'] = [200, 500, 800]
config['test_delay'] = [0, 2, 4]
config['p_running_app'] = [0, 0.25, 0.5, 0.75]
config['p_app_detects_generator'] = [0.36, 0.67, 0.86]
config['false_discovery_rate'] = [0.122, 0.23, 0.3]
config['p_upload_key_given_positive_test'] = 0.5
config['p_mask_given_norm'] = [0.25, 0.5, 0.75]
config['mean_new_cases'] = [2.1, 2.5, 2.9]
config['mean_total_contacts'] = [2.1, 2.7, 3.2]
config['p_maximal_restriction_given_PH_call'] = [0.5, 0.9]
config['p_maximal_restriction_given_AEN_notification'] = [0.5, 0.9]
config['p_vaccinated'] = [0, 0.2, 0.5]
config['n_contact_tracers'] = [10,100]
config['key_upload_requires_call'] = [0,1]

# Specify variables that change in unison
#   Example: groups = (["p_app_detects_generator","false_discovery_rate"],)
groups = (["p_app_detects_generator","false_discovery_rate"],['mean_new_cases','mean_total_contacts'])

uuid = str(uuid.uuid4())
values = []
c = 0
for n, setup in enumerate(generateConfig(config,groups=groups)):
    for i in range(trials):
        c += 1
        setup['config_group_num'] = n
        setup['config_num_in_group'] = i
        setup['uuid'] = uuid
        with open(r'C:/Users\DI25756\PycharmProjects\CDC\grid\configs/'+repr(n%10000)+'.txt','a') as fh:
            for var in setup:
                fh.write(var+':'+repr(setup[var])+',')
            fh.write('\n')