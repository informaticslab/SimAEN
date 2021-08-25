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

import json
import os

from flask import Flask, send_from_directory, request
from flask_restx import Api
from flask_cors import CORS

import simaen_api

from simaen_api.api import endpoints, data_interface
   
ROOT_CONFIG = 'simaen_api.configurations'
CONFIG = dict(debug='%s.DevelopmentConfig'%(ROOT_CONFIG),
              live='%s.ProductionConfig'%(ROOT_CONFIG))    


app = Flask(__name__)

CORS(app, supports_credentials=True)

api = Api(app)
api.add_namespace(endpoints.ns)


@app.route('/')
def index():
    return "SIMAEN REST API"   

def start_server(args):
    # load this conf object for development mode
    cfg = CONFIG[args.config]
    app.config.from_object(cfg)    
    
    # sess.init_app(app)
    app.run(host=args.host, port=args.port, threaded=True)
    
    
def aggregate(args):
    data_interface.precompute_aggregates()
    #data_interface.check_aggregates()
    
    
