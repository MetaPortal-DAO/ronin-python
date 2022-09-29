from connector import query_mongo
from dynamo_utils import set_default_session

WETH_STRING="0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"

table = set_default_session("WETH")

# 1st. fine the two blocks that define the relevant timeframes 

# 2nd. cache blocks in json key: month, value: block 

# 3rd. loop through all block nums between two block numbers and put into pandas dataframe 
# loop through those depositing to WETH treasury in the query not in scan 
table.query


# 4th. 