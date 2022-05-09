const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//ROUTE : 1 localhost:5000/api/auth/fetchAllNotes to fetch all the notes of a user

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });

  res.json(notes);
});
//ROUTE : 2 localhost:5000/api/auth/addNewNote to add the notes in the user

router.post(
  "/addNewNotes",
  fetchuser,
  [
    body("title", "Enter a Valid Name").isLength({ min: 2 }),
    body("description", "Password must be Five Characters long").isLength({
      min: 2,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // 400 means a bad requested in posted
        return res.status(400).json({ errors: errors.array() });
      }

      //   creating a new note
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error);
      res.status(500).send("An internal error occured");
    }
  }
);
//   Route :3 update an existing note  localhost:5000/api/auth/updateNote
router.put("/updateNote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    let note = await Note.findById(req.params.id);
    // Find the note that does is reall exist in the database
    if (!note) {
      return res.status(404).send("Note not found");
    }
    // Find if the person who is update is the actual user or he is trying to update anyother person note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("You are unauthorized and not allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).send("An internal error occured");
  }
});
//   Route :3 update an existing note  localhost:5000/api/auth/deleteNode
router.delete("/deleteNote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    let note = await Note.findById(req.params.id);
    // Find the note that does is reall exist in the database

    if (!note) {
      return res.status(404).send("Note not found");
    }
    // Find if the person who is deleting is the actual user or he is trying to delete anyother person note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("You are unauthorized and not allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ note: note });
  } catch (error) {
    console.error(error);
    res.status(500).send("An internal error occured");
  }
});
module.exports = router;
