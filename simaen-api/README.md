DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

This material is based upon work supported under Air Force Contract No. FA8702-15-D-0001.
Any opinions,findings, conclusions or recommendations expressed in this material are those
of the author(s) and do not necessarily reflect the views of the Centers for Disease Control.

(c) 2021 Massachusetts Institute of Technology.

The software/firmware is provided to you on an As-Is basis

Delivered to the U.S. Government with Unlimited Rights, as defined in DFARS Part 252.227-7013
or 7014 (Feb 2014). Notwithstanding any copyright notice, U.S. Government rights in this work
are defined by DFARS 252.227-7013 or DFARS 252.227-7014 as detailed above. Use of this work
other than as specifically authorized by the U.S. Government may violate any copyrights that
exist in this work.

Copyright (c) 2021 Massachusetts Institute of Technology
SPDX short identifier: MIT

Developed as part of: SimAEN, 2021

# simaen-api

**Raw Data Upload**
Unzip the SimAEN model results and move into a co-located directory with the `insert_runs.py` script on the simAEN API file. Unzip the archive and execute `python3 insert_runs.py`. The script will pickup all `*.out` files and insert the runs into the database tables: parameters, and run_data.

Application Program Interface (API) for `SimAEN`.

Version: `v1.0`

Supports Python >= 3.6

Installing
----------

**Backend Installation**

Clone the repository in your desired path:
    
    $ https://YOUR.SERVERNAME.HERE/CDC-Simaen/simaen-api.git
    
Install `simaen-api` via `pip` for use.

This will install all of its required dependencies and create a binary executable, `simaen`.

Naviage to path containing `setup.py` and run:

    $ pip install -e .

    
User Guide
----------

For top-level use:

    $ simaen

This will start a server in a designated `host` and `port`. Currently, the default server will start in localhost `127.0.0.1`, port `1919`.

In your browser, go to:
    
    http://127.0.0.1:1919/
 
You can specify the host and port by running:
    
    $ simaen --host <string> --port <int>

or for development work,

    $ simaen -o 0.0.0.0 -p 1940 -cfg debug
    
