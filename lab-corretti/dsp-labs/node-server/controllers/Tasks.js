"use strict";

var utils = require("../utils/writer.js");
var Tasks = require("../service/TasksService");

module.exports.addTask = function addTask(req, res, next, body) {
  Tasks.addTask(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.assign = function assign(req, res, next) {
  Tasks.assign()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.assignTaskToUser = function assignTaskToUser(
  req,
  res,
  next,
  userId,
  taskId
) {
  Tasks.assignTaskToUser(userId, taskId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.completeTask = function completeTask(req, res, next, taskId) {
  Tasks.completeTask(taskId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteTask = function deleteTask(req, res, next, taskId) {
  Tasks.deleteTask(taskId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getPublicTasks = function getPublicTasks(
  req,
  res,
  next,
  pageNo
) {
  Tasks.getPublicTasks(pageNo)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSingleTask = function getSingleTask(req, res, next, taskId) {
  Tasks.getSingleTask(taskId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUsersAssigned = function getUsersAssigned(
  req,
  res,
  next,
  taskId
) {
  Tasks.getUsersAssigned(taskId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.removeUser = function removeUser(
  req,
  res,
  next,
  taskId,
  userId
) {
  Tasks.removeUser(taskId, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateSingleTask = function updateSingleTask(
  req,
  res,
  next,
  body,
  taskId
) {
  Tasks.updateSingleTask(body, taskId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
