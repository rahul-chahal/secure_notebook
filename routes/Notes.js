// import Express.router()
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Note = require("../models/Note.js");
const mongoose = require('mongoose');
const fetchuser = require("../middleware/fetchuser.js");
var jwt = require('jsonwebtoken');


// Adding note using Authtoken in header as User
router.post('/add_note', [
    body('title').notEmpty().withMessage('Tile is required'),
    body('description').notEmpty().withMessage('Description is required')
],
    fetchuser,
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            // If there are validation errors, respond with a 400 status and the errors
            return res.status(400).json({ errors: result.array() });
        }

        const { title, description } = req.body;
        const data = new Note({ user: req.user, title: title, description: description });
        await data.save();
        res.status(200).json({ mssg: "Successfull " })
    }
)

router.get('/get_note', fetchuser, async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        // If there are validation errors, respond with a 400 status and the errors
        return res.status(400).json({ errors: result.array() });
    }

    const tmp = req.user._id
    const note_in_db = await Note.find({ user: tmp });
    console.log(note_in_db)
    res.status(200).json({ mssg: note_in_db })
}

)

router.post('/update_note', [
    body('title').notEmpty().withMessage('Tile is required'),
    body('description').notEmpty().withMessage('Description is required')
],
    fetchuser,
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            // If there are validation errors, respond with a 400 status and the errors
            return res.status(400).json({ errors: result.array() });
        }
        const Note_id = req.header('note_id')
        const { title, description } = req.body;

        try {
            // Find the note by ID and update it with the new title and description
            const updatedNote = await Note.findByIdAndUpdate(
                Note_id,
                { title, description },
                { new: true, runValidators: true }  // Return the updated document and run validation on updates
            );

            if (!updatedNote) {
                return res.status(404).json({ message: 'Note not found' });  // Return a 404 status if the note is not found
            }

            res.status(200).json({ message: 'Note updated successfully', note: updatedNote });  // Return the updated note
        } catch (error) {
            res.status(500).json({ message: 'Error updating note', error });  // Return a 500 status if there is a server error
        }
    }
)

router.delete('/delete_note',fetchuser,
    async (req, res) => {
        const Note_id = req.header('note_id')
        try {
            const tmp = req.user
            const note_in_db = await Note.findById(Note_id);
            // if note belongs to genuine user which is retreived from auth token
            if (note_in_db.user=tmp._id){
                const updatedNote = await Note.findByIdAndDelete(Note_id);
                res.send(200, { mssg: "Note deleted successfully" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating note', error });  // Return a 500 status if there is a server error
        }
    }
)


module.exports = router
