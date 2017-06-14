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


//Get and display everything in the database.
router.get('/', function (req, res, next) {
    stg.find({}, function (err, results) {
        res.json(results);
    })

})

//Get and display (and, if we have to, create) a given string in  the database.
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

//You can't post nothing to the database!
router.post('/', function(req, res, next) {
    res.json({message: 'String is empty; please provide a string.'});
})

//Posting into the database, checking and returning stuff that's already in the db, otherwise we create it.
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

//Delete the string, provided it is in the database, otherwise we send the message that the string is not found (because it's not in the db).
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