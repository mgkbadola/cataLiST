const axios = require("axios")
const fs = require("fs");
const rateLimit = require("axios-rate-limit")
const join = require('path').join

let ENV
try {
    ENV = JSON.parse(fs.readFileSync('env.json').toString())
} catch (err) {
    console.log('JSON configuration file not found, using environment variables instead...')
    ENV = process.env
}

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
    let DIR = join(__dirname, '\\public\\assets\\')
    let arr = await forloop("watch")
    fs.writeFileSync(join(DIR, "watched.json"), JSON.stringify(arr, null, 4))
    arr = await forloop("play")
    fs.writeFileSync(join(DIR, "played.json"), JSON.stringify(arr, null, 4))
}

json()