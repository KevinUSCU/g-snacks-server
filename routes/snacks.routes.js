const express = require('express')
const router = express.Router()
const snacksController = require('../controllers/snacks.controller')
const AuthCtrl = require('../controllers/auth.controller')

router.get('/', snacksController.showAll)
router.get('/:id', snacksController.getOne)
router.get('/:id/reviews', snacksController.getOneWithReviews)
router.post('/', AuthCtrl.isAdmin, snacksController.create)
router.put('/:id', AuthCtrl.isAdmin, snacksController.update)
router.delete('/:id', AuthCtrl.isAdmin, snacksController.destroy)

module.exports = router
