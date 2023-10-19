const mongoose = require('mongoose');

// Define the schema for your data
const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  // Add more fields as per your data requirements
});

// Create a model based on the schema
const Crop = mongoose.model('Crop', cropSchema);

// Export the model
module.exports = Crop;
