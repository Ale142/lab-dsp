'use strict';

const User = require('../components/user');
const db = require('../components/db');
const bcrypt = require('bcrypt');
const { getActiveTask } = require('../controllers/Users');

/**
 * Retrieve a user by her email
 * 
 * Input:
 * - email: email of the user
 * Output:
 * - the user having the specified email
 * 
 */
exports.getUserByEmail = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE email = ?";
        db.all(sql, [email], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};

/**
 * Retrieve a user by her ID
 * 
 * Input:
 * - id: ID of the user
 * Output:
 * - the user having the specified ID
 * 
 */
exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, name, email FROM users WHERE id = ?"
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};

/**
 * Retrieve all the users
 * 
 * Input:
 * - none
 * Output:
 * - the list of all the users
 * 
 */
exports.getUsers = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, name, email FROM users";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows.length === 0)
                    resolve(undefined);
                else {
                    let users = rows.map((row) => createUser(row));
                    resolve(users);
                }
            }
        });
    });
}

exports.getActiveTask = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, description FROM tasks t, assignments a WHERE t.id = a.task AND a.user = ? and a.active = 1";
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log("here: ", err);
                reject(err);
            } else {
                console.log(row);
                if (row.length === 0)
                    resolve(undefined);
                else {
                    resolve({ taskId: row.id, taskName: row.description })
                }
            }
        })
    })
}

exports.setActiveTask = function (userId, taskId) {
    return new Promise((resolve, reject) => {
        db.run("UPDATE assignments SET active = 0 WHERE user = ?", [userId], (err) => {
            if (err) {
                console.log("HERE", err);
                reject(err);
            } else {
                db.run("UPDATE assignments SET active = 1 WHERE user = ? AND task = ?", [userId, taskId], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(taskId);
                    }
                })
            }
        })
    })
}


/**
 * Utility functions
 */

const createUser = function (row) {
    const id = row.id;
    const name = row.name;
    const email = row.email;
    const hash = row.hash;
    return new User(id, name, email, hash);
}

exports.checkPassword = function (user, password) {
    let hash = bcrypt.hashSync(password, 10);
    return bcrypt.compareSync(password, user.hash);
}