from multiprocessing.sharedctypes import Value
import awswrangler as wr
import boto3
import os
import json

ALLOWED_TABLES = []

def set_default_session(table):
    if table not in ALLOWED_TABLES:
        raise Exception(ValueError("table not among supported erc20s"))
    dynamodb = boto3.resource('dynamodb')
    try: 
        table = dynamodb.Table(table)
    except:
        raise Exception(KeyError("table does not exist in dynamo"))
    return table


