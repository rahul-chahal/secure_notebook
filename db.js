const mongoose = require('mongoose');

main().catch(err => console.log(err));
 
async function main() {
  await mongoose.connect('mongodb://localhost:27017/');
  // console.log("connected to mongo server suceessfully")
}

module.exports = main