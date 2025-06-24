
import './styles.css';
import { createTodo, createProject, getProjects, getTodos, populateProjectsOptions   } from './logic';
import { renderProjects, setupEventListeners, displayTodosByProject } from './ui';


document.addEventListener('DOMContentLoaded', () => {
  displayTodosByProject();
  renderProjects();

  setupEventListeners();
  populateProjectsOptions();
});