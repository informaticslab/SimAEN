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

def generateConfig(params,groups=''):
    config = {}
    for key in params:
        if type(params[key]) == type(1) or type(params[key]) == type(1.1):
            config[key] = {'vals':{key:[params[key]]},'pos':0}
        elif type(params[key]) == type([]):
            config[key] = {'vals':{key:params[key]},'pos':0}
        else:
            raise ValueError('Unrecognized element type '+str(type(params[key])))
    for group in groups:
        for i,key in enumerate(group):
            if len(config[group[0]]['vals'][group[0]]) != len(config[key]['vals'][key]):
                    raise ValueError('All elements of a group must all be the same size')
            if i > 0:
                config[group[0]]['vals'][key] = config[key]['vals'][key]
                del config[key]
    complete = 0
    while not complete:
        setup = {}
        loop = 0
        for key in config:
            for k in config[key]['vals']:
                setup[k] = config[key]['vals'][k][config[key]['pos']]
            if loop == 0:
                config[key]['pos'] = (config[key]['pos'] + 1) % len(config[key]['vals'][key])
                loop = loop+config[key]['pos']
        if loop == 0:
            complete = 1
        yield(setup)
"""
params = {'a':1,'b':[3,4],'c':[6,7,8],'d':[9,10,11]}
for config in multiConfig(params,groups=(['c','d'],)):
    print(config)
"""
