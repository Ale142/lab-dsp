'use strict';

var utils = require('../utils/writer.js');
var Tasks = require('../service/TasksService');

module.exports.assignTask = function assignTask(req, res, next, username, id) {
  Tasks.assignTask(username, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createTask = function createTask(req, res, next, body) {
  Tasks.createTask(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteTaskById = function deleteTaskById(req, res, next, id) {
  Tasks.deleteTaskById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAssigneeTask = function getAssigneeTask(req, res, next, id) {
  Tasks.getAssigneeTask(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getTaskById = function getTaskById(req, res, next, id) {
  Tasks.getTaskById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getTasks = function getTasks(req, res, next) {
  Tasks.getTasks()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.markComplete = function markComplete(req, res, next, id) {
  Tasks.markComplete(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.removeAssignee = function removeAssignee(req, res, next, id) {
  Tasks.removeAssignee(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateTask = function updateTask(req, res, next, body, id) {
  Tasks.updateTask(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
