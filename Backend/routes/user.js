const router = require('express').Router();
const UserController = require('../controllers/UserController');
const ValidateTokenMiddleware = require('../middlewares/ValidateTokenMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage });

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
router.patch('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'headerImage', maxCount: 1 }]), ValidateTokenMiddleware, updateProfile);

module.exports = router;