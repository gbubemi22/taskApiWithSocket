# [Niyo Test Api]

### POWERED BY

https://nodejs.org/en
https://www.typescriptlang.org/

### ABOUT

### Runs On One Service with Three modules

```bash
-User
-Task
-Event
```

### RUNNING THE APP LOCALLY

```bash
-clone it with https :::  https://github.com/gbubemi22/taskApiWithSocket.git
Or
- clone it with ssh :::  git@github.com:gbubemi22/taskApiWithSocket.git
-run npm i to install Dependences
- run npm run dev || make run
- port 6001
```

### Enviroment Varriable

```bash

NODE_ENV='development'
PORT=6001
MONGO_URI=your mongodb connection string
ACCESS_TOKEN_SECRET='neyo01'
JWT_TOKEN_VALIDITY=1000d
SMTP_USERNAME=1234
SMTP_PASSWORD=your password
SMTP_HOST=your host
SMTP_PORT=your port
SENDERS_EMAIL=
REDIS_URL=localhost:6379
SENDERS_NAME='Niyo'
SENDERS_EMAIL='info.tech@oritsetech.online'
SERVICE_NAME='Niyo-Service'

```

### Tools used

- Node.js/Express/TypeScript
- Ioredis
- jsonwebtoken
- Socket.io
- io
- mongodb


### Postman Doc For Authentication

https://documenter.getpostman.com/view/32904887/2sA3JT3JAt

which has Niyo folder it contains
-User Folder that has

- Auth folder {
  which has end points
  Create
  login
  logout
  verify Email
  send-Otp_To-Email
  Forget-password
  Reset-Password

}

### Doc for Task Which run on Socket

localhost:6001/tasks

the Socket events it contains

socket event like

Create Task : {
handleCreateSocketEvent: Handles the "Create_Task" event by calling the createTask function and emitting the "Created_Task" event with the result.

required: userId and taskName
}

ListAllTaskForOneUser: {
handleListAllTaskSocketEvent: Handles the "Find_All_Tasks" event by calling the listAllTask function and emitting the "Fetched_All" event with the result.

required: userId
}

ListOneTask: {
handleListOneTaskSocketEvent: Handles the "List_One" event by calling the listOneTask function and emitting the "Fetched_One" event with the result.

required: taskId, userId
}

DeleteTask: {
handleDeleteTaskSocketEvent: Handles the "Delete_Task" event by calling the deleteTask function and emitting the "Deleted_Task" event with the result.

required: taskId, userId
}

UpdateTask: {

handleUpdateTaskSocketEvent: Handles the "Update_Task" event by calling the updateTask function and emitting the "Updated_Task" event with the result.

requred: taskId, userId, newData
}

- Each function takes a socket object as a parameter and attaches the event listeners to it.
- If an error occurs during the execution of the event handler, it is caught and logged to the console.
  \*/
