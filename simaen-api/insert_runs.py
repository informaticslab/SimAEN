#!/usr/bin/env python3

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


import sys
import getpass
import argparse
import psycopg2
import psycopg2.extras
import traceback
import json
from os import listdir
from os.path import isfile, join
from typing import Any, Dict, List
from tqdm.auto import tqdm

parser = argparse.ArgumentParser(
    description='Import CDC SimAEN data into PostgreSQL',
    formatter_class=argparse.ArgumentDefaultsHelpFormatter)
parser.add_argument("directory", help="Directory to read simaen results data from", default='CWD')
parser.add_argument("--noext", help="Do not filter by file extension (ignore --ext) ", action='store_true')
parser.add_argument("--ext", help="File extension to process", default='.json')
parser.add_argument("--host", help="Hostname of database server", default='localhost')
parser.add_argument("--database", help="Hostname of database server", default='simaen')
parser.add_argument("--port", help="Port of database server", default=5432)
parser.add_argument("--user", help="Username of database server", default='postgres')

def insert_parameters(connection, params: List[Dict[str, Any]]) -> None:
    keys = list(params[0])
    with connection.cursor() as cursor:
        psycopg2.extras.execute_values(cursor, f"""
            INSERT INTO parameters ({','.join(keys)}) VALUES %s ON CONFLICT DO NOTHING;
        """, (list(param.values()) for param in params))
    conn.commit()

def insert_runs(connection, runs: List[Dict[str, Any]]) -> None:
    keys = list(runs[0])
    with connection.cursor() as cursor:
        psycopg2.extras.execute_values(cursor, f"""
            INSERT INTO run_data ({','.join(keys)}) VALUES %s;
        """, (list(run.values()) for run in runs))
    conn.commit()


args = parser.parse_args()
path = args.directory

passwd = getpass.getpass(prompt='PostgreSQL Password: ')

conn = psycopg2.connect(
    host=args.host,
    database=args.database,
    port=args.port,
    user=args.user,
    password=passwd
)


tqdm.write(f'Reading files from directory: {path}')
onlyfiles = [join(path, f) for f in listdir(path) if isfile(join(path, f))]
if len(onlyfiles) == 0:
    print('No files found')
    sys.exit(1)

if not args.noext:
    onlyfiles = list(filter(lambda k: k.endswith(args.ext), onlyfiles))

if len(onlyfiles) == 0:
    print(f'No files found matching extension: {args.ext}')
    sys.exit(1)

onlyfiles.sort()
tqdm.write(f'Found {len(onlyfiles)} files')
fileCount = 0
runCount = 0
for f in tqdm(onlyfiles, desc='Loading SimAEN data', unit='files'):
    params = []
    runs = []
    # read file contents, including multiple runs / configs
    with open(f) as fh:
        data = json.load(fh)

    # add each file entry to our lists
    for datum in data:
        param = datum.get('config')
        run = datum.get('data')

        # add unique key to both sets
        uniqKey = param.get('config_group_num')
        param['id'] = uniqKey
        run['id'] = uniqKey
        
        # cleanup params we don't need
        del param['config_group_num']
        del param['config_num_in_group']
        del param['uuid']

        runs.append(run)
        params.append(param)

    # insert a file worth of records at a time
    try:
        insert_parameters(conn, params)
        insert_runs(conn, runs)
    except Exception as e:
        traceback.print_exc()
        print(f)

    # track / report progress
    fileCount += 1
    runCount += len(runs)
    tqdm.write(f'File {f} ({fileCount} / {len(onlyfiles)}): Loaded {len(runs)} runs')

print(f'Loaded {runCount} runs from {fileCount} files total')

conn.close()
