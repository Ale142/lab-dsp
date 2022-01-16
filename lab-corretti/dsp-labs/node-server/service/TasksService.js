"use strict";
const db = require("better-sqlite3")(__dirname + "/../databaseV2.db", {
  fileMustExist: true,
  verbose: (message, ...args) => console.log(message),
});

/**
 * Create a new task
 * A new task is created by the authenticated user.
 *
 * body Task Task object that needs to be created
 * returns List
 **/
exports.addTask = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Assign automatically the unassigned tasks in a balanced manner
 * The tasks, whose owner is the user who performed this request and that are not assigned to any user, are automatically assigned to the users of the service in a balanced manner.
 *
 * returns inline_response_200_1
 **/
exports.assign = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples["application/json"] = {
      id: 0,
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Assign a task to a user
 * The task with ID taskId is assigned to the user specified in the request body. This operation can only be performed by the owner.
 *
 * body User the user to whom the task is assigned
 * taskId Long ID of the task
 * no response value expected for this operation
 **/
exports.assignTaskToUser = function (userId, taskId) {
  return new Promise(function (resolve, reject) {
    try {
      db.prepare(
        `INSERT INTO assignments
         VALUES(?, ?);`
      ).run([taskId, userId]);
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

/**
 * Complete a task
 * The task with ID taskId is marked as completed. This operation can only be performed by an assignee of the task.
 *
 * taskId Long ID of the task
 * no response value expected for this operation
 **/
exports.completeTask = function (taskId) {
  return new Promise(function (resolve, reject) {
    try {
      db.prepare(
        `UPDATE tasks 
         SET completed = 1
         WHERE id = ?;`
      ).run([taskId]);
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

/**
 * Delete a task
 * The task with ID taskId is deleted. This operation can only be performed by the owner.
 *
 * taskId Long ID of the task to delete
 * no response value expected for this operation
 **/
exports.deleteTask = function (taskId) {
  return new Promise(function (resolve, reject) {
    try {
      const result1 = db
        .prepare(`DELETE FROM assignments WHERE task = ?;`)
        .run([taskId]);
      const result = db
        .prepare(`DELETE FROM tasks WHERE id = ?;`)
        .run([taskId]);
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

/**
 * Retrieve the public tasks
 * The public tasks (i.e., the tasks that are visible for all the users of the service) are retrieved. This operation does not require authentication. A pagination mechanism is implemented to limit the size of messages.
 *
 * pageNo Integer The id of the requested page (if absent, the first page is returned) (optional)
 * returns inline_response_200
 **/
exports.getPublicTasks = function (pageNo) {
  return new Promise((resolve, reject) => {
    resolve(db.prepare("SELECT * FROM tasks WHERE private = 0;").all());
  });
};

/**
 * Retreve a task
 * The task with ID taskId is retrieved. This operation can be performed on the task if at least one of the following three conditions is satisfied. 1) The task is public. 2) The user who performs the operation is the task's owner. 3) The user who performs the operation is a task's assignee.
 *
 * taskId Long ID of the task to retrieve
 * returns List
 **/
exports.getSingleTask = function (taskId) {
  return new Promise(function (resolve, reject) {
    resolve(db.prepare("SELECT * FROM tasks WHERE id = ?;").get([taskId]));
  });
};

/**
 * Retreve the users a task has been assigned to
 * The users to whom the task with ID taskId is assigned are retrieved. This operation can be performed only by the owner.
 *
 * taskId Long ID of the task to retrieve
 * returns List
 **/
exports.getUsersAssigned = function (taskId) {
  return new Promise((resolve, reject) => {
    try {
      const result = db
        .prepare(
          `SELECT u.id, u.email, u.name
          FROM tasks t
          JOIN assignments a ON t.id = a.task
          JOIN users u ON a.user = u.id
          WHERE t.id = ?;`
        )
        .all([taskId]);
      resolve(result);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

/**
 * Remove a user from the assigned task
 * The user that is removed is the user, identified by userId, that was assigned to the task identified by taskId. This operation can be performed only by the owner.
 *
 * taskId Long ID of the assigned task
 * userId Long ID of the user to remove
 * no response value expected for this operation
 **/
exports.removeUser = function (taskId, userId) {
  return new Promise(function (resolve, reject) {
    try {
      db.prepare(`DELETE FROM assignments WHERE task = ? AND user = ?;`).run([
        taskId,
        userId,
      ]);
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

/**
 * Update a task
 * The task with ID taskId is updated. This operation does not allow to mark a task as completed. This operation can be performed only by the owner.
 *
 * body Task The updated task object that needs to replace the old object
 * taskId Long ID of the task to update
 * no response value expected for this operation
 **/
exports.updateSingleTask = function (body, taskId) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};
