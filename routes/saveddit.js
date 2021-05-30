const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', function (req, res) {
    const DIR = path.join(path.dirname(__dirname), '\\public\\assets\\')
    fs.readFile(path.join(DIR, 'comments.json'), function (err, data) {
        let comments = JSON.parse(data.toString())
        fs.readFile(path.join(DIR, 'posts.json'), function (err2, data2) {
            let posts = JSON.parse(data2.toString())
            res.render('template', {
                posts, comments,
                title: "Saved Reddit Posts and Comments",
                header: "rLiST"
            })
        })
    })
});

module.exports = router;