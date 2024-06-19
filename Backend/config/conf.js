const categories = {
    DEFAULT : 'None',
    None : 'None',
    BACKEND : 'Backend',
    FRONTEND : 'Frontend',
    SECURITY : 'Security',
    DOCUMENTATION : 'Documentation'
}

const priorities = {
    DEFAULT : 'P1',
    P1 : 'P1',
    P2 : 'P2',
    P3 : 'P3',
    P4 : 'P4',
    P5 : 'P5',
}
const ticketStatus = {
    DEFAULT : 'TODO',
    TODO : 'TODO',
    PROGRESS : 'Progress',
    TESTING : 'Testing',
    DONE : 'Done',
}

module.exports = {
    categories,
    priorities,
    ticketStatusObject : ticketStatus
};