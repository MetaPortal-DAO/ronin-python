from connector import query_mongo

df = query_mongo(False)
df.value = df.value.apply(int, base=16)

# get WETH transfers to the treasury 
top_whales_df = df.iloc[df.to == "ronin:a99cacd1427f493a95b585a5c7989a08c86a616b"].sort_values(ascending=False).iloc[0:100]
