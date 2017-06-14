/**
 * Created by henryjohnson on 6/13/17.
 */
const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/cs591_hw2')
const db = mongoose.connection
db.once('open', function () {
    console.log('Connection successful.')
})
const Schema = mongoose.Schema
const stringSchema = new mongoose.Schema({
    string: String,
    size: Number
})

const stg = mongoose.model('stg', stringSchema)

//Amazing lead-in function that takes the string from our params and checks to see if it is in the database stgs.
let findByString = function (checkString) {
    return new Promise(function (resolve, reject) {
        stg.find({string: checkString}, function (err, results) {
            if (results.length > 0) {
                resolve({found: results})
            }
            else {
                reject({found: false})
            }
        })
    })
}

router.param('string', function (req, res, next, value) {
    req.params.string = value
    req.query.size = value.length
    next()
})


//GET Fetch all users
router.get('/', function (req, res, next) {
    stg.find({}, function (err, results) {
        res.json(results);
    })

})

//GET Fetch single user, match /users/db/Frank
router.get('/:string', function (req, res, next) {
    findByString(req.params.string)
        .then(function (status) {
            res.json(status)
        })
        .catch(function (status) {
            let theString = req.params.string;
            let theSize = req.query.size;
            const aString = new stg({string: theString, size: theSize})
            aString.save(function(err) {
                if (err) {res.send(err)}
                //send back the new person
                else {res.send (aString)}
            })
        })
})

router.post('/', function(req, res, next) {
    res.json({message: 'String is empty; please provide a string.'});
})

router.post('/:string', function(req, res, next) {
    findByString(req.params.string)
        .then(function (status) {
            res.json(status)
        })
        .catch(function (status) {
            let theString = req.params.string;
            let theSize = req.query.size;
            const aString = new stg({string: theString, size: theSize})
            aString.save(function(err) {
                if (err) {res.send(err)}
                else {res.send (aString)}
            })
        })
})

router.delete('/:string', function (req, res, next) {
    findByString(req.params.string)
        .then(function (status) {
            stg.remove(req.params.string, function (err, result) {
                if(err) {res.json({message: 'Error deleting'});}
                else {res.json({message: 'success'});}
            })
        })
        .catch(function (status) {
            res.json({message: 'String not found.'});
        })
});

module.exports = router;