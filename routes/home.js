const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.route('/')
    .get((req, res) => {
        res.render('../views/home')
    })

module.exports = router;

console.log('test')