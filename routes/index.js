'use strict';

const express = require('express');

const Todo = require('../models/todos');

const router = express.Router();

router.get('/todo', (req, res, next) => {
    Todo.find({})
        .then(todos => {
            res.status(200).json({todos});
        })
        .catch(next);
});

router.post('/todo', (req, res, next) => {
    new Todo(req.body)
        .save()
        .then(todo => {
            res.status(200).json({todo});

        })
        .catch(next);
});

router.put('/:todoId', (req, res, next) => {
    Todo.findOneAndUpdate({_id: req.params.todoId}, req.body.todo)
        .then(todo => {
            res.status(200).json({
                todo: Object.assign(todo.toObject(), req.body.todo)
            });
        })
        .catch(next);
});

router.delete('/:todoId', (req, res, next) => {
    Todo.remove({_id: req.params.todoId})
        .then(() => {
            res.status(200).json({message: 'Todo delete!'});
        })
        .catch(next);
});

module.exports = router;