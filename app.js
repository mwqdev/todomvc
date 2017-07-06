const express = require('express');
const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');

const Todo = require('./models/todo');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/todolist');


const app = express();


app.use('/static', express.static('static'));
app.use(bodyParser.json());



app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
});

app.get('/api/todos', async (req, res) => {
    let todos = await Todo.find();
    return res.json(todos);
});

app.post('/api/todos', async (req, res) => {
    let title = req.body.title;
    let id = await Todo.find().then((val => {
        return val.length;
    }));
    let todo = new Todo({title: title, id: id});

    todo.save().then((todo) => {
        return res.json(todo);
    });
});

app.put('/api/todos/:id', async (req, res) => {
    let id = req.params.id;
    let title = req.body.title;

    if (req.body.completed) {
        await Todo.find({
            id: id
        }).update({completed: true});
    }

    let todo = await Todo.find({
        id: id
    }).update({title: title});

    return res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
    let id = req.params.id;
    let todo = await Todo.find({
        id: id
    }).remove();

    return res.send(todo);
});

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
