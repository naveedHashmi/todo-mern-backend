const express = require('express');
const bodyParser = require('body-parser');
const todoRoutes = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 4000;

mongoose.connect('mongodb://localhost:27017/todos', { useNewUrlParser: true });

let Todo = require('./todo.model');
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
})
app.use(bodyParser.json());
app.use(cors());

todoRoutes.route('/').get((req, res)=>{
  console.log("Receiving get request")
  Todo.find().then(todos => {
    res.json(todos);
  })
});


todoRoutes.route('/:id').get((req, res) => {
  let id = req.params.id;
  Todo.findById(id).then(todo => {
    if(todo) {
      res.json(todo);
    } else {
      res.send('Record not found!');
    }
  }).catch(err => {
    res.send('Something went wrong: ' + err.message);
  })
});

todoRoutes.route('/update/:id').post((req, res) => {
  Todo.findById(req.params.id).then(todo => {
    if (!todo) {
      res.status(404).send('No todo found!');
    } else {
      todo.description = req.body.description;
      todo.responsible = req.body.responsible;
      todo.priority = req.body.priority;
      todo.completed = req.body.completed;

      todo.save().then(todo => {
        res.json('Todo Updated!');
      }).catch(err => {
        res.status(400).send('Update not possible!');
      })
    }
  });
});


todoRoutes.route('/add').post((req, res) => {
  let todo = new Todo(req.body);

  todo.save()
      .then(todo => {
        res.status(200).send('Todo Added!');
      }).catch(err => {
        res.status(400).send('Adding new todo failed!');
      });
});

app.use('/todos', todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
})
