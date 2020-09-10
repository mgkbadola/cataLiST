var express = require('express');
var router = express.Router();
var db = require('../db')

router.get('/', function(req, res, next) {
    db.getalldata('f').then((films)=>{
        res.render('films', {films,title: "cataLIST - Films"});
    })
        .catch((err)=>{
            res.send(err)
        })
});
router.post('/', function(req, res, next) {
    var film=req.body
    console.log('request body: '+film)
    db.insertmovie(film.name,film.year,film.region,film.watched).then(()=>
        res.redirect('films'))
});
module.exports = router;