import pymongo 
from pymongo import MongoClient
from dotenv import load_dotenv
import pandas as pd
import os
load_dotenv()
from dateutil import rrule
from datetime import datetime, timedelta
import time
import pathlib

username = os.getenv("MONGO_USERNAME")
password = os.getenv("MONGO_PASSWORD")
WETH_STRING="0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"

now = datetime.utcnow()

# if we do 30 its wayyy to slow
one_month_ago = now - timedelta(days=13)
timeframe = datetime.utcnow()

cluster = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@cluster0.2lmaniy.mongodb.net/?retryWrites=true&w=majority")
db = cluster["ronin-indexer"]

collection = db[WETH_STRING]

# do we need first time as an input here?
# is it okay to just cache the past month? 
def query_mongo(first_time):
    dflist = []
    CACHE_DIR = str(pathlib.Path().resolve()) + '/cache'
    CACHE_FILE = CACHE_DIR + "/{}.csv".format(WETH_STRING)
    
    if (first_time):
        timeframe = now - timedelta(days=120)
        if not os.path.isdir(CACHE_DIR):
            os.makedirs(CACHE_DIR)
    else: 
        timeframe = one_month_ago
        if not os.path.isdir(CACHE_DIR):
            os.makedirs(CACHE_DIR)
            
    do = True

    if os.path.isfile(CACHE_FILE):
        # if it hasn't been 30 days
        if (time.time() - os.path.getmtime(CACHE_FILE)  < 24*60*60*30):
            do = False

    if do == True:
    
        for dt in rrule.rrule(rrule.MONTHLY, dtstart=timeframe, until=now):
            one_month_later = dt + timedelta(days=30)
            # depending on what num we use for one_month_ago this will go in the future which is fine
            df = pd.DataFrame(collection.find({'ts':{'$gte':dt, '$lt':(dt+timedelta(days=30))}}))
            df.to_csv(CACHE_FILE, index=None)
            if first_time == True: 
                dflist.append(dflist)
    
    return dflist

df = query_mongo(False)
