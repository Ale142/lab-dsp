'use strict';

const fs = require('fs'),
  path = require('path'),
  http = require('http');

// const app = require('connect')();
const oas3Tools = require('oas3-tools');
const serverPort = 8080;

const options = {
  controllers: path.join(__dirname, './controllers'),
};
const express = require('express');

const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const app = expressAppConfig.getApp();
const taskController = require(path.join(__dirname, 'controllers/Tasks'));
const userController = require(path.join(__dirname, 'controllers/Users'));
const userService = require(path.join(__dirname, 'service/UsersService'));
const { check, validationResult } = require('express-validator');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jsonwebtoken = require("jsonwebtoken");
const localStrategy = require("passport-local").Strategy;
const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }

  return token;
}
var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = 'alessandrobacci';

// Passport local strategy check if username (email) and password are correct in the DB
passport.use(new localStrategy(function (username, password, done) {

  userService.loginUser(username, password).then((user => {
    if (!user)
      return done(null, false, { message: 'Incorrect username and/or password' })
    else
      return done(null, user);
  }))
}))

passport.serializeUser(function (user, done) {
  done(null, user.id);
})

passport.deserializeUser(function (id, done) {
  userService.getUserById(id).then(user => {
    done(null, user)
  }).catch(err => done(err, null))
})

// passport.use(new JwtStrategy({
//   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//   secretOrKey: 'alessandrobacci'
// }, function (jwtPayload, done) {
//   console.log("JwtPayload:", jwtPayload);
//   const user = users.filter(user => user.username === jwtPayload.id);
//   // Find user in db 
//   if (user) {

//     return done(null, { id: user[0].username })
//   } else {
//     return done(new Error(`User ${jwtPayload.id} not found`), null);
//   }

// }));

// Check if JWT token is in the Authorization Header
passport.use(new JwtStrategy({ jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: 'alessandrobacci' }, function (jwt_payload, done) {
  console.log(jwt_payload);
  return done(null, jwt_payload.user)
}))

app.use(passport.initialize());
app.use(express.json());

// app.use(passport.authenticate('jwt', { session: false }))


app.post('/api/login', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    console.log("user:", user);
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (err) => {
      if (err) return next(err);
    })

    const token = jsonwebtoken.sign({ user: user.id }, opts.secretOrKey);
    res.cookie('jwt', token, { httpOnly: true, sameSite: true });
    return res.json({ id: user.id, name: user.name })
  })(req, res, next);
})


// Check if credentials are correct and check them in the db


app.get("/api/hello", passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.body);
  return res.json({ "msg": "If you see this message you are authenticated with JWT" })
})
app.get("/api/assignees", passport.authenticate('jwt', { session: false }), userController.getAssignedTasks);
app.get("/api/tasks", passport.authenticate('jwt', { session: false }), taskController.getTasks);
app.get("/api/tasks/:id", passport.authenticate('jwt', { session: false }), taskController.getTaskById);
app.post("/api/tasks", passport.authenticate('jwt', { session: false }), taskController.createTask);
app.delete("/api/tasks/:id", passport.authenticate('jwt', { session: false }), taskController.deleteTaskById);
app.put("/api/tasks/:id", passport.authenticate('jwt', { session: false }), taskController.updateTask);
app.post("/api/tasks/:tid/assignees/:uid", passport.authenticate('jwt', { session: false }), taskController.assignTask);
app.delete("/api/tasks/:tid/assignees", passport.authenticate('jwt', { session: false }), taskController.removeAssignee);
app.put("/api/tasks/:tid/assignees", passport.authenticate('jwt', { session: false }), taskController.markComplete);
app.get("/api/tasks/:tid/assignees", passport.authenticate('jwt', { session: false }), taskController.getAssigneeTask);
http.createServer(app).listen(serverPort, function () {
  console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});
