
import './styles.css';
import { createTodo, createProject, getProjects, getTodos, populateProjectsOptions   } from './logic';
import { renderProjects, renderTodos, setupEventListeners, displayTodosByProject } from './ui';

renderProjects();
//renderTodos();
setupEventListeners();
populateProjectsOptions();
displayTodosByProject() 