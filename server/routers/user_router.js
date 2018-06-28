const router = require('express').Router()
const {
    loginUser,
    registerUser
} = require('../controllers/user_controller')

//Login
router.post('/login', loginUser)

//Register
router.post('/register', registerUser)

module.exports = router