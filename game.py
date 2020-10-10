import requests
import json
from bs4 import BeautifulSoup as soup
import pandas as pd
import sys

jayson = open('jayson.json')
pf = open('platforms.json')
gr = open('genres.json')
genres = json.load(gr)
platforms = json.load(pf)
details = json.load(jayson)

page = requests.get(details['mylist'],headers={ 'User-Agent' : details['user-agent']})
soupy = soup(page.text,'html.parser')
boxes = soupy.find_all('h4',{'class':'media-heading'})

class Games:
    def __init__(self):
        self.data={
            "Name":list(),
            "Year":list(),
            "Platforms":list(),
            "Genres":list()
        }
    def insert_game(self,name,year,platforms,genres):
        self.data["Name"].append(name)
        self.data["Year"].append(year)
        self.data["Platforms"].append(platforms)
        self.data["Genres"].append(genres)
    def getgames(self):
        return self.data

games = Games()
for box in boxes:
    name = box.span.text
    year = int(box.small.text.replace('(','').replace(')','').replace(' ',''))
    listpf = []
    listgr = []

    headers = {"Client-ID": details["Client-ID"], "Authorization": details["Authorization"]}
    body = f'fields genres, platforms; where name ="{name}";'
    gameinfo = requests.post(details['games'],headers=headers,data=body)

    gamedata = json.loads(gameinfo.text)
    for platform in gamedata[0]["platforms"]:
        for p in platforms:
            if p['id']==platform:
                listpf.append(p['name'])
    for genre in gamedata[0]["genres"]:
        for g in genres:
            if g['id']==genre:
                listgr.append(g['name'])
    games.insert_game(name,year,listpf,listgr)

df = pd.DataFrame(games.getgames())
df = df.T
dfj = df.to_json()
print(str(dfj))
jayson.close()
pf.close()
gr.close()
sys.stdout.flush()