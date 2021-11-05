'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');

module.exports.getCurrentUser = function getCurrentUser(req, res, next) {
  Users.getCurrentUser()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.loginUser = function loginUser(req, res, next) {
  console.log("req body in Users: ", req.body);
  Users.loginUser(req.body.email, req.body.password)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.logoutUser = function logoutUser(req, res, next) {
  Users.logoutUser()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAssignedTasks = function getAssignedTasks(req, res, next) {
  const user = req.user;
  Users.getAssignedTasks(user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
}
