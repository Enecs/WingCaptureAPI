const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  userid: {
    type: String,
  },
  postid: {
    type: String,
    default: () => Array.from({length: 10}, (_, i) => [...'123456789'][Math.floor(Math.random() * 10)]).join(''),
  },
  content: {
    type: String,
    default: "No stored content"
  },
  responses: {
    type: Array,
    default: []
  },
  extras: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model("questions", questionSchema);