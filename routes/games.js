var express = require('express');
var router = express.Router();

const spawn = require("child_process").spawn;
router.get('/', function(req, res, next) {
    var prog = spawn('python3',['game.py'])
    prog.stdout.on('data', function (data){
        const games = JSON.parse(data);
        res.render('games', {games, title: "Games"})
    });
});

module.exports = router;