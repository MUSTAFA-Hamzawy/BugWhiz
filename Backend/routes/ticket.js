const router = require('express').Router();
const ValidateTokenMiddleware = require('../middlewares/ValidateTokenMiddleware');
const TicketController = require('../controllers/TicketController');
const multer = require('multer');
const path = require('path');

// multer.diskStorage is a method provided by multer to set up the storage engine.
// It specifies how and where to store the uploaded files on the disk.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

// Initialization multer with the defined storage configuration.
// storage : is the storage engine defined earlier using multer.diskStorage.
const upload = multer({ storage });

module.exports = {
    createTicket,
    searchForTicket,
    getTicket,
    updateTicket,
    deleteTicket,
    getTicketDuplicates
} = TicketController;

router.use(ValidateTokenMiddleware);


router.get('/search', searchForTicket)
router.get('/duplicates', getTicketDuplicates)

router.post('/', upload.array('images'), createTicket);
router.route('/')
    .get(getTicket)
    .patch(updateTicket)
    .delete(deleteTicket);

module.exports = router;