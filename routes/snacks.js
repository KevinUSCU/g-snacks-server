const express = require('express')
const router = express.Router()
const snacksController = require('../controllers/snacks.controller')

router.get('/snacks', snacksController.showAll)
router.get('/snacks/:id', snacksController.getOne)


module.exports = router
