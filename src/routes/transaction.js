const express = require('express');

const router = express.Router();
const transactionController = require('../controllers/transcationController');

router.post('/fees', transactionController.fees);

router.post('/compute-transaction-fee', transactionController.transaction);

module.exports = router;