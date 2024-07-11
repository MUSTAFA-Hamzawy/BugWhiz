const router = require('express').Router();
const ValidateTokenMiddleware = require('../middlewares/ValidateTokenMiddleware');
const NotificationController = require('../controllers/NotificationController');

module.exports = {
    getNotifications,
    readNotifications
} = NotificationController;

router.use(ValidateTokenMiddleware);



router.route('/')
    .get(getNotifications)
    .patch(readNotifications)

module.exports = router;