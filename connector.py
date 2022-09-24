import pymongo 
from pymongo import MongoClient
from dotenv import load_dotenv
import pandas as pd
import os
load_dotenv()
from dateutil import rrule
from datetime import datetime, timedelta
import time

username = os.getenv("MONGO_USERNAME")
password = os.getenv("MONGO_PASSWORD")

now = datetime.utcnow()
one_month_ago = now - timedelta(days=30)
timeframe = datetime.utcnow()

cluster = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@cluster0.2lmaniy.mongodb.net/?retryWrites=true&w=majority")
db = cluster["ronin-indexer"]

collection = db["0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"]

def query_mongo(first_time):
    dflist = []
    # any better ways to iterate over months?
    if (first_time):
        timeframe = now - timedelta(days=120)
    else: 
        timeframe = one_month_ago
        
    for dt in rrule.rrule(rrule.MONTHLY, dtstart=timeframe, until=now):
        df = pd.DataFrame(collection.find({'ts':{'$gte':timeframe, '$lt':now}}))
        if first_time == True: 
            dflist.append(dflist)
        else: 
            return df
    
    return dflist


