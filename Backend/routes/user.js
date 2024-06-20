const router = require('express').Router();
const UserController = require('../controllers/UserController');
const ValidateTokenMiddleware = require('../middlewares/ValidateTokenMiddleware');

module.exports = {
    getProfile,
    login,
    register,
    logout,
    updateProfile,
    getUsers
} = UserController;



router.get('/profile', ValidateTokenMiddleware, getProfile);
router.post('/login', login);
router.post('/register', register);
router.get('/logout', ValidateTokenMiddleware, logout);
router.get('/', ValidateTokenMiddleware, getUsers);
router.patch('/', ValidateTokenMiddleware, updateProfile);

module.exports = router;