import pymongo 
from pymongo import MongoClient
from dotenv import dotenv_values
config = dotenv_values(".env")

cluster = pymongo.MongoClient("mongodb+srv://<username>:<password>@cluster0.2lmaniy.mongodb.net/?retryWrites=true&w=majority")
db = cluster.test
