import pymongo 
from pymongo import MongoClient
from dotenv import load_dotenv
import pandas as pd
import os
load_dotenv()

username = os.getenv("MONGO_USERNAME")
password = os.getenv("MONGO_PASSWORD")

cluster = pymongo.MongoClient(f"mongodb+srv://${username}:${password}@cluster0.2lmaniy.mongodb.net/?retryWrites=true&w=majority")
db = cluster["ronin-indexer"]

collection = db["0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"]

# unix timestamp to mongodb months
for month in months: 
    pd.DataFrame(collection.aggregate([
        {
            "$redact": {
                "$cond": [
                    # put dates here for each month 
                    { "$gt": [ "$Grade1", "$Grade2" ] },
                    "$$KEEP",
                    "$$PRUNE"
                ]
            }
        }
    ]))

results = collection.find({"from": "7543d33a8dcb325a58921e237d49ff2829b50339"})

for result in results:
    print(result["_id"])