var express = require('express');
var router = express.Router();
var db = require('../db')

router.get('/', function(req, res, next) {
    db.getalldata('l').then((languages) => {
        db.getalldata('f').then((films) => {
            res.render('films', {films, languages, title: "Films"});
        })
            .catch((err) => {
                res.send(err)
            })
    })
});
router.post('/', function(req, res, next) {
    var film=req.body
    db.insertfilm(film.name, film.year, film.language, film.series, film.watched).then(() =>
        res.redirect('films'))
});
module.exports = router;