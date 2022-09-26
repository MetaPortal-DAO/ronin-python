import awswrangler as wr
import boto3
import os
import json

def set_default_session():
    boto3.setup_default_session(aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'), aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'), region_name='us-east-1')
    

def check_database_table(database, table):
    if wr.catalog.does_table_exist(database, table) == False:
    
        #exception if exists
        try:
            wr.timestream.create_database(database)
        except:
            pass
        
        client = boto3.client('timestream-write')
        
        client.create_table(DatabaseName=database,
            TableName=table,
            RetentionProperties={
                'MemoryStoreRetentionPeriodInHours': 48,
                'MagneticStoreRetentionPeriodInDays': 9999
            },
            MagneticStoreWriteProperties={
                'EnableMagneticStoreWrites': True
            }
        )
