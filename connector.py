import pymongo 
from pymongo import MongoClient
from dotenv import load_dotenv
import pandas as pd
import os
load_dotenv()
from dateutil import rrule
from datetime import datetime, timedelta
import time

first_time = True

username = os.getenv("MONGO_USERNAME")
password = os.getenv("MONGO_PASSWORD")

now = datetime.now()
one_month_ago = now - timedelta(days=30)
timeframe = datetime.now()

cluster = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@cluster0.2lmaniy.mongodb.net/?retryWrites=true&w=majority")
db = cluster["ronin-indexer"]

collection = db["0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"]

dflist = []

# any better ways to iterate over months?
if (first_time):
    timeframe = now - timedelta(days=120)
else: 
    timeframe = one_month_ago
    
for dt in rrule.rrule(rrule.MONTHLY, dtstart=now, until=timeframe):
    unixtime = time.mktime(dt.timetuple())
    unixtime1 = time.mktime((dt+timedelta(days=30)).timetuple())
    df = pd.DataFrame(collection.aggregate([
            {
                "$redact": {
                    "$cond": [
                        # put dates here for each month 
                        { "$gt": [ f"{unixtime}", f"{unixtime1}" ] },
                        "$$KEEP",
                        "$$PRUNE"
                    ]
                }
            }
        ]))
    dflist.append(dflist)

