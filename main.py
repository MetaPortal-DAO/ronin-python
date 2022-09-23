import pymongo 
from pymongo import MongoClient
from dotenv import load_dotenv
import pandas as pd
import os
load_dotenv()

username = os.getenv("MONGO_USERNAME")
password = os.getenv("MONGO_PASSWORD")

cluster = pymongo.MongoClient(f"mongodb+srv://${username}:${password}@cluster0.2lmaniy.mongodb.net/?retryWrites=true&w=majority")
db = cluster.test
