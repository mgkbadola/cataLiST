const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const DIR = path.join(path.dirname(__dirname), '\\public\\assets\\')
router.get('/', function (req, res) {
    res.render('template', {
        Url: '',
        title: "Saved Reddit Posts and Comments",
        header: "rLiST"
    })
});
router.get('/posts', (req, res) => {
    fs.readFile(path.join(DIR, 'posts.json'), function (err2, data2) {
        let posts = JSON.parse(data2.toString())
        res.render('template', {
            posts,
            Url: req.url,
            title: "Saved Posts",
            header: "rLiST"
        })
    })
})
router.get('/comments', (req, res) => {
    fs.readFile(path.join(DIR, 'comments.json'), function (err, data) {
        let comments = JSON.parse(data.toString())
        res.render('template', {
            comments,
            Url: req.url,
            title: "Saved Comments",
            header: "rLiST"
        })
    })
})

module.exports = router;