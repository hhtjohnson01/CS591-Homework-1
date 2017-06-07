var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('hw1', { title: 'Homework 1' });
});

router.param('string', function (req, res, next, value) {
    req.params.string = value
    req.query.size = value.length
    next()
})

router.get('/:string', function(req, res, next) {
    let theString = req.params.string;
    let theSize = req.query.size;
    req.body.string = theString
    req.body.size = theSize
    console.log(req.body)
    res.json(req.body)
});

router.post('/:string', function (req, res, next) {
    req.body.string = req.params.string;
    req.body.size = req.query.size;
    console.log(req.body)
    res.json(req.body)
})

module.exports = router;
