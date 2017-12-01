const express = require('express')
const router = express.Router()
const UsersCtrl = require('../controllers/users.controller')

router.post('/login', UsersCtrl.login)
router.post('/signup', UsersCtrl.signup)

router.get('/', UsersCtrl.index)
router.get('/:id', UsersCtrl.showOne)
router.post('/', UsersCtrl.create)
router.put('/:id', UsersCtrl.update)
router.delete('/:id', UsersCtrl.destroy)

module.exports = router