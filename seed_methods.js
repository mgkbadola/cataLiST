const snoowrap = require('snoowrap')
const fs = require('fs')
const join = require('path').join
const axios = require("axios")
const rateLimit = require("axios-rate-limit")

let ENV
try {
    ENV = JSON.parse(fs.readFileSync('env.json').toString())
} catch (err) {
    console.log('JSON configuration file not found, using environment variables instead...')
    ENV = process.env
}

module.exports = {
    reddit: function () {
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
            let DIR = join(__dirname, '/public/assets/')
            fs.writeFileSync(join(DIR, "posts.json"), JSON.stringify(saved[0], null, 4))
            fs.writeFileSync(join(DIR, "comments.json"), JSON.stringify(saved[1], null, 4))
        })
    },
    games: function () {
        const Axios = rateLimit(axios.create(), {maxRequests: 8, perMilliseconds: 1000, maxRPS: 4})
        const play_ids = ENV.playids.split(' ').map(string => Number.parseInt(string))
        const watch_ids = ENV.watchids.split(' ').map(string => Number.parseInt(string))
        const headers = {"Client-ID": ENV.igdb_clientid, "Authorization": ENV.igdb_auth}

        async function forloop(worp) {
            let arr
            let obj = []
            if (worp === 'watch') {
                arr = watch_ids
            } else {
                arr = play_ids
            }
            for (let id of arr) {
                await Axios.post(
                    process.env.igdb,
                    process.env.post_data.replace(/\|/g, ';').replace(/ID/, id),
                    {
                        headers: headers
                    }).then((response) => {
                    let object = response.data[0];
                    let platforms
                    try {
                        platforms = object["platforms"].map(platform => platform["name"])
                    } catch (err) {
                        platforms = []
                    }
                    let genres
                    try {
                        genres = object["genres"].map(genre => genre["name"])
                    } catch (err) {
                        genres = []
                    }
                    let year
                    year = new Date(object["first_release_date"] * 1000).getFullYear().toString(10)
                    if (year === "NaN")
                        year = ""
                    let name = object["name"]
                    obj.push({name: name, year: year, genres: genres, platforms: platforms})
                }).catch(reason => {
                    console.log(reason)
                })
            }
            return obj
        }

        async function json() {
            let DIR = join(__dirname, '/public/assets/')
            let arr = await forloop("watch")
            fs.writeFileSync(join(DIR, "watched.json"), JSON.stringify(arr, null, 4))
            arr = await forloop("play")
            fs.writeFileSync(join(DIR, "played.json"), JSON.stringify(arr, null, 4))
        }

        json()
    },
    sf: function () {
        const Axios = rateLimit(axios.create(), {maxRequests: 8, perMilliseconds: 1000, maxRPS: 5})
        const showids = ENV.showids.split(' ')
        const filmids = ENV.filmids.split(' ')

        async function forloop(fors) {
            let arr
            let obj = []
            if (fors === 'film') {
                arr = filmids
            } else {
                arr = showids
            }
            for (let id of arr) {
                const options = {
                    method: 'GET',
                    url: ENV.imdb,
                    params: {tconst: id, currentCountry: 'US'},
                    headers: {
                        'x-rapidapi-key': ENV.api_key,
                        'x-rapidapi-host': ENV.api_host
                    }
                }
                let response = await Axios.request(options)
                let object = response.data;
                let genres
                try {
                    genres = object["genres"]
                } catch (err) {
                    genres = []
                }
                let year
                try {
                    year = object["title"]["year"].toString()
                } catch (err) {
                    year = ""
                }
                let name = object["title"]["title"]
                obj.push({name: name, year: year, genres: genres})
            }
            return await new Promise((resolve, reject) => {
                resolve(obj)
            })
        }

        async function json() {
            let DIR = join(__dirname, '/public/assets/')
            forloop("film").then((arr) => {
                fs.writeFileSync(join(DIR, "films.json"), JSON.stringify(arr, null, 4))
            })
            forloop("show").then((arr) => {
                fs.writeFileSync(join(DIR, "tv_shows.json"), JSON.stringify(arr, null, 4))
            })
        }

        json()
    }
}