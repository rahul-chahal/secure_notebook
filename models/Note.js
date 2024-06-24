const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;

const NoteSchema = new Schema({
  user:{ type: mongoose.Schema.Types.ObjectId, ref:'users'},
  title: { type: String},
  description: String,
  date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Note', NoteSchema )