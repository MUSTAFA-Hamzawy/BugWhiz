const router = require('express').Router();
const ValidateTokenMiddleware = require('../middlewares/ValidateTokenMiddleware');
const TicketController = require('../controllers/TicketController');

module.exports = {
    createTicket,
    searchForTicket,
    getTicket,
    updateTicket,
    deleteTicket
} = TicketController;

router.use(ValidateTokenMiddleware);


router.get('/search', searchForTicket)


router.route('/')
    .get(getTicket)
    .post(createTicket)
    .patch(updateTicket)
    .delete(deleteTicket);

module.exports = router;