import { React, useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import API from './API'
import ws_message from './components/ws_message'

import { Container, Row, Col, Button, Toast } from 'react-bootstrap/';


import Navigation from './components/Navigation';
import Filters from './components/Filters';
import ContentList from './components/ContentList';
import PublicList from './components/PublicList';
import ModalForm from './components/ModalForm';
import { LoginForm } from './components/Login';
import Assignments from './components/Assignments';
import OnlineList from './components/OnlineList';
import MiniOnlineList from './components/MiniOnlineList';

import { Route, useRouteMatch, useHistory, Switch, Redirect } from 'react-router-dom';


import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);

const url = 'ws://localhost:9090'
let ws = new WebSocket(url)

const App = () => {

  // Need to place <Router> above the components that use router hooks
  return (
    <Router>
      <Main></Main>
    </Router>
  );

}

const Main = () => {


  // This state is an object containing the list of tasks, and the last used ID (necessary to create a new task that has a unique ID)
  const [taskList, setTaskList] = useState([]);
  const [OwnedTaskList, setOwnedTaskList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [onlineList, setOnlineList] = useState([]);
  const [dirty, setDirty] = useState(true);

  const MODAL = { CLOSED: -2, ADD: -1 };
  const [selectedTask, setSelectedTask] = useState(MODAL.CLOSED);

  const [message, setMessage] = useState('');

  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [user, setUser] = useState(null);

  const [activeTask, setActiveTask] = useState(null);

  // active filter is read from the current url
  const match = useRouteMatch('/list/:filter');
  const activeFilter = (match && match.params && match.params.filter) ? match.params.filter : 'owned';

  const history = useHistory();
  // if another filter is selected, redirect to a new view/url
  const handleSelectFilter = (filter) => {
    history.push("/list/" + filter);
  }



  useEffect(() => {

    //You can put the code for WebSocket management here
    if (!loggedIn) {
      ws.onopen = () => {
        console.log("Connection opened");
      }

      ws.onclose = () => {
        console.log("Connection closed")
      }

      ws.onerror = error => {
        console.error('failed to connect', error);
      };

      ws.onmessage = async event => {
        //console.log('received', event);
        const message = JSON.parse(event.data);
        console.log("Message:", message);
        switch (message.typeMessage) {

          case 'login':
            // const array = [...onlineList, { userId: message.userId, userName: message.userName, taskId: message.taskId, taskName: message.taskName }];
            // var result = array.reduce((unique, o) => {
            //   if (!unique.some(obj => obj.userId === o.userId)) {
            //     unique.push(o);
            //   }
            //   return unique;
            // }, []);
            setOnlineList(list => [...list, { userId: message.userId, userName: message.userName, taskId: message.taskId, taskName: message.taskName }]);

            break;
          case 'logout':

            setOnlineList(online => online.filter(user => user.userId !== message.userId));
            break;
          case 'update':
            setOnlineList(users => users.map(u => message.userId === u.userId ? ({ ...u, taskId: message.taskId, taskName: message.taskName }) : u))
            break;
          default:
            break;
        }

        // if (message.typeMessage === 'login') {
        //   console.log("Login")
        //   setOnlineList(online => [...online, message])
        // }
      };
    }
    // check if user is authenticated
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const authenticated = await API.getUserInfo();
        if (authenticated) {
          //setUser();
          setLoggedIn(true);
        } else {
          console.log('error');
        }

      } catch (err) {
        console.log(err.error); // mostly unauthenticated user
      }
    };


    checkAuth();

    return () => {
      ws.close();
    }
  }, []);


  // set dirty to true only if acfiveFilter changes, if the active filter is not changed dirty = false avoids triggering a new fetch
  useEffect(() => {
    setDirty(true);
  }, [activeFilter])

  const deleteTask = (task) => {
    API.deleteTask(task)
      .then(() => setDirty(true))
      .catch(e => handleErrors(e))
  }

  const completeTask = (task) => {
    API.completeTask(task)
      .then(() => { setDirty(true) })
      .catch(e => handleErrors(e))
  }


  const findTask = (id) => {
    return taskList.find(t => t.id === id);
  }

  const getInitialTasks = () => {
    if (loggedIn) {
      API.getTasks('owned')
        .then(tasks => {
          setTaskList(tasks);
        })
        .catch(e => handleErrors(e));
    }
  }

  const getPublicTasks = () => {
    API.getPublicTasks()
      .then(tasks => {
        setTaskList(tasks);
      })
      .catch(e => handleErrors(e));
  }

  const getAllOwnedTasks = () => {
    API.getAllOwnedTasks()
      .then(tasks => {
        setOwnedTaskList(tasks);
      })
      .catch(e => handleErrors(e));
  }

  const getUsers = () => {
    API.getUsers()
      .then(users => {
        setUserList(users);
      })
      .catch(e => handleErrors(e));
  }

  const refreshTasks = (filter, page) => {
    API.getTasks(filter, page)
      .then(tasks => {
        setTaskList(tasks);
        setDirty(false);
      })
      .catch(e => handleErrors(e));
  }

  const refreshPublic = (page) => {
    API.getPublicTasks(page)
      .then(tasks => {
        setTaskList(tasks);
        setDirty(false);
      })
      .catch(e => handleErrors(e));
  }

  const assignTask = (userId, tasksId) => {
    for (var i = 0; i < tasksId.length; i++) {
      API.assignTask(Number(userId), tasksId[i]).catch(e => handleErrors(e));;
    }
  }

  const removeAssignTask = (userId, tasksId) => {
    for (var i = 0; i < tasksId.length; i++) {
      API.removeAssignTask(Number(userId), tasksId[i]).catch(e => handleErrors(e));;
    }
  }

  const selectTask = (task, flag) => {
    setSelectedTask(task);
    API.selectTask(task)
      .then(() => setDirty(true))
      .catch(e => handleErrors(e))
  }

  const changeActiveTask = async task => {
    try {
      await API.setActiveTask(user.id, task.id);

      setActiveTask({ taskId: task.id, taskName: task.description });

      setOnlineList(users => users.map(u => u.userId === user.id ? ({ ...u, taskId: task.id, taskName: task.description }) : u))

      // Send update message to WebSocket
      ws.send(JSON.stringify(new ws_message('update', user.id, user.name, task.id, task.description)));

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (loggedIn && dirty) {
      API.getTasks(activeFilter, localStorage.getItem('currentPage'))
        .then(tasks => {
          setTaskList(tasks);
          setDirty(false);
        })
        .catch(e => handleErrors(e));
    }
  }, [activeFilter, dirty, loggedIn, user])

  // show error message in toast
  const handleErrors = (err) => {
    setMessage({ msg: err.error, type: 'danger' });
    console.log(err);
  }


  // add or update a task into the list
  const handleSaveOrUpdate = (task) => {

    // if the task has an id it is an update
    if (task.id) {
      const response = API.updateTask(task)
        .then(response => {
          if (response.ok) {
            API.getTasks(activeFilter, localStorage.getItem('currentPage'))
              .then(tasks => {
                setTaskList(tasks);
              }).catch(e => handleErrors(e));
          }
        }).catch(e => handleErrors(e));

      // otherwise it is a new task to add
    } else {
      API.addTask(task)
        .then(() => setDirty(true))
        .catch(e => handleErrors(e));
    }
    setSelectedTask(MODAL.CLOSED);
  }

  const handleEdit = (task) => {
    setSelectedTask(task.id);
  }

  const handleClose = () => {
    setSelectedTask(MODAL.CLOSED);
  }

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      const activeTask = await API.getActiveTask(user.id);
      setUser(user);
      setActiveTask(activeTask);

      // Send the user through WebSocket channel
      ws.send(JSON.stringify(new ws_message('login', user.id, user.name, activeTask.taskId, activeTask.taskName)));


      setLoggedIn(true);
    }
    catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  }

  const handleLogOut = async () => {
    await API.logOut()
    // clean up everything
    if (loggedIn && user !== null)
      ws.send(JSON.stringify(new ws_message('logout', user.id, user.name)))
    setLoggedIn(false);
    setOnlineList([])
    setUser(null);
    setTaskList([]);
    setDirty(true);
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('username');

  }


  return (

    <Container fluid>
      <Row>
        <Navigation onLogOut={handleLogOut} loggedIn={loggedIn} user={user} getPublicTasks={getPublicTasks} getInitialTasks={getInitialTasks} />
      </Row>

      <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
        <Toast.Body>{message?.msg}</Toast.Body>
      </Toast>

      <Switch>
        <Route path="/login">
          <Row className="vh-100 below-nav">
            {loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}
          </Row>
        </Route>


        <Route path="/public">
          <Row className="vheight-100">
            <Col sm={3} bg="light" className="d-block col-4" id="left-sidebar">
              <span>&nbsp;&nbsp;</span>
              <MiniOnlineList onlineList={onlineList} />
            </Col>
            <Col className="col-8">
              <Row className="vh-100 below-nav">
                <PublicMgr publicList={taskList} refreshPublic={refreshPublic}></PublicMgr>
              </Row>
            </Col>
          </Row>
        </Route>

        <Route path="/online">
          <Row className="vheight-100">
            <Col sm={3} bg="light" className="d-block col-4" id="left-sidebar">
              <span>&nbsp;&nbsp;</span>
              <MiniOnlineList onlineList={onlineList} />
            </Col>
            <Col sm={8} className="below-nav">
              <h5><strong>Online Users</strong></h5>
              <div className="user">
                <OnlineList usersList={onlineList} ws={ws} />
              </div>
            </Col>
          </Row>
        </Route>

        <Route path="/assignment">
          {loggedIn ?
            <Row className="vheight-100">
              <Col sm={3} bg="light" className="d-block col-4" id="left-sidebar">
                <span>&nbsp;&nbsp;</span>
                <MiniOnlineList onlineList={onlineList} />
              </Col>
              <Col sm={8} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                <Assignments OwnedTaskList={OwnedTaskList} getAllOwnedTasks={getAllOwnedTasks} UserList={userList} getUsers={getUsers} assignTask={assignTask} removeAssignTask={removeAssignTask} />
              </Col>
            </Row>
            : <Redirect to="/login" />
          } </Route>

        <Route path={["/list/:filter"]}>
          {loggedIn ?
            <Row className="vh-100 below-nav">
              <TaskMgr taskList={taskList} filter={activeFilter} onDelete={deleteTask} onEdit={handleEdit} onComplete={completeTask} onCheck={changeActiveTask} activeTask={activeTask} onSelect={handleSelectFilter} refreshTasks={refreshTasks} onlineList={onlineList}></TaskMgr>
              <Button variant="success" size="lg" className="fixed-right-bottom" onClick={() => setSelectedTask(MODAL.ADD)}>+</Button>
              {(selectedTask !== MODAL.CLOSED) && <ModalForm task={findTask(selectedTask)} onSave={handleSaveOrUpdate} onClose={handleClose}></ModalForm>}
            </Row> : <Redirect to="/login" />
          }
        </Route>
        <Route>
          <Redirect to="/list/owned" />
        </Route>
      </Switch>
    </Container>

  );

}


const TaskMgr = (props) => {

  const { taskList, filter, onDelete, onEdit, onComplete, onCheck, onSelect, refreshTasks, onlineList, activeTask } = props;


  // ** FILTER DEFINITIONS **
  const filters = {
    'owned': { label: 'Owned Tasks', id: 'owned' },
    'assigned': { label: 'Assigned Tasks', id: 'assigned' }
  };

  // if filter is not know apply "all"
  const activeFilter = (filter && filter in filters) ? filter : 'owned';

  return (
    <>
      <Col sm={3} bg="light" className="d-block col-4" id="left-sidebar">
        <Filters items={filters} defaultActiveKey={activeFilter} onSelect={onSelect} />
        <MiniOnlineList onlineList={onlineList} />
      </Col>
      <Col className="col-8">
        <h1 className="pb-3">Filter: <small className="text-muted">{activeFilter}</small></h1>
        <ContentList
          tasks={taskList}
          activeTask={activeTask}
          onDelete={onDelete} onEdit={onEdit} onCheck={onCheck} onComplete={onComplete} filter={activeFilter} getTasks={refreshTasks}
        />
      </Col>
    </>
  )

}


const PublicMgr = (props) => {

  const { publicList, refreshPublic } = props;


  return (
    <>
      <Col className="col-8">
        <h1 className="pb-3">Public Tasks</h1>
        <PublicList
          tasks={publicList} getTasks={refreshPublic}
        />
      </Col>
    </>
  )

}


export default App;
