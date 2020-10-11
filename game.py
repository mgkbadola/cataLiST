import json
import pandas as pd
import sys

jayson = open('jayson.json')
details = json.load(jayson)

df = pd.read_csv(details['list'])
df = df.T
dfj = df.to_json()
print(str(dfj))

sys.stdout.flush()