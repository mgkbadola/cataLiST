const axios = require("axios");
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

const Axios = rateLimit(axios.create(), {maxRequests: 8, perMilliseconds: 1000, maxRPS: 5})
const showids = ENV.showids.split(' ')
const filmids = []

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
    let DIR = join(__dirname, '\\public\\assets\\')
    forloop("film").then((arr) => {
        fs.writeFileSync(join(DIR, "films.json"), JSON.stringify(arr, null, 4))
    })
    forloop("show").then((arr) => {
        fs.writeFileSync(join(DIR, "tv_shows.json"), JSON.stringify(arr, null, 4))
    })
}

json()