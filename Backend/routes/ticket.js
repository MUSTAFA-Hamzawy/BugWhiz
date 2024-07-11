const router = require('express').Router();
const ValidateTokenMiddleware = require('../middlewares/ValidateTokenMiddleware');
const TicketController = require('../controllers/TicketController');
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
    createTicket,
    searchForTicket,
    getTicket,
    updateTicket,
    deleteTicket
} = TicketController;

router.use(ValidateTokenMiddleware);


router.get('/search', searchForTicket)

router.post('/', upload.array('images'), createTicket);
router.route('/')
    .get(getTicket)
    .patch(updateTicket)
    .delete(deleteTicket);

module.exports = router;