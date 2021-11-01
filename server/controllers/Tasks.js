'use strict';
/**
 * DONE:
 * getTaskById
 * getTasks: handle the case if user is not logged
 * createTask
 * deleteTaskById
 *  
 * 
 */
var utils = require('../utils/writer.js');
var Tasks = require('../service/TasksService');


module.exports.assignTask = function assignTask(req, res, next, uid, tid) {
  Tasks.assignTask(uid, tid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createTask = function createTask(req, res, next) {

  const task = {
    description: req.body.description,
    important: req.body.important,
    private: req.body.private,
    project: req.body.project,
    deadline: req.body.deadline,
    owner: req.user,
  }
  Tasks.createTask(task)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });


};

module.exports.deleteTaskById = function deleteTaskById(req, res, next) {
  const id = req.params.id;
  const userid = req.user;
  Tasks.deleteTaskById(id, userid)
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


module.exports.getTaskById = function getTaskById(req, res, next) {
  Tasks.getTaskById(req.params.id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// TODO: handle the case if user is not logged
module.exports.getTasks = function getTasks(req, res, next) {
  var pvt = !req.query.private ? null : req.query.private;
  var important = !req.query.important ? null : req.query.important;
  var completed = !req.query.completed ? null : req.query.completed;
  if (!req.user) {
    console.log("No user logged");
    // If there is no user logged, take all the not private (public) tasks
    pvt = 0;
  }
  Tasks.getTasks(pvt, completed, important)
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

module.exports.removeAssignee = function removeAssignee(req, res, next, tid, uid) {
  Tasks.removeAssignee(tid, uid)
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
