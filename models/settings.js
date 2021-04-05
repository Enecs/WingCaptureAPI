const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Unknown'
  },
  data: {
    type: Boolean,
    default: {}
  }
});

module.exports = mongoose.model("settings", settingsSchema);