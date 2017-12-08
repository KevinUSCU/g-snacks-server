const express = require('express')
const router = express.Router()
const reviewsController = require('../controllers/reviews.controller')
const AuthCtrl = require('../controllers/auth.controller')

router.get('/', reviewsController.showAll)
router.get('/:id', reviewsController.getOne)
router.put('/:id', AuthCtrl.isOwnerOfReview, reviewsController.update)
router.post('/', AuthCtrl.isCurrent, reviewsController.create)
router.delete('/:id', AuthCtrl.isOwnerOfReview, reviewsController.destroy)


module.exports = router
