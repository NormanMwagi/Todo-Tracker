
const todos = [];
const projects = [];

const TodoItem = (id, title, description, dueDate, priority, complete, projectId) => {
  return { id, title, description, dueDate, priority, complete, projectId };
};

const Project = (id, project_name, createdOn) => {
  return { id, project_name, createdOn, todos: [] };
};

const defaultProjectId = crypto.randomUUID();
const defaultProject = Project(defaultProjectId, "Default Project", new Date());
projects.push(defaultProject);

function createProject(name) {
  const newProjectId = crypto.randomUUID();
  const newProject = Project(newProjectId, name, new Date());
  projects.push(newProject);
  populateProjectsOptions();
  return newProject;
}

function createTodo(title, description, dueDate, priority, complete, projectId) {
  const newTodoId = crypto.randomUUID();
  const assignedProjectId = projectId || defaultProjectId;
  const newTodo = TodoItem(newTodoId, title, description, dueDate, priority, complete, assignedProjectId);

  todos.push(newTodo);

  const targetProject = projects.find(project => project.id === assignedProjectId);
  if (targetProject) {
    targetProject.todos.push(newTodo);
  } else {
    console.warn(`Project with ID ${assignedProjectId} not found for todo: ${title}`);
  }

  return newTodo;
}

function populateProjectsOptions(){
  const projectSelect = document.querySelector('#todo-project');
  projectSelect.innerHTML = '';

  projects.forEach(project => {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.project_name;
    projectSelect.appendChild(option);
  });
}

function getProjects() {
  //console.log(projects);
  return [...projects];
}

function getTodos(projectId) {
  const project = projects.find(p => p.id === projectId) || projects.find(p => p.id === defaultProjectId);
  //console.log(todos);
  return project?.todos || [];
}

export { createProject, createTodo, getProjects, getTodos, defaultProjectId, populateProjectsOptions };
