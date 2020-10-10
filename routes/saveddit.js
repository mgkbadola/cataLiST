var express = require('express');
var router = express.Router();

const spawn = require("child_process").spawn;
router.get('/', function (req, res, next) {
    var prog = spawn('python3',['reddit.py'])
    prog.stdout.on('data', function (data){
        const savedposts = JSON.parse(data);
        res.render('saveddit', {savedposts, title: "Saved Reddit Posts"})
    });
});

module.exports = router;