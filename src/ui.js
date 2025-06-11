
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
      renderTodos(projectId || defaultProjectId);
    }
    e.target.reset();
  });
}

export { renderProjects, renderTodos, setupEventListeners };
