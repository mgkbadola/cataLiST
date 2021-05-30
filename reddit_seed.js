const snoowrap = require('snoowrap')
const fs = require('fs')
const join = require('path').join

let ENV
try {
    ENV = JSON.parse(fs.readFileSync('env.json').toString())
} catch (err) {
    console.log('JSON configuration file not found, using environment variables instead...')
    ENV = process.env
}

const reddit = new snoowrap({
    userAgent: ENV.userAgent,
    clientId: ENV.clientId,
    clientSecret: ENV.clientSecret,
    username: ENV.username,
    password: ENV.password
});

async function getsaved() {
    let posts = []
    let comments = []
    let data = await reddit.getMe().getSavedContent({limit: 300})
    for (let corp of data) {
        if (corp.title === undefined)
            comments.push({
                subreddit: corp.subreddit.display_name,
                nsfw: corp.over_18,
                link: corp.permalink,
                body: corp.body_html,
                post: corp.link_title
            })
        else
            posts.push({
                subreddit: corp.subreddit.display_name,
                nsfw: corp.over_18,
                link: corp.permalink,
                title: corp.title
            })
    }
    return [posts, comments]
}

getsaved().then((saved) => {
    let DIR = join(__dirname, '\\public\\assets\\')
    fs.writeFileSync(join(DIR, "posts.json"), JSON.stringify(saved[0], null, 4))
    fs.writeFileSync(join(DIR, "comments.json"), JSON.stringify(saved[1], null, 4))
})
