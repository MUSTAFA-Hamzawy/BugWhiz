const router = require('express').Router();
const ValidateTokenMiddleware = require('../middlewares/ValidateTokenMiddleware');
const ProjectController = require('../controllers/ProjectController');

module.exports = {
    createProject,
    getProjects,
    getProjectTickets,
    updateProject,
    deleteProject,
    addUserToProject
} = ProjectController;

router.use(ValidateTokenMiddleware);


router.get('/tickets', getProjectTickets)
router.patch('/add_user', addUserToProject)


router.route('/')
    .get(getProjects)
    .post(createProject)
    .patch(updateProject)
    .delete(deleteProject);

module.exports = router;