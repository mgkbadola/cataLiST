import praw
import sys
import pandas as pd
import json

jayson = open('jayson.json')
details = json.load(jayson)

reddit = praw.Reddit(client_id=details['id'],
                    client_secret=details['secret'],
                    user_agent=details['agent'],
                    username=details['user'],
                    password=details['pass'])

jayson.close()

class Data:
    def __init__(self):
        self.data={
            'Name': list(),
            'Subreddit':list(),
            'Link':list()
        }    
    def appenddit(self,name,sub,link):
        self.data['Name'].append(name)
        self.data['Subreddit'].append(sub)
        self.data['Link'].append('https://reddit.com'+link)
    def fetcheddit(self):
        return self.data
get_data = Data()   

saved = reddit.user.me().saved(limit=300)
for save in saved:
    if type(save) == praw.models.Submission:
        get_data.appenddit(save.title,save.subreddit.display_name,save.permalink)

df = pd.DataFrame(get_data.fetcheddit())
df = df.T
dfj = df.to_json()
print(str(dfj))
sys.stdout.flush()
