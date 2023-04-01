const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
  todo_description: {
    type: String
  },
  responsible: {
    type: String
  },
  priority: {
    type: String
  },
  completed: {
    type: Boolean
  }
});

module.exports = mongoose.model('Todo', Todo);
