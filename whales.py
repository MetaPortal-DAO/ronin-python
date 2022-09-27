from connector import query_mongo
from dynamo_utils import set_default_session

WETH_STRING="0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"

table = set_default_session("WETH")
table.query