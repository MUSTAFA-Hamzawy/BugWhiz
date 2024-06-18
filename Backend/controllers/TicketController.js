const asyncHandler = require('express-async-handler');
const TicketModel = require('../models/TicketModel');
const status = require('../helpers/statusCodes');

const createTicket = asyncHandler(async (req, res) => {
    const { name, title, description, projectID, images } = req.body;
    const newTicket = await TicketModel.create({ name, title, description, projectID, images });
    return res.status(status.CREATED).json(newTicket);

});

const searchForTicket = asyncHandler(async (req, res) => {
    const { projectID, keyword } = req.body;

    if (!projectID || !keyword) {
        return res.status(status.VALIDATION_ERROR).json({ message: "Project ID and keyword are required." });
    }

    try {
        const tickets = await TicketModel.find({
            projectID: projectID,
            title: { $regex: keyword, $options: 'i' } // 'i' for case-insensitive search
        });

        res.status(status.OK).json(tickets);
    } catch (error) {
        res.status(status.SERVER_ERROR).json({ message: "Failed to search for tickets" });
    }
});

const getTicket = asyncHandler( async (req, res) => {
    const {name} = req.body;
    const data = await TicketModel.findOne({name});
    res.status(status.OK).json(data);
})

const updateTicket = asyncHandler(async (req, res) => {
    const reqData = req.body;


    // check if the ticket is
    const exist = await TicketModel.findById(reqData.ticketID);
    if (!exist){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket not found.");
    }

    const updatedTicket = await TicketModel.findByIdAndUpdate(
        reqData.ticketID,
        reqData,
        { new: true }
    );
    res.status(status.OK).json(updatedTicket);
});

const deleteTicket = asyncHandler( async (req, res) =>{
    const {name} = req.body;
    const removed = await TicketModel.findOneAndRemove({name});
    if(removed)
        res.status(status.OK).json({deleted: 1})
    else{
        res.status(status.NOT_FOUND);
        throw new Error("Ticket is not found.")
    }

})

module.exports = {
    createTicket,
    searchForTicket,
    getTicket,
    updateTicket,
    deleteTicket,
}