'use strict';

const mongoose = require('mongoose');

const todo = new mongoose.Schema({
    task: String,
    completedTask: false
});

module.exports = mongoose.model('Todo', todo);