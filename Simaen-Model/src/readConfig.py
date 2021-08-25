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

#Developed as part of: SimAEN, 2020
#Authors: DI25756, JO26228, ED22162
"""
Created on Wed Sep  9 08:38:17 2020

@author: DI25756
"""
def default(file='config.txt'):
    # print('******Got here********')
    config = dict()
    f = open(file,'r')
    for line in f:
        line = line.rstrip()
        line = line.replace(' ', '')
        line = line.replace(r"config['",'');
        line = line.replace(r"']",'');
        if not not len(line):
            if line[0] != '#':
                n,v = line.split('=')
                config[n] = float(v)
    # print('**************')
    # print(config)
    f.close()
    return config