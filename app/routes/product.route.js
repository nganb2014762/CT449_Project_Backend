const express = require("express");
const books = require("../controllers/product.controller");

const router = express.Router();

router.route('/add')
    .post(books.create);

router.route('/')
    .get(books.findAll)
    .post(books.findOne);

router.route('/:id')
    .get(books.findById)
    .put(books.update)
    .delete(books.delete);

module.exports = router;