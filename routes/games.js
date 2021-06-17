const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const DIR = path.join(path.dirname(__dirname), '/public/assets/')

router.get('/', function (req, res) {
    res.render('template', {
        title: "Played and Watched Games",
        header: "gLiST",
        Url: req.Url
    })
});
router.get('/played', function (req, res) {
    fs.readFile(path.join(DIR, 'played.json'), function (err2, data2) {
        let play = JSON.parse(data2.toString())
        res.render('template', {
            play,
            title: "Played Games",
            header: "gLiST",
            Url: req.url
        })
    })
});
router.get('/watched', function (req, res) {
    fs.readFile(path.join(DIR, 'watched.json'), function (err, data) {
        let watch = JSON.parse(data.toString())
        res.render('template', {
            watch,
            title: "Watched Games",
            header: "gLiST",
            Url: req.url
        })
    })
});

module.exports = router;