var express = require('express');
var router = express.Router();
var db = require('../db')

router.get('/', function (req, res, next) {
    db.getalldata('sub').then((subreddits) =>
        db.getalldata('r').then((reddit) =>
            res.render('saveddit', {subreddits, reddit, title: "cataLIST - Saved Reddit Posts/Comments"}
            )
        )
    ).catch((err) => {
        res.send(err)
    })
});
router.post('/', function (req, res, next) {
    var reddit = req.body
    db.insert_reddit(reddit.name, reddit.sub, reddit.link)
    db.insertsingle('subreddits', reddit.sub)
    res.redirect('saveddit')
});

module.exports = router;