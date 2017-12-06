const express = require('express')
const router = express.Router()
const AuthCtrl = require('../controllers/auth.controller')
const UsersCtrl = require('../controllers/users.controller')

// Authentication
router.post('/signup', UsersCtrl.create) // new users are only created through signup
router.post('/login', UsersCtrl.login)

// Edit user
// Change user profile
router.put('/:id', AuthCtrl.isOwner, UsersCtrl.update)
// Change user role
router.put('/promote/:id', AuthCtrl.isAdmin, UsersCtrl.changeRole)

// View users
// View user by token
router.get('/fromToken', UsersCtrl.showOneFromToken)
// View all users
router.get('/', AuthCtrl.isAdmin, UsersCtrl.index)
// View user by id route (might not be needed?)
router.get('/:id', AuthCtrl.isOwnerOrAdmin, UsersCtrl.showOne)

// Delete User
router.delete('/:id', AuthCtrl.isOwnerOrAdmin, UsersCtrl.destroy)

module.exports = router
