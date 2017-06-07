var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/foo', function (req, res, next) {
    res.send('{"message": "foo with delete"}')
})
router.delete('/foo', function (req, res, next) {
    res.send('{"message": "foo with delete"}')
})

router.get('/foo/bar', function (req, res, next) {
    res.send(req)
})

router.get('/foo/bar/baz', function (req, res, next) {
    res.send('{"message": "foo and bar and baz"}')
})

module.exports = router;
