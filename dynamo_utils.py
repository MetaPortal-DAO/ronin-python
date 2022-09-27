from multiprocessing.sharedctypes import Value
import awswrangler as wr
import boto3
import os
import json

ALLOWED_TABLES = {"SLP":"0xa8754b9fa15fc18bb59458815510e40a12cd2014",
                  "WETH":"0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"}

def set_default_session(table):
    if table not in ALLOWED_TABLES.keys():
        raise Exception(ValueError("table not among supported erc20s"))
    dynamodb = boto3.resource('dynamodb',
                          aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
                          aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                          region_name="us-east-1")
    print(dynamodb)
    try: 
        table = dynamodb.Table(table)
    except:
        raise Exception(KeyError("table does not exist in dynamo"))
    return table

set_default_session("weth")
