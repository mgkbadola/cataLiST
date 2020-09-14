var express = require('express');
var router = express.Router();
var db = require('../db')

router.get('/', function(req, res, next) {
    db.getalldata('g').then((games)=>
        db.getalldata('gg').then((game_genres)=>
            db.getalldata('p').then((platforms)=>
                res.render('games', {games, game_genres,platforms, title: "cataLIST - Games"}
                )
            )
        )
    ).catch((err)=>{
            res.send(err)
        })
});
router.post('/', function(req, res, next) {
    var game = req.body
    db.insertgame(game.name, game.year, game.platform, game.series, game.played)
    db.insertsingle('platforms',game.platform)
    if(game.genre.size!==1)
        for (x of game.genre)
            db.insertgenregame(game.name, x)
    else
        db.insertgenregame(game.name, game.genre)
    res.redirect('games')
});

module.exports = router;