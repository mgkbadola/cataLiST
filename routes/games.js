const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', function (req, res) {
    const DIR = path.join(path.dirname(__dirname), '\\public\\assets\\')
    fs.readFile(path.join(DIR, 'watched.json'), function (err, data) {
        let watch = JSON.parse(data.toString())
        fs.readFile(path.join(DIR, 'played.json'), function (err2, data2) {
            let play = JSON.parse(data2.toString())
            res.render('template', {play, watch, title: "Played and Watched Games", header: "gLiST"})
        })
    })
});

module.exports = router;