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

now = datetime.now()
three_months_ago = now + timedelta(days=90)

cluster = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@cluster0.2lmaniy.mongodb.net/?retryWrites=true&w=majority")
db = cluster["ronin-indexer"]

collection = db["0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"]

# unix timestamp to mongodb months
for dt in rrule.rrule(rrule.MONTHLY, dtstart=now, until=three_months_ago):
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
    print(df)


