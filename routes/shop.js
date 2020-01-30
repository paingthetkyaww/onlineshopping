const express = require('express');
// const path = require('path');

const router = express.Router();

const productController = require('../controller/product');

// const adminData = require('./admin');

router.get('/', productController.getProducts);

module.exports = router;