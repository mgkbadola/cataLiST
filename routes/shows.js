var express = require('express');
var router = express.Router();
var db = require('../db')

router.get('/', function(req, res, next) {
    db.getalldata('s').then((shows)=>{
        db.getalldata('l').then((languages)=>{
            res.render('shows', {shows, languages, title: "cataLIST - Shows"});
        })
    })
        .catch((err)=>{
            res.send(err)
        })
});
router.post('/', function(req, res, next) {
    var show=req.body
    db.insertshow(show.name,show.type,show.language,show.year,show.watched)
    db.insertsingle('languages', show.language).then(()=>
        res.redirect('shows'))
});
module.exports = router;