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

from simaen_api import simaen_api

import argparse

CONFIG_CHOICES = ['debug', 'live']

def main():
    """
    TODO: argparse options here, pass them to start_server
    """
    parser = argparse.ArgumentParser(description='SIMAEN REST API', 
                                     prefix_chars='-')
    
    parser.add_argument('-v', '--verbose', required=False, action='store_true',
                        help='display information on availble arguments')
    
    parser.add_argument('-o', '--host', required=False, default='127.0.0.1',
                        help='select hostname or IP address for the web application')
    
    parser.add_argument('-p', '--port', type=int, required=False, default=1919,
                        help='select port for the web application')
    
    parser.add_argument('-cfg', '--configuration', dest='config', required=False, 
                        choices=CONFIG_CHOICES, default='live',
                        help='set the appropriate configuration for the web application')            

    parser.add_argument('-agg', '--aggregate_runs', action='store_true', required=False, default=False,
                        help='build tables of precomputed aggregates (throws out old ones)')
        
    args = parser.parse_args()        

    if args.aggregate_runs:
        simaen_api.aggregate(args)
    else:
        simaen_api.start_server(args)
    

if __name__ == "__main__":
    main()
