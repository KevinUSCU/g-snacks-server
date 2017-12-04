const express = require('express')
const router = express.Router()
const UsersCtrl = require('../controllers/users.controller')

// Authentication
router.post('/signup', UsersCtrl.create) // new users are only created through signup
router.post('/login', UsersCtrl.login)

// Edit user
// Change user profile
router.put('/:id', UsersCtrl.update)
// Change user role
router.post('/promote/:id', UsersCtrl.changeRole)

// View users
// View user by token
router.get('/fromToken', UsersCtrl.showOneFromToken)
// View all users
router.get('/', UsersCtrl.index)
// View user by id route (might not be needed?)
router.get('/:id', UsersCtrl.showOne)

// Delete User
router.delete('/:id', UsersCtrl.destroy)

module.exports = router