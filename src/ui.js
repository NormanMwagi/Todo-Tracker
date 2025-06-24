
import { createProject, createTodo, getProjects, getTodos, defaultProjectId, updateTodo, populateProjectsOptions } from './logic';

function renderProjects() {
    const projectList = document.querySelector('#project-list');
    projectList.innerHTML = '';

    getProjects().forEach(project => {
        const li = document.createElement('li');
        li.textContent = "#   " + project.project_name;
        li.classList.add('project-item');
        li.dataset.id = project.id;
        // The 'hash' span was unused, removed.
        li.addEventListener('click', () => {
            // This now just logs. If you want to filter todos by clicking project,
            // you'll need to modify displayTodosByProject to accept a filter ID
            // and then re-call it: displayTodosByProject(project.id);
            console.log(`Clicked project: ${project.project_name} (ID: ${project.id})`);
            // Example: displayTodosByProject(project.id);
        });
        projectList.appendChild(li);
    });
}


function displayTodosByProject() {
    const groupedContainer = document.getElementById('grouped');
    groupedContainer.innerHTML = '';

    const allTodos = getTodos(); // Gets all todos from logic.js (loaded from storage)
    const allProjects = getProjects(); // Gets all projects from logic.js (loaded from storage)

    const groupedTodos = {};

    allTodos.forEach(todo => {
        if (!groupedTodos[todo.projectId]) {
            const project = allProjects.find(p => p.id === todo.projectId);
            groupedTodos[todo.projectId] = {
                projectName: project ? project.project_name : 'Unknown Project',
                todos: []
            };
        }
        groupedTodos[todo.projectId].todos.push(todo);
    });

    Object.values(groupedTodos).forEach(projectGroup => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-group';

        const projectHeader = document.createElement('h3');
        projectHeader.textContent = projectGroup.projectName;
        projectDiv.appendChild(projectHeader);

        projectGroup.todos.forEach(todo => {

            const todoItemWrapper = document.createElement('div');
            todoItemWrapper.classList.add('todo-item-row');

            const completeCheck = document.createElement('input');
            completeCheck.classList.add('todo-checkbox');
            completeCheck.type = 'checkbox';
            completeCheck.checked = todo.completed; // Use todo.completed

            // Apply 'completed' class initially based on todo.completed state
            if (todo.completed) {
                todoItemWrapper.classList.add('completed');
            }

            const todoItem = document.createElement('p');
            todoItem.textContent = `${todo.title}`;

            todoItemWrapper.appendChild(completeCheck);
            todoItemWrapper.appendChild(todoItem);

            projectDiv.appendChild(todoItemWrapper);

            // Add event listener to the checkbox
            completeCheck.addEventListener('change', () => {
                // Call the new updateTodo function from logic.js
                // This will update the data in the master 'todos' array AND save to localStorage
                updateTodo(todo.id, { completed: completeCheck.checked });

                // Toggle the 'completed' class for visual feedback
                if (completeCheck.checked) {
                    todoItemWrapper.classList.add('completed');
                } else {
                    todoItemWrapper.classList.remove('completed');
                }
                // No need to call displayTodosByProject here unless you want to re-render everything,
                // as the class toggle handles the visual change immediately.
            });
        });

        groupedContainer.appendChild(projectDiv);
    });
}
function setupEventListeners() {

    // Removed the redundant DOMContentLoaded here. It should only be in index.js.

    document.querySelector('#new-project-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#project-name').value;
        if (name.trim()) {
            createProject(name); // logic.js now handles pushing to 'projects' and saving
            renderProjects(); // Re-render project list in sidebar
            populateProjectsOptions(); // Re-populate dropdown with new project
        }
        e.target.reset();
    });

    document.querySelector('#new-todo-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.querySelector('#todo-title').value;
        const description = document.querySelector('#todo-desc').value;
        const dueDate = document.querySelector('#todo-date').value;
        const priority = document.querySelector('#todo-priority').value;
        const projectId = document.querySelector('#todo-project').value; // Get the selected project ID

        if (title.trim()) {
            // logic.js handles adding to 'todos' and saving
            createTodo(title, description, dueDate, priority, false, projectId);
            displayTodosByProject(); // Re-render the main todo display to show the new todo
        }
        e.target.reset();
    });

    document.getElementById('add-todo-btn').addEventListener('click', () => {
        document.getElementById('add-new-todo').showModal();
        populateProjectsOptions(); // Ensure project options are up-to-date when modal opens
    });
    document.getElementById('close-todo-btn').addEventListener('click', () => {
        document.getElementById('add-new-todo').close();
    });
    document.getElementById('add-project-btn').addEventListener('click', () => {
        document.getElementById('add-new-project').showModal();
    });
    document.getElementById('close-project-btn').addEventListener('click', () => {
        document.getElementById('add-new-project').close();
    });

    // Removed the unused event listener for .todo-checkbox here.
    // The actual listeners are attached dynamically in displayTodosByProject.
}

export { renderProjects, setupEventListeners, displayTodosByProject };
