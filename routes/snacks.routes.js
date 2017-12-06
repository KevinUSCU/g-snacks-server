const express = require('express')
const router = express.Router()
const snacksController = require('../controllers/snacks.controller')

router.get('/', snacksController.showAll)
<<<<<<< HEAD
router.get('/:id', snacksController.getOne)
router.post('/', snacksController.create)
=======
router.get('/:id', snacksController.getOneWithReviews)
>>>>>>> 6978ba6f8f5b749ade4ede72496218a679397b20
router.put('/:id', snacksController.update)
router.delete('/:id', snacksController.destroy)

module.exports = router
