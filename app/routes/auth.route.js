const express = require("express");
const auth = require("../controllers/auth.controller");

const router = express.Router();

router.route('/login')
    .post(auth.findByEmailAndPassword);

router.route('/register')
    .post(auth.register);

router.route('/:id')
    .get(auth.findById)
    .put(auth.update);

router.route('/')
    .get(auth.findAll);

module.exports = router;