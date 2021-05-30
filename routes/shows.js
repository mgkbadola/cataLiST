const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require('path');

router.get('/', function (req, res) {
    const DIR = path.join(path.dirname(__dirname), '\\public\\assets\\')
    fs.readFile(path.join(DIR, 'tv_shows.json'), function (err, data) {
        let shows = JSON.parse(data.toString())
        res.render('template', {shows, title: "TV Shows", header: "sLiST"})
    })
});

module.exports = router;