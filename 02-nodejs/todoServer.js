/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const PORT = 3000;

let data = [];

const app = express();
const PATH = "./files/todo.txt";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function WriteDate(data) {
  data = JSON.stringify(data);
  fs.writeFile(PATH, data + "\n", { flag: "a" }, (err) => {
    if (err) throw err;
  });
}

function findById(id) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      return data[i];
    }
  }

  return -1;
}

const GetAll = (req, res) => {
  res.json(data);
};

const GetById = (req, res) => {
  let data = findById(req.params.id);
  if (data == -1) {
    res.status(404).send();
  }
  res.json(data);
};

const CreateTodo = (req, res) => {
  let body = req.body;
  let NewBody = { id: uuidv4(), ...body };
  data.push(NewBody);
  WriteDate(NewBody);
  res.json(NewBody);
};

const Update = (req, res) => {
  let response = findById(req.params.id);
  if (todoIndex === -1) {
    res.status(404).send();
  }
  let update = req.body;
  for (var item of Object.keys(update)) {
    response[item] = update[item];
  }
  res.json(response);
};

const Delete = (req, res) => {
  let todoIndex = findById(req.params.id);
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos.splice(todoIndex, 1);
    res.status(200).send();
  }
};
app.get("/todos", GetAll);
app.get("/todos/:id", GetById);
app.post("/todos", CreateTodo);
app.put("/todos/:id", Update);
app.delete("/todos/:id", Delete);

app.use((req, res, next) => {
  res.status(404).send();
});


const ServerSetUp = () => {
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
};

ServerSetUp();


module.exports = app;
