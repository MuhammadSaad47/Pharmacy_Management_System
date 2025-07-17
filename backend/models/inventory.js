const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  email: {type: String , required:true},
  name: {type: String , required:true},
  quantity: {type: String , required:true},
  batchId: {type: String , required:true},
  expireDate: {type: Date , required:true},
  price: {type: String , required:true},
  barcode: {type: String, required: true, unique: true},
  imagePath : { type: String }
})

module.exports = mongoose.model('Inventory',inventorySchema);
