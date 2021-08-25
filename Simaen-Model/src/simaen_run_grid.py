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
import uuid
import sys
import json
import WorkflowModel as simaen
import readConfig
from multiConfig import generateConfig
import uuid
#from processTree import process
#from DBProcess import process
from webUIprocess import process
from random import random

values = []
with open(sys.argv[1],'r') as inputs:
    for line in inputs:
        line = line.rstrip('\n')
        infile, outfile = line.split(' ')
        with open(infile,'r') as configs:
            for s in configs:
                setup = {}
                setup['uuid'] = str(uuid.uuid4())
                params = s.split(',')
                for param in params:
                    if ':' in param:
                        k,v = param.split(':')
                        try:
                            setup[k] = float(v)
                        except:
                            pass
                setup['max_num_current_cases'] = 1500000
                setup['end_day'] = 30

                db = simaen.main(config=setup, verbose=False, retain_db=False)
                v = process(db)
                db.close()
                values.append({'data': v, 'config': setup})
with open(outfile,'a') as out:
    json.dump(values,out)