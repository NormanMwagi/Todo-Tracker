import { format, parseISO } from 'date-fns'; 
import { createProject, createTodo, getProjects, getTodos, defaultProjectId, updateTodo, populateProjectsOptions, deleteTodo } from './logic';

function renderProjects() {
    const projectList = document.querySelector('#project-list');
    projectList.innerHTML = '';

    getProjects().forEach(project => {
        const li = document.createElement('li');
        li.textContent = "#   " + project.project_name;
        li.classList.add('project-item');
        li.dataset.id = project.id;
       
        li.addEventListener('click', () => {
          
            console.log(`Clicked project: ${project.project_name} (ID: ${project.id})`);
            
        });
        projectList.appendChild(li);
    });
}


function displayTodosByProject() {
    const groupedContainer = document.getElementById('grouped');
    groupedContainer.innerHTML = '';

    const allTodos = getTodos();
    const allProjects = getProjects();
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
            todoItemWrapper.dataset.id = todo.id;

            const completeCheck = document.createElement('input');
            completeCheck.classList.add('todo-checkbox');
            completeCheck.type = 'checkbox';
            completeCheck.checked = todo.completed; 
            if (todo.completed) {
                todoItemWrapper.classList.add('completed');
            }

            const todoItem = document.createElement('p');
            todoItem.textContent = `${todo.title}`;

            todoItemWrapper.appendChild(completeCheck);
            todoItemWrapper.appendChild(todoItem);

            
        // Add due date element
        const dueDateEl = document.createElement('div');
        dueDateEl.classList.add('due-date', todo.dueStatus);
        
        if (todo.dueDate) {
            const formattedDate = format(parseISO(todo.dueDate), 'EEE, MMM d');
            dueDateEl.textContent = formattedDate;
        } else {
            dueDateEl.textContent = 'No due date';
        }

        // Create status indicator
        const statusIndicator = document.createElement('div');
        statusIndicator.classList.add('status-indicator', todo.dueStatus);
        
        // Create container for due info
        const dueInfo = document.createElement('div');
        dueInfo.classList.add('due-info');
        dueInfo.appendChild(statusIndicator);
        dueInfo.appendChild(dueDateEl);
        
        // Add action buttons
        const actionButtons = document.createElement('div');
        actionButtons.classList.add('action-buttons');

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => openEditDialog(todo));

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            deleteTodo(todo.id);
            displayTodosByProject();
        });

        actionButtons.appendChild(editBtn);
        actionButtons.appendChild(deleteBtn);
        todoItemWrapper.appendChild(dueInfo);
        todoItemWrapper.appendChild(actionButtons);       
        
        projectDiv.appendChild(todoItemWrapper);    
            
            completeCheck.addEventListener('change', () => {
                
                updateTodo(todo.id, { completed: completeCheck.checked });

           
                if (completeCheck.checked) {
                    todoItemWrapper.classList.add('completed');
                } else {
                    todoItemWrapper.classList.remove('completed');
                }
                
            });
        });
        
        groupedContainer.appendChild(projectDiv);
    });
}
function openEditDialog(todo) {
    const dialog = document.getElementById('add-new-todo');
    const form = document.getElementById('new-todo-form');
    
    // Pre-fill form with todo data
    document.getElementById('todo-title').value = todo.title;
    document.getElementById('todo-desc').value = todo.description;
    document.getElementById('todo-date').value = todo.dueDate;
    document.getElementById('todo-priority').value = todo.priority;
    document.getElementById('todo-project').value = todo.projectId;
    
    // Set edit mode flag and store ID
    form.dataset.editMode = 'true';
    form.dataset.editId = todo.id;
    
    // Change button text
    const submitBtn = form.querySelector('.submit-todo');
    submitBtn.textContent = 'Update Todo';
    
    dialog.showModal();
}


function setupEventListeners() {

    // Removed the redundant DOMContentLoaded here. It should only be in index.js.

    document.querySelector('#new-project-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#project-name').value;
        if (name.trim()) {
            createProject(name); 
            renderProjects(); 
            populateProjectsOptions(); 
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
        const form = e.target;

        if (title.trim()) {
            if (form.dataset.editMode === 'true') {
                
                updateTodo(form.dataset.editId, {
                    title,
                    description,
                    dueDate,
                    priority,
                    projectId
                });
            } else {
                
                createTodo(title, description, dueDate, priority, false, projectId);
            }
            
            displayTodosByProject();
        }
        
        // Reset form and mode
        form.reset();
        delete form.dataset.editMode;
        delete form.dataset.editId;
        form.querySelector('.submit-todo').textContent = 'Add Todo';
    });

    // Reset form when opening for new todo
    document.getElementById('add-todo-btn').addEventListener('click', () => {
        const form = document.getElementById('new-todo-form');
        form.reset();
        delete form.dataset.editMode;
        delete form.dataset.editId;
        form.querySelector('.submit-todo').textContent = 'Add Todo';
        document.getElementById('add-new-todo').showModal();
        populateProjectsOptions();
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
