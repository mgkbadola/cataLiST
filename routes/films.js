const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require('path')

router.get('/', function (req, res) {
    const DIR = path.join(path.dirname(__dirname), '\\public\\assets\\')
    fs.readFile(path.join(DIR, 'films.json'), function (err, data) {
        let films = JSON.parse(data.toString())
        res.render('template', {films, title: "Films", header: "fLiST"})
    })
});

module.exports = router;