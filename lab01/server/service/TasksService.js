'use strict';
const db = require('../db');

/**
 * Assigned the task to a user
 * Assigned the task by id to the user specified by id
 *
 * uid String The userid to assign the task
 * tid BigDecimal Task is used to assign it to a user
 * returns Task
 **/
exports.assignTask = function (userId, taskId, owner) {
  // console.log(userId, taskId, owner);

  return new Promise(function (resolve, reject) {
    // Check if the owner has that taskId hence it is able to assign it 
    db.get("SELECT * FROM tasks WHERE id = ? AND owner = ?", [taskId, owner], (err, row) => {
      console.log(row)
      if (err) reject(err);
      if (row === undefined || row.length === 0) reject(err);
      else {
        const sql = "UPDATE tasks SET assignedTo = $userId WHERE id = $taskId AND owner = $owner";
        db.run(sql, {
          $userId: userId,
          $taskId: taskId,
          $owner: owner
        }, function (err) {
          if (err) {
            console.log(err);
            reject(err)
          }
          else
            resolve(exports.getTaskById(taskId));
        })
      }
    })

    // var examples = {};
    // examples['application/json'] = {
    //   "important": false,
    //   "owner": "http://example.com/aeiou",
    //   "private": true,
    //   "projects": ["WA1_Project", "WA1_Project"],
    //   "description": "description",
    //   "assignees": ["http://example.com/aeiou", "http://example.com/aeiou"],
    //   "self": "http://example.com/aeiou",
    //   "id": 1.4658129805029452,
    //   "completed": false,
    //   "deadline": "2000-01-23"
    // };
    // if (Object.keys(examples).length > 0) {
    //   resolve(examples[Object.keys(examples)[0]]);
    // } else {
    //   resolve();
    // }
  });
}


/**
 * Create new task
 * Create new task
 *
 * body Task Task that is going to be created
 * no response value expected for this operation
 **/
exports.createTask = (task) => {
  return new Promise(function (resolve, reject) {
    const sql = "INSERT INTO tasks (description, important, private, project, deadline, owner) VALUES (?,?,?,?,?,?)";
    //const sql = "UPDATE tasks SET description = 'Prova' WHERE id = 1";
    db.run(sql, [task.description, task.important, task.private, task.project, task.deadline, task.owner], function (error) {

      if (error) {
        console.log(error);
        reject(error);
      }
      else {
        resolve(exports.getTaskById(this.lastID));
      }
    })

  });
}


/**
 * Delete task by id
 *
 * id BigDecimal Id of task to delete
 * no response value expected for this operation
 **/
exports.deleteTaskById = function (id, userid) {
  return new Promise(function (resolve, reject) {
    const sql = "DELETE FROM tasks WHERE id = ? AND owner = ?";
    db.run(sql, [id, userid], (err) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(null);
      }
    })
    resolve();
  });
}


/**
 * Get the all the assignees of that task
 * Get the list of assignees of that task
 *
 * id BigDecimal Task id used to assign the get all assignee
 * returns User
 **/
exports.getAssigneeTask = function (taskId, owner) {
  return new Promise(function (resolve, reject) {
    const sql = "SELECT * FROM tasks WHERE id = $taskId AND owner = $owner";
    db.get(sql, {
      $taskId: taskId,
      $owner: owner
    }, (err, row) => {
      if (err) reject(err);
      else if (row === undefined || row.length === 0) reject(err);
      else {
        resolve(row);
      }
    })
    // var examples = {};
    // examples['application/json'] = {
    //   "password": "password",
    //   "name": "name",
    //   "self": "http://example.com/aeiou",
    //   "id": 0.8008281904610115,
    //   "email": ""
    // };
    // if (Object.keys(examples).length > 0) {
    //   resolve(examples[Object.keys(examples)[0]]);
    // } else {
    //   resolve();
    // }
  });
}


/**
 * Get task by id
 *
 * id BigDecimal Id values that is used to get the specific task
 * returns Task
 **/
exports.getTaskById = function (id) {
  return new Promise(function (resolve, reject) {
    const sql = "SELECT * FROM tasks WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      if (row === undefined) reject({ code: 404, payload: "Task not found" });

      else {
        const task = {
          id: row.id,
          description: row.description,
          important: row.important,
          private: row.private,
          project: row.project,
          deadline: row.deadline,
          completed: row.completed,
          owner: row.owner,
          assignedTo: row.assignedTo
        }
        resolve(task);
      }
    })
  });
}


/**
 * Get list of tasks assigned or created
 * Get list of tasks assigned or created
 *
 * private Boolean Filter task between private or public (optional)
 * completed Boolean Filter task between completed or not (optional)
 * important Boolean Filter task between important or not (optional)
 * returns Tasks
 **/
exports.getTasks = function (pvt, completed, important) {
  return new Promise(function (resolve, reject) {
    console.log("Private:", pvt, " Important: ", important, " Completed:", completed);
    const sql = "SELECT * FROM tasks WHERE ($pvt is NULL OR private = $pvt) AND ($completed is NULL OR completed = $completed) AND ($important is NULL OR important = $important)";
    db.all(sql, {
      $pvt: pvt,
      $completed: completed,
      $important: important
    }, (err, rows) => {
      if (err) reject(err);
      if (rows === undefined) resolve({ code: 404, payload: "Tasks not found" });
      else {
        const tasks = rows.map(task => (
          {
            id: task.id,
            description: task.description,
            important: task.important,
            private: task.private,
            project: task.project,
            deadline: task.deadline,
            completed: task.completed,
            owner: task.owner,
            assignedTo: task.assignedTo
          }
        ));
        resolve(tasks);
      }
    })
    // var examples = {};
    // examples['application/json'] = {
    //   "next": "http://example.com/aeiou",
    //   "pageNumber": 6.027456183070403,
    //   "totalPages": 0.8008281904610115,
    //   "pageItems": [{
    //     "important": false,
    //     "owner": "http://example.com/aeiou",
    //     "private": true,
    //     "projects": ["WA1_Project", "WA1_Project"],
    //     "description": "description",
    //     "assignees": ["http://example.com/aeiou", "http://example.com/aeiou"],
    //     "self": "http://example.com/aeiou",
    //     "id": 1.4658129805029452,
    //     "completed": false,
    //     "deadline": "2000-01-23"
    //   }, {
    //     "important": false,
    //     "owner": "http://example.com/aeiou",
    //     "private": true,
    //     "projects": ["WA1_Project", "WA1_Project"],
    //     "description": "description",
    //     "assignees": ["http://example.com/aeiou", "http://example.com/aeiou"],
    //     "self": "http://example.com/aeiou",
    //     "id": 1.4658129805029452,
    //     "completed": false,
    //     "deadline": "2000-01-23"
    //   }],
    //   "self": "http://example.com/aeiou"
    // };
    // if (Object.keys(examples).length > 0) {
    //   resolve(examples[Object.keys(examples)[0]]);
    // } else {
    //   resolve();
    // }
  });
}


/**
 * Mark task as completed
 * Mark the task id
 *
 * id BigDecimal Task id used to mark it as completed
 * returns Task
 **/
exports.markComplete = function (taskId, assignedOwner) {
  console.log(taskId, assignedOwner);
  return new Promise(function (resolve, reject) {
    // Check if logged user is assigned to the task to mark as completed
    const sql1 = "SELECT * FROM tasks WHERE id = $taskId AND assignedTo = $assignedOwner";
    db.get(sql1, {
      $taskId: taskId,
      $assignedOwner: assignedOwner
    }, (err, row) => {
      console.log(row);
      if (err) reject(err);
      else if (row === undefined || row.length === 0) reject(err);
      else {
        db.run("UPDATE tasks SET completed = 1 WHERE assignedTo = $assignedOwner AND id = $taskId", {
          $assignedOwner: assignedOwner,
          $taskId: taskId
        }, (err) => {
          if (err) reject(err);
          else
            resolve(exports.getTaskById(taskId));
        })
      }
    })
    // var examples = {};
    // examples['application/json'] = {
    //   "important": false,
    //   "owner": "http://example.com/aeiou",
    //   "private": true,
    //   "projects": ["WA1_Project", "WA1_Project"],
    //   "description": "description",
    //   "assignees": ["http://example.com/aeiou", "http://example.com/aeiou"],
    //   "self": "http://example.com/aeiou",
    //   "id": 1.4658129805029452,
    //   "completed": false,
    //   "deadline": "2000-01-23"
    // };
    // if (Object.keys(examples).length > 0) {
    //   resolve(examples[Object.keys(examples)[0]]);
    // } else {
    //   resolve();
    // }
  });
}


/**
 * Remove assignee 
 * Remove the assignation of the task
 *
 * tid BigDecimal Task id used to remove the assign from it
 * uid BigDecimal User id used to remove the assign from him
 * no response value expected for this operation
 **/
exports.removeAssignee = function (tid, owner) {
  console.log(tid, owner);
  return new Promise(function (resolve, reject) {
    db.get("SELECT * FROM tasks WHERE id = ? AND owner = ?", [tid, owner], (err, row) => {
      console.log(row)
      if (err) reject(err);
      if (row === undefined || row.length === 0) reject(err);
      else {
        const sql = "UPDATE tasks SET assignedTo = NULL WHERE id = $taskId AND owner = $owner";
        db.run(sql, {
          $taskId: tid,
          $owner: owner
        }, function (err) {
          if (err) {
            console.log(err);
            reject(err)
          }
          else
            resolve(exports.getTaskById(tid));
        })
      }
    })
  });
}


/**
 * Update an existing task
 *
 * body Task Task object that need to be updated
 * id BigDecimal Id values that is used to get the specific task
 * no response value expected for this operation
 **/
exports.updateTask = function (taskId, task, userId) {
  console.log(taskId, task, userId);
  return new Promise(function (resolve, reject) {
    const sql = "UPDATE tasks SET description = ifnull($description, description), important = ifnull($important, important), private = ifnull($private, private), project = ifnull($project, project), deadline = ifnull($deadline, deadline) WHERE owner = $owner AND id = $taskId";
    db.run(sql, {
      $description: task.description,
      $important: task.important,
      $private: task.private,
      $project: task.project,
      $deadline: task.deadline,
      $owner: userId,
      $taskId: taskId
    }, function (err) {
      if (err) reject(err);
      else {
        resolve(exports.getTaskById(taskId));
      }
    })

  });
}


