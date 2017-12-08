const express = require('express')
const router = express.Router()
const reviewsController = require('../controllers/reviews.controller')
const AuthCtrl = require('../controllers/auth.controller')

router.get('/', reviewsController.showAll)
router.get('/:id', reviewsController.getOne)
router.put('/:id', reviewsController.update)
router.post('/', reviewsController.create)
router.delete('/:id', reviewsController.destroy)


module.exports = router
