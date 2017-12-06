const express = require('express')
const router = express.Router()
const reviewsController = require('../controllers/reviews.controller')

router.get('/', reviewsController.showAll)
router.get('/:id', reviewsController.getOne)
router.put('/:id', reviewsController.update)
router.delete('/:id', reviewsController.destroy)


module.exports = router
