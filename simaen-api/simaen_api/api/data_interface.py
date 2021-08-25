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

import pandas as pd
import sys
import copy
import time
import os
import json
import psycopg2
import psycopg2.extras
import psycopg2.sql

import simaen_api

SCALE = 100


def connect_db():
    with open(os.path.join('/opt/simaen-api/simaen_api', 'postgres.json')) as f:
        data = json.load(f)
    connection = psycopg2.connect(user=data['user'],
                                  password=data['password'],
                                  host=data['host'],
                                  port=data['port'],
                                  database=data['database'])
    return connection

def return_sql_cursor_id(cursor):
    """
    Calls Database cursor object's fetchone() function
    :param cursor: psycopg2 connection cursor object
    :return: fetchone()
    """
    one = cursor.fetchone()
    if one and len(one) >= 1:
        return one[0]
        #return cursor.fetchone()[0]
    else:
        return None

def execute(sql, params=(), return_id=False):
    # executes and commits query of passed sql
    """
    Generic function to execute a sql command, commit, and close the cursor
    :param sql:
    :return:
    """
    column_names = None
    ret = False
    if sql:
        with connect_db() as conn:
            try:
                cur = conn.cursor()
                cur.execute(sql, params)
                # if the sql statement returns an id
                if return_id:
                    ret = return_sql_cursor_id(cur)
                else:
                    ret = True

                # commit transaction
                conn.commit()
                
                # close cursor
                cur.close()
            except Exception as e:
                # dont log since raising exception, allow downstream handling
                #self.log.exception(e)
                conn.rollback()
                if cur:
                    cur.close()
                raise e

    return ret

def fetchall(sql, params=()):
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
#    print(cursor.mogrify(sql, params))
    cursor.execute(sql, params)
    records = cursor.fetchall()

    if(conn):
        cursor.close()
        conn.close()
    return records

def formatWhere(params):
    pairs = [str(key) + ' = ' + str(params[key]) for key in params.keys()]
    return ' and '.join(pairs)

def fetch_data(params, printing=False):
    where_clause = formatWhere(params)

    # it may return more than one id if p_running_app == 0
    sql = f'''
    SELECT * FROM run_data WHERE id in (SELECT id FROM parameters WHERE {where_clause}); 
    '''
    if printing:
        print(sql)
    records = fetchall(sql)

    n = len(records)
    if printing:
        print("Got %d records" % len(records))
    
    res = {}

    if n == 0:
        return res

    colnames = records[0].keys()
  
    for key in colnames:
        if key == 'run_length' or key == 'config_group_num': 
            continue # discard these

        # these should be scalars but they're arrays of length 1
        if key == 'r':
            values = [ row[key][0] for row in records ]
            res[key] = sum(values)/n # don't round off
        elif key == 'cases_prevented':
            values = [ row[key][0] for row in records ]
            res[key] = sum(values)/n
        elif key == 'id':
            values = [ row[key] for row in records ]
            # This value will be passed into fetch_fixed_params() by
            # the website.  We're relying on the fixed parameters
            # really being the same across all rows returned for these
            # parameters. You will need to check carefully if you
            # change the model inputs!
            res[key] = min(values) 
        else:
            # other keys map to a list of numbers
            lists = [ row[key] for row in records ]
            res[key] = [ sum(x)/n for x in zip(*lists) ]

    # now scale
    for key in colnames:
        if key == 'r' or key == 'id' or key == 'run_length' or key == 'config_group_num':
            continue # don't scale/round
        if key == 'cases_prevented':
            # scale scalar
            res[key] = round(res[key] * SCALE)
        else:
            # scale list
            res[key] = [ round(a * SCALE) for a in res[key] ]

    return res


def fetch_totals_no_aen(orig_params, printing=False):
    params = copy.deepcopy(orig_params)

    # take the "sub-parameters" for AEN out of the query
    params['p_running_app'] = 0
    for k in ['p_app_detects_generator', 'false_discovery_rate',
              'key_upload_requires_call', 'p_maximal_restriction_given_aen_notification']:
        if k in params.keys():
            del params[k]

    if printing:
        print(params)

    where_clause = formatWhere(params)
    sql = f'''
        SELECT infected, pos_and_quar, quar_and_not_infected FROM run_data WHERE id IN 
            (SELECT id FROM parameters WHERE {where_clause});
    '''
    if printing:
        print(sql)
    records = fetchall(sql)

    n = len(records)
    if printing:
        print("Got %d records" % len(records))

    res = {}

    if n == 0:
        return res

    colnames = records[0].keys()
  
    for key in colnames:
        # other keys map to a list of numbers
        lists = [ row[key] for row in records ]
        res[key] = sum([ sum(x)/n for x in zip(*lists) ])

        # scale scalar
        res[key] = round(res[key] * SCALE)

    return res

def fetch_fixed_params(params, printing=False):

    where_clause = formatWhere(params)
    # Pull parameters and stick them into value matching format
    sql = f'''
        SELECT * FROM parameters WHERE {where_clause} limit 1;
    '''
    if printing:
        print(sql)
    records = fetchall(sql)

    if len(records) == 0:
        return {}

    return records[0]

# used by endpoint
def fetch_and_aggregate_data(params, printing=False):
    # so we don't modify the original
    args = copy.deepcopy(params)

    res = fetch_data(params, printing)
    
    if 'p_running_app' in params.keys() and params['p_running_app'] != 0: # has AEN on
        no_aen = fetch_totals_no_aen(params, printing)
    
        total_infected = sum(res['infected'])
        total_pos_and_quar = sum(res['pos_and_quar'])
        total_false_quar = sum(res['quar_and_not_infected'])
    
        cases_prevented = no_aen['infected'] - total_infected
        isolated_due_to_en = total_pos_and_quar - no_aen['pos_and_quar']
        false_quar_due_to_en = total_false_quar - no_aen['quar_and_not_infected']
    
        if printing:
            print("res['cases_prevented'] = %d" % cases_prevented)
            print("res['isolated_due_to_en'] = %d" % isolated_due_to_en)
            print("res['false_quar_due_to_en'] = %d" % false_quar_due_to_en)

        res['cases_prevented'] = max(cases_prevented, 0)
        res['isolated_due_to_en'] = max(isolated_due_to_en, 0)
        res['false_quar_due_to_en'] = max(false_quar_due_to_en, 0)
    # otherwise, it needs to stay zero (and the above might not be due to rounding error)

    return res

def fetch_precomputed_aggregate_data(params, printing=False):
    
    pairs = [ psycopg2.sql.SQL('{} = {}').format(psycopg2.sql.Identifier(key),
                                                 psycopg2.sql.Literal(params[key])) for key in params.keys() ]

    q = psycopg2.sql.SQL('''
        SELECT * FROM aggregate_data WHERE id IN 
            (SELECT id FROM parameters WHERE {});
    ''').format(psycopg2.sql.SQL(" and ").join(pairs))

    records = fetchall(q)

    if len(records) == 0:
        return {}

    return records[0]

def precompute_aggregates():

    sql = 'truncate table aggregate_data;'
    execute(sql)

    # now find out what the set of values is for each parameter
    sql = 'select id from parameters;'
    ids = [ row['id'] for row in fetchall(sql) ]
    
    params_of_interest = ['starting_cases', 'test_delay', 'p_running_app', 
                          'p_app_detects_generator', 'false_discovery_rate', 
                          'mean_new_cases', 'mean_total_contacts', 
                          'key_upload_requires_call', 'n_contact_tracers', 
                          'p_maximal_restriction_given_ph_call', 
                          'p_maximal_restriction_given_aen_notification', 
                          'p_vaccinated', 'p_mask_given_norm']

    tmp = ", ".join(params_of_interest)

    for id in ids:
        print("Working on id %d" % id)

        sql =  '''
        SELECT {} from parameters where id = {};
        '''.format(tmp, id)

        params_with_values = fetchall(sql)[0]

        # if no AEN, take the "sub-parameters" for AEN out of the query
        if ('p_running_app' in params_with_values.keys() and 
            params_with_values['p_running_app'] == 0):

            for k in ['p_app_detects_generator', 'false_discovery_rate',
                      'key_upload_requires_call', 'p_maximal_restriction_given_aen_notification']:
                if k in params_with_values.keys():
                    del params_with_values[k]

        data = fetch_and_aggregate_data(params_with_values)

        # compensate for single id returned when "EN off" although multiple params match
        data['id'] = id

        columns = list(data.keys())

        q = psycopg2.sql.SQL('''
        insert into aggregate_data ({}) values ({});
        ''').format(psycopg2.sql.SQL(", ").join(map(psycopg2.sql.Identifier, columns)),
                    psycopg2.sql.SQL(", ").join(map(psycopg2.sql.Placeholder, columns)))
            
        execute(q, data)

