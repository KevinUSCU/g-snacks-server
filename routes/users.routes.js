const express = require('express')
const router = express.Router()
const UsersCtrl = require('../controllers/users.controller')

router.post('/login', UsersCtrl.login)
router.post('/signup', UsersCtrl.create) // new users are only created through signup
router.post('/promote/:id', UsersCtrl.changeRole)

router.get('/', UsersCtrl.index)
router.get('/:id', UsersCtrl.showOne)
router.put('/:id', UsersCtrl.update)
router.delete('/:id', UsersCtrl.destroy)

module.exports = router