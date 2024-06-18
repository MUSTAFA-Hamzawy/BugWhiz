const router = require('express').Router();
const CommentController = require('../controllers/CommentController');
const ValidateTokenMiddleware = require('../middlewares/ValidateTokenMiddleware');

module.exports = {
    getTicketComments,
    createComment,
    deleteComment,
    updateComment
} = CommentController;


router.use(ValidateTokenMiddleware);
router.route('/')
    .get(getTicketComments)
    .post(createComment)
    .patch(updateComment)
    .delete(deleteComment);

module.exports = router;