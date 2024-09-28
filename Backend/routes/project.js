const router = require('express').Router();
const ValidateTokenMiddleware = require('../middlewares/ValidateTokenMiddleware');
const ProjectController = require('../controllers/ProjectController');

module.exports = {
    createProject,
    getProjects,
    getProjectTickets,
    updateProject,
    deleteProject,
    addUserToProject,
    getAnalytics,
    getProjectDevelopers
} = ProjectController;

router.use(ValidateTokenMiddleware);




router.route('/')
    .get(getProjects)
    .post(createProject)
    .patch(updateProject)
    .delete(deleteProject);

router.get('/tickets', getProjectTickets)
router.patch('/add_user', addUserToProject)
router.get('/analytics', getAnalytics)
router.get('/developers', ValidateTokenMiddleware, getProjectDevelopers);

module.exports = router;