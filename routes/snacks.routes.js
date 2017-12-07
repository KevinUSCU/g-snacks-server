const express = require('express')
const router = express.Router()
const snacksController = require('../controllers/snacks.controller')

router.get('/', snacksController.showAll)
router.get('/:id', snacksController.getOne)
router.get('/:id/reviews', snacksController.getOneWithReviews)
router.post('/', snacksController.create)
router.put('/:id', snacksController.update)
router.delete('/:id', snacksController.destroy)

module.exports = router
