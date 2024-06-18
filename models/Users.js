const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;

const UsersSchema = new Schema({
  name: String,
  email: String,
  password: {type: String, required: true},
  date: { type: Date, default: Date.now },
});


module.exports = mongoose.model('users', UsersSchema )