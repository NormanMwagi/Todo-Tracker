
import './styles.css';
import { createTodo, createProject, getProjects, getTodos } from './logic';
import { renderProjects, renderTodos, setupEventListeners } from './ui';

renderProjects();
renderTodos();
setupEventListeners();