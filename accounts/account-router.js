const express = require('express');
const router = express.Router();
const dataBase = require('../data/dbConfig');

//get list of all account ----------DONE-----------------
router.get('/', (req, res) => {
    dataBase.select('*').from('accounts').then(accounts => {
        res.status(200).json({ data: accounts })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    });
});

//get account with given id ----------------DONE-------------
router.get('/:id', (req, res) => {
    dataBase('accounts').where({ id: req.params.id })
        .first()                                        // need this if you dont want to see empty array with invalid id
        .then(account => {
            if (account) {
                res.status(200).json({ data: account })
            } else {
                res.status(404).json({ message: 'no posts by that id' })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        });
});

//posting new account -----------DONE---------------------
router.post('/', (req, res) => {
    const account = req.body;
    if (isValidAccount(account)) {
        dataBase('accounts').insert(account, 'id').then(ids => {
            res.status(201).json({
                data: ids
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            })
        })
    } else {
        res.status(400).json({ message: 'please provide name and budget' })
    }
})

//change account with given id -----------------DONE------------------
router.put('/:id', (req, res) => {
    const changes = req.body;
    if (isValidAccount(changes)) {
        dataBase('accounts').where({ id: req.params.id }).update(changes).then(count => {
            if (count) {
                res.status(200).json({ data: count })
            } else {
                res.status(404).json({ message: 'record not found by that id' })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            })
        })
    } else {
        res.status(400).json({message: 'please provide name and budget for the account'})
    }
})

//delete account with given id --------------DONE----------------------
router.delete('/:id',(req,res)=>{
    dataBase('accounts').where({ id: req.params.id }).del().then(count => {
        if (count) {
            res.status(200).json({ data: count })
        } else {
            res.status(404).json({ message: 'record not found by that id' })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    })
})


//testing to see if account is valid-----------DONE-------------
function isValidAccount(account) {
    return Boolean(account.name && account.budget);
}

module.exports = router;