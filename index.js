const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

//Local Middleware 01
function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  return next();
}
//Global Middleware 02
function logRequestCount(req, res, next) {
  console.count('Requests');
  next();
}

server.use(logRequestCount);

//ROTA 01 - POST /projects
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const RegisterNewProject = { id, title, tasks: [] };

  projects.push(RegisterNewProject);

  return res.json({ projects });
});

//ROTA 02 - GET /projects
server.get('/projects', (req, res) => {
  const projectsList = projects.map(p => ({ title: p.title, tasks: p.tasks }));

  return res.send(projectsList);
});

//ROTA 03 - PUT /projects/:id
server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { updateTitle } = req.body;

  let project = projects.find(p => p.id === id);

  project.title = updateTitle;

  return res.send();
});

//ROTA 04 - DELETE /projects/:id
server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  let projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//ROTA 05 - POST /projects/:id/tasks
server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.send();
});

server.listen(3000);
