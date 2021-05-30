const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require('path')
const DIR = path.join(path.dirname(__dirname), '\\public\\assets\\')

router.get('/', function (req, res) {
    res.render('template', {
        title: "Films and TV Shows",
        header: 'fsLiST',
        Url: req.url
    })
});
router.get('/films', function (req, res) {
    fs.readFile(path.join(DIR, 'films.json'), function (err, data) {
        let films = JSON.parse(data.toString())
        res.render('template', {
            films,
            title: "Films",
            header: "fsLiST",
            Url: req.url
        })
    })
});
router.get('/shows', function (req, res) {
    fs.readFile(path.join(DIR, 'tv_shows.json'), function (err, data) {
        let shows = JSON.parse(data.toString())
        res.render('template', {
            shows,
            title: "TV Shows",
            header: "fsLiST",
            Url: req.url
        })
    })
});

module.exports = router;