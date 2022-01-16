"use strict";

/**
 * Retrieve the tasks assigned to the user with ID userId
 * This operation allows an authenticated user to retrieve the tasks that has been assigned to her. A pagination mechanism is implemented to limit the size of messages.
 *
 * userId Long ID of the user
 * pageNo Integer The id of the requested page (if absent, the first page is returned) (optional)
 * returns inline_response_200
 **/
exports.getAssignedTasks = function (userId, pageNo) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples["application/json"] = {
      next: "next",
      totalItems: 1,
      totalPages: 0,
      currentPage: 6,
      tasks: [
        {
          important: false,
          owner: {
            password: "password",
            $schema: "$schema",
            name: "name",
            self: "self",
            id: 5,
            email: "",
          },
          private: true,
          description: "description",
          project: "project",
          assignees: [null, null],
          self: "self",
          id: 5,
          completed: false,
          deadline: "2000-01-23T04:56:07.000+00:00",
        },
        {
          important: false,
          owner: {
            password: "password",
            $schema: "$schema",
            name: "name",
            self: "self",
            id: 5,
            email: "",
          },
          private: true,
          description: "description",
          project: "project",
          assignees: [null, null],
          self: "self",
          id: 5,
          completed: false,
          deadline: "2000-01-23T04:56:07.000+00:00",
        },
      ],
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Get information about a user
 * The available information (password excluded) about the user specified by userId is retrieved.
 *
 * userId Long ID of the user to get
 * returns User
 **/
exports.getSingleUser = function (userId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples["application/json"] = {
      password: "password",
      $schema: "$schema",
      name: "name",
      self: "self",
      id: 5,
      email: "",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Retrieve the tasks created by the user with ID userId
 * This operation allows an authenticated user to retrieve the tasks that she has created. A pagination mechanism is implemented to limit the size of messages.
 *
 * userId Long ID of the user
 * pageNo Integer The id of the requested page (if absent, the first page is returned) (optional)
 * returns inline_response_200
 **/
exports.getUserTasks = function (userId, pageNo) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples["application/json"] = {
      next: "next",
      totalItems: 1,
      totalPages: 0,
      currentPage: 6,
      tasks: [
        {
          important: false,
          owner: {
            password: "password",
            $schema: "$schema",
            name: "name",
            self: "self",
            id: 5,
            email: "",
          },
          private: true,
          description: "description",
          project: "project",
          assignees: [null, null],
          self: "self",
          id: 5,
          completed: false,
          deadline: "2000-01-23T04:56:07.000+00:00",
        },
        {
          important: false,
          owner: {
            password: "password",
            $schema: "$schema",
            name: "name",
            self: "self",
            id: 5,
            email: "",
          },
          private: true,
          description: "description",
          project: "project",
          assignees: [null, null],
          self: "self",
          id: 5,
          completed: false,
          deadline: "2000-01-23T04:56:07.000+00:00",
        },
      ],
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Get information about the users
 * The available information (passwords excluded) about all the users is retrieved.
 *
 * returns List
 **/
exports.getUsers = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples["application/json"] = [
      {
        password: "password",
        $schema: "$schema",
        name: "name",
        self: "self",
        id: 5,
        email: "",
      },
      {
        password: "password",
        $schema: "$schema",
        name: "name",
        self: "self",
        id: 5,
        email: "",
      },
    ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Logs a user in
 * The user who wants to log in sends the user data to the authenticator which performs the operation. 
 *
 * body User The data of the user who wants to perform log in. The structure must contain 
email and password.

 * no response value expected for this operation
 **/
exports.loginUser = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Logs a user out
 * The user who wants to log out sends the user data to the authenticator which performs the operation. 
 *
 * body User The data of the user who wants to perform log out. The structure must contain 
the user id.

 * no response value expected for this operation
 **/
exports.logoutUser = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};
