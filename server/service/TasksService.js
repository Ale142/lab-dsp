'use strict';


/**
 * Assigned the task by id
 * Assigned the task with specified id
 *
 * username String The user name to assign the task
 * id BigDecimal Task is used to assign it to a user
 * returns Task
 **/
exports.assignTask = function (username, id) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "important": false,
      "owner": "{}",
      "private": true,
      "projects": ["WA1_Project", "WA1_Project"],
      "description": "description",
      "self": "http://example.com/aeiou",
      "id": 1.4658129805029452,
      "completed": false,
      "deadline": "2000-01-23"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Create new task
 * Create new task
 *
 * body Task Task that is going to be created
 * no response value expected for this operation
 **/
exports.createTask = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}


/**
 * Delete task by id
 *
 * id BigDecimal Id of task to delete
 * no response value expected for this operation
 **/
exports.deleteTaskById = function (id) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}


/**
 * Get the assignees of that task
 * Get the list of all the assignees of that task
 *
 * id BigDecimal Task id used to assign the get all assignee
 * returns Tasks
 **/
exports.getAssigneeTask = function (id) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "next": "http://example.com/aeiou",
      "pageNumber": 6.027456183070403,
      "totalPages": 0.8008281904610115,
      "pageItems": [{
        "important": false,
        "owner": "{}",
        "private": true,
        "projects": ["WA1_Project", "WA1_Project"],
        "description": "description",
        "self": "http://example.com/aeiou",
        "id": 1.4658129805029452,
        "completed": false,
        "deadline": "2000-01-23"
      }, {
        "important": false,
        "owner": "{}",
        "private": true,
        "projects": ["WA1_Project", "WA1_Project"],
        "description": "description",
        "self": "http://example.com/aeiou",
        "id": 1.4658129805029452,
        "completed": false,
        "deadline": "2000-01-23"
      }],
      "self": "http://example.com/aeiou"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = {
      "important": false,
      "owner": "{}",
      "private": true,
      "projects": ["WA1_Project", "WA1_Project"],
      "description": "description",
      "self": "http://example.com/aeiou",
      "id": 1.4658129805029452,
      "completed": false,
      "deadline": "2000-01-23"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get list of tasks assigned or created
 * Get list of tasks assigned or created
 *
 * returns Tasks
 **/
exports.getTasks = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "next": "http://example.com/aeiou",
      "pageNumber": 6.027456183070403,
      "totalPages": 0.8008281904610115,
      "pageItems": [{
        "important": false,
        "owner": "{}",
        "private": true,
        "projects": ["WA1_Project", "WA1_Project"],
        "description": "description",
        "self": "http://example.com/aeiou",
        "id": 1.4658129805029452,
        "completed": false,
        "deadline": "2000-01-23"
      }, {
        "important": false,
        "owner": "{}",
        "private": true,
        "projects": ["WA1_Project", "WA1_Project"],
        "description": "description",
        "self": "http://example.com/aeiou",
        "id": 1.4658129805029452,
        "completed": false,
        "deadline": "2000-01-23"
      }],
      "self": "http://example.com/aeiou"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Mark task as completed by id
 * Mark as completed the task
 *
 * id BigDecimal Task id used to mark it as completed
 * returns Task
 **/
exports.markComplete = function (id) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "important": false,
      "owner": "{}",
      "private": true,
      "projects": ["WA1_Project", "WA1_Project"],
      "description": "description",
      "self": "http://example.com/aeiou",
      "id": 1.4658129805029452,
      "completed": false,
      "deadline": "2000-01-23"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Remove assignee 
 * Remove the assignation of the task
 *
 * id BigDecimal Task id used to remove the assign
 * no response value expected for this operation
 **/
exports.removeAssignee = function (id) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing task
 *
 * body Task Task object that need to be updated
 * id BigDecimal Id values that is used to get the specific task
 * no response value expected for this operation
 **/
exports.updateTask = function (body, id) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}

