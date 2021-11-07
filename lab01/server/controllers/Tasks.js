'use strict';

// TODO: handle the case if user is not logged when getTasks
/**
 * DONE:
 * getTaskById: fetch also the assignees of that task
 * getTasks: fetch also the assignee of the tasks
 * createTask
 * deleteTaskById
 * updateTask (by Id)
 * assignTask
 * removeAssignee (changed route to /api/tasks/:tid/assignee/:uid)
 * markComplete (check if logged user is in the assignments table)
 * getAssigneeTask (get the list of the users assigned to the task )
 */
var utils = require('../utils/writer.js');
var Tasks = require('../service/TasksService');


module.exports.assignTask = function assignTask(req, res, next,) {
  const tid = req.params.tid;
  const uid = req.params.uid;
  const owner = req.user;
  console.log(uid, tid, owner);
  Tasks.assignTask(uid, tid, owner)
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
  const tid = req.params.tid;
  const owner = req.user;
  Tasks.deleteTaskById(tid, owner)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAssigneeTask = function getAssigneeTask(req, res, next) {
  const taskId = req.params.tid;
  const owner = req.user;
  Tasks.getAssigneeTask(taskId, owner)
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
  console.log("User logged: ", req.user);
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

module.exports.markComplete = function markComplete(req, res, next) {
  const owner = req.user;
  const taskId = req.params.tid;
  Tasks.markComplete(taskId, owner)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.removeAssignee = function removeAssignee(req, res, next) {
  const owner = req.user;
  const uid = req.params.uid;
  const tid = req.params.tid;
  Tasks.removeAssignee(tid, uid, owner)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateTask = function updateTask(req, res, next) {
  const id = req.params.id
  const task = {
    description: req.body.description,
    important: req.body.important,
    private: req.body.private,
    project: req.body.project,
    deadline: req.body.deadline,
  }
  const userId = req.user;
  Tasks.updateTask(id, task, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
