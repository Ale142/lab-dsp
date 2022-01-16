import { useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import API from "../API";
import ContentList from "../components/ContentList";
import Filters from "../components/Filters";
import MiniOnlineList from "../components/MiniOnlineList";
import ModalForm from "../components/ModalForm";
var mqtt = require('mqtt')
var clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
var options = {
  keepalive: 30,
  clientId: clientId,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
  rejectUnauthorized: false
}
var host = 'ws://127.0.0.1:8080'
var client = mqtt.connect(host, options);
const filters = {
  owned: { label: "Owned Tasks", id: "owned" },
  assigned: { label: "Assigned Tasks", id: "assigned" },
  public: { label: "Public Tasks", id: "public" },
};
const EventEmitter = require('events');
const handler = new EventEmitter();

const TaskManager = ({ onCheck, onlineList }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [refetchTasks, setRefetchTasks] = useState(false);
  const [assignedTaskList, setAssignedTaskList] = useState([])
  const history = useHistory();
  const { filter } = useParams();

  useEffect(() => {
    onPageChange(filter, 1)
  }, [filter]);
  useEffect(() => {
    // MQTT
    client.on('error', err => {
      console.log(err);
      client.end();
    })

    client.on('connect', () => {
      console.log("Client connected " + clientId);
    })

    client.on('message', (topic, message, packet) => {
      try {
        // console.log("MQTT message: " + message.toString() + " from topic: " + topic);
        displayTaskSelection(topic, JSON.parse(message.toString()));
      } catch (err) {
        console.log("Message that caused error: " + message.toString());
        console.log(err);
      }

    })

    client.on('close', () => {
      console.log(`Client ${clientId} disconnected `);
    })

  }, [])

  const displayTaskSelection = (topic, parsedMessage) => {
    handler.emit(topic, parsedMessage);
    // console.log("Tasks:" + tasks.forEach(t => console.log(t)));
    var index = tasks.findIndex(x => x.taskId === topic);
    let objectStatus = { taskId: topic, userName: parsedMessage.userName, status: parsedMessage.status };
    var temp = tasks;
    index === -1 ? temp.push(objectStatus) : temp[index] = objectStatus;
    console.log("Message arrived: " + JSON.stringify(parsedMessage) + " topic: " + topic + " TEMP:", temp);
    // console.log(temp);

    setAssignedTaskList(temp);
    setRefetchTasks(true);
  }

  useEffect(() => {
    if (refetchTasks) {
      API.getTasks(filter).then((payload) => {
        setTasks(payload.tasks);
        setPageInfo(payload.pageInfo);
        setRefetchTasks(false);
      });
    }
    // eslint-disable-next-line
  }, [refetchTasks]);

  const onPageChange = (filter, page) => {
    API.getTasks(filter, page).then((payload) => {
      setTasks(payload.tasks);
      setPageInfo(payload.pageInfo);
      if (filter === "assigned") {
        for (var i = 0; i < payload.tasks.length; i++) {
          client.subscribe(String(payload.tasks[i].id), { qos: 0, retain: true });
          console.log("Subscribing to " + payload.tasks[i].id)
        }
      }
    });
  };

  const onTaskDelete = (task) => {
    API.deleteTask(task)
      .then(() => setRefetchTasks(true))
      .catch((e) => console.log(e));
  };

  const onTaskComplete = (task) => {
    API.completeTask(task)
      .then(() => setRefetchTasks(true))
      .catch((e) => console.log(e));
  };
  const onTaskEdit = (task) => {
    setSelectedTask(task);
  };

  const onTaskCheck = (task) => {
    API.selectTask(task)
      .then(() => setRefetchTasks(true))
      .catch((e) => { alert("Task is already selected by another user!"); console.log(e) });
  };
  const onSaveOrUpdate = (task) => {
    // if the task has an id it is an update
    if (task.id) {
      API.updateTask(task).then((response) => {
        if (response.ok) {
          API.getTasks(filter, pageInfo.currentPage).then((payload) => {
            setTasks(payload.tasks);
            setPageInfo(payload.pageInfo);
          });
        }
      });

      // otherwise it is a new task to add
    } else {
      API.addTask(task).then(() => setRefetchTasks(true));
    }
    setSelectedTask(undefined);
  };

  const onFilterSelect = (filter) => history.push("/list/" + filter);

  return (
    <>
      {/* Available filters sidebar */}
      <Col sm={3} id="left-sidebar">
        <Filters
          items={filters}
          defaultActiveKey={filter}
          onSelect={onFilterSelect}
        />
        <MiniOnlineList onlineList={onlineList} />
      </Col>
      <Col sm={9}>
        <h1>
          Filter: <span className="text-muted">{filter}</span>
        </h1>
        <ContentList
          tasks={tasks}
          pageInfo={pageInfo}
          onDelete={onTaskDelete}
          onEdit={onTaskEdit}
          onCheck={onTaskCheck}
          onComplete={onTaskComplete}
          filter={filter}
          onPageChange={onPageChange}
          assignedTaskList={assignedTaskList}
        />
      </Col>
      <Button
        variant="success"
        size="lg"
        className="fixed-right-bottom"
        onClick={() => setSelectedTask({})}
      >
        +
      </Button>

      {selectedTask !== undefined && (
        <ModalForm
          show={true}
          task={selectedTask}
          onSave={onSaveOrUpdate}
          onClose={() => setSelectedTask(undefined)}
        />
      )}
    </>
  );
};

export default TaskManager;
