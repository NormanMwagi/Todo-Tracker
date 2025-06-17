
import { createProject, createTodo, getProjects, getTodos, defaultProjectId } from './logic';

function renderProjects() {
  const projectList = document.querySelector('#project-list');
  projectList.innerHTML = '';

  getProjects().forEach(project => {
    const li = document.createElement('li');
    li.textContent = project.project_name;
    li.dataset.id = project.id;
    li.addEventListener('click', () => renderTodos(project.id));
    projectList.appendChild(li);
  });
}

function renderTodos(projectId = defaultProjectId) {
  const todoList = document.querySelector('#todo-list');
  todoList.innerHTML = '';

  getTodos(projectId).forEach(todo => {
    const div = document.createElement('div');
    div.classList.add('todo');
    div.textContent = `${todo.title} - ${todo.dueDate} - ${todo.priority}`;
    todoList.appendChild(div);
  });
}

function displayTodosByProject(projectId = defaultProjectId) {
  const groupedContainer = document.getElementById('grouped');
  
  const groupedTodos = {};
  
  // Use your getTodos() function to get all todos
  getTodos(projectId).forEach(todo => {
    if (!groupedTodos[todo.projectId]) {
      const project = getProjects().find(p => p.id === todo.projectId);
      groupedTodos[todo.projectId] = {
        projectName: project ? project.project_name : 'Unknown Project',
        todos: []
      };
    }
    groupedTodos[todo.projectId].todos.push(todo);
  });

  // Create and append project groups
  for (const projectId in groupedTodos) {
    const projectGroup = groupedTodos[projectId];
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project-group';
    
    const projectHeader = document.createElement('h3');
    projectHeader.textContent = projectGroup.projectName;
    projectDiv.appendChild(projectHeader);
    
    projectGroup.todos.forEach(todo => {
      const todoItem = document.createElement('p');
      const completeCheck = document.createElement('input');
      completeCheck.type = 'checkbox';
      completeCheck.checked = todo.completed;
      todoItem.textContent = `${todo.title}`;
      projectDiv.appendChild(todoItem, completeCheck);
    });
    
    groupedContainer.appendChild(projectDiv);
  }
}

function setupEventListeners() {
  document.querySelector('#new-project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#project-name').value;
    if (name.trim()) {
      createProject(name);
      renderProjects();
    }
    e.target.reset();
  });

  document.querySelector('#new-todo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#todo-title').value;
    const description = document.querySelector('#todo-desc').value;
    const dueDate = document.querySelector('#todo-date').value;
    const priority = document.querySelector('#todo-priority').value;
    const projectId = document.querySelector('#todo-project').value;

    if (title.trim()) {
      createTodo(title, description, dueDate, priority, false, projectId || undefined);
      //renderTodos(projectId || defaultProjectId);
      displayTodosByProject(projectId || defaultProjectId);
    }
    e.target.reset();
  });
}

export { renderProjects, renderTodos, setupEventListeners, displayTodosByProject };
