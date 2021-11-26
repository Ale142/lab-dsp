'use strict';

const db = require('../db');
const bcrypt = require("bcrypt");
/**
 * Get current logged user
 *
 * returns User
 **/
exports.getCurrentUser = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "password": "password",
      "name": "name",
      "self": "http://example.com/aeiou",
      "id": 0.8008281904610115,
      "email": ""
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

exports.getUserById = function (id) {
  return new Promise(function (resolve, reject) {
    const sql = 'SELECT * from users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined)
        resolve(404);
      else {
        const user = { id: row.id, email: row.email, name: row.name };
        resolve(user);
      }
    })
  })
}

/**
 * Login user
 *
 * no response value expected for this operation
 **/
exports.loginUser = function (email, password) {
  console.log("Email: ", email, " Password:", password);
  return new Promise(function (resolve, reject) {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {

        reject(err)
      }
      else if (row === undefined) {
        console.log(row);
        resolve(false);
      } else {
        console.log("row:", row);
        const user = { id: row.id, email: row.email, name: row.name };
        bcrypt.compare(password, row.hash).then(result => {
          if (result)
            resolve(user);
          else
            resolve(401);
        })
      }
    })

  });
}


/**
 * Logout user
 *
 * no response value expected for this operation
 **/
exports.logoutUser = function () {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}

exports.getUserAssignedTasks = function (owner) {
  return new Promise(function (resolve, reject) {
    const sql = "SELECT t.id, t.description, t.important, t.private, t.project, t.deadline, t.completed, t.owner FROM tasks t, assignments a WHERE a.user = ? AND t.id = a.task";
    db.all(sql, [owner], (err, rows) => {
      console.log("rows:", rows);
      if (err) reject(err);
      else if (rows === undefined || rows.length === 0) resolve(204);
      else {
        resolve(rows);
      }
    })

  })
}


exports.getUserCreatedTasks = function (owner) {
  return new Promise(function (resolve, reject) {
    const sql = "SELECT * from tasks WHERE owner = ?";
    db.all(sql, [owner], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0 || rows === undefined) resolve(204);
      else resolve(rows);
    })
  })
}

exports.isOwner = function (userId, taskId) {
  return new Promise(function (resolve, reject) {
    db.get("SELECT * FROM tasks WHERE owner = ? AND id = ?", [userId, taskId], (err, row) => {
      if (err) { console.log(err); reject(err); }
      else if (row === undefined) {
        console.log(row);
        resolve(false);
      } else {
        resolve(true);
      }
    })
  })
}

exports.isAssignee = function (userId, taskId) {
  return new Promise(function (resolve, reject) {
    db.get("SELECT * FROM assignments WHERE task = ? AND user = ?", [taskId, userId], (err, row) => {
      if (err) {
        console.log(err);
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
  })
}