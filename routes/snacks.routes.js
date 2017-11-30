const express = require('express')
const router = express.Router()
const snacksController = require('../controllers/snacks.controller')

router.get('/', snacksController.showAll)


module.exports = router
