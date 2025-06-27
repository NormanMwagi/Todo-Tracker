import { format, isToday, isTomorrow, isPast, parseISO, addDays } from 'date-fns';

let todos = []; 
let projects = []; 

const TodoItem = (id, title, description, dueDate, priority, completed, projectId) => {
    
    return { id, title, description, dueDate, priority, completed, projectId, dueStatus: calculateDueStatus(dueDate)};
};

const Project = (id, project_name, createdOn) => {
    return { id, project_name, createdOn };
};

let defaultProjectId = 'default-project-id'; // Consistent fixed ID for default project

// --- Local Storage Management Functions ---
function getProjectsFromLocalStorage() {
    const storedProjects = localStorage.getItem('projects');
    return storedProjects ? JSON.parse(storedProjects) : [];
}

function saveProjectsToLocalStorage() {
    // Always save the current state of the global 'projects' array
    localStorage.setItem('projects', JSON.stringify(projects));
}

function getTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
}

function saveTodosToLocalStorage() {
    // Always save the current state of the global 'todos' array
    localStorage.setItem('todos', JSON.stringify(todos));
}

// --- Initialization Logic ---
function initializeData() {
    projects = getProjectsFromLocalStorage(); // Load existing projects
    todos = getTodosFromLocalStorage();     // Load existing todos

    // If no projects exist, create and save the default one
    if (projects.length === 0) {
        const defaultProj = Project(defaultProjectId, "Default Project", new Date().toISOString());
        projects.push(defaultProj);
        saveProjectsToLocalStorage(); // Save the new default project
    } else {
        // Ensure defaultProjectId is correctly set if projects were loaded
        const foundDefault = projects.find(p => p.project_name === "Default Project");
        if (foundDefault) {
            defaultProjectId = foundDefault.id;
        } else {
            // If default project somehow got deleted, create a new one
            const newDefault = Project(defaultProjectId, "Default Project", new Date().toISOString());
            projects.unshift(newDefault); // Add to beginning
            saveProjectsToLocalStorage();
        }
    }
}

// Call initializeData immediately when logic.js loads
initializeData();

// --- CRUD Operations ---

function createProject(name) {
    const newProjectId = crypto.randomUUID();
    const newProject = Project(newProjectId, name, new Date().toISOString());
    projects.push(newProject);
    saveProjectsToLocalStorage(); // Save projects array after adding
    return newProject;
}

function createTodo(title, description, dueDate, priority, completed, projectId) {
    const newTodoId = crypto.randomUUID();
    const assignedProjectId = projectId || defaultProjectId; // Fallback to default
    const newTodo = TodoItem(newTodoId, title, description, dueDate, priority, completed, assignedProjectId);

    todos.push(newTodo);
    saveTodosToLocalStorage(); // Save todos array after adding
    return newTodo;
}

// New function to update a todo's properties (e.g., 'completed' status)
function updateTodo(id, updates) {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex > -1) {
        todos[todoIndex] = { ...todos[todoIndex], ...updates };
        saveTodosToLocalStorage(); // Save todos array after updating
        return true;
    }
    return false;
}

function getProjects() {
    return [...projects]; 
}

function getTodos(projectId = null) { 
    if (projectId) {
        return todos.filter(todo => todo.projectId === projectId);
    }
    return [...todos]; 
}

function populateProjectsOptions() {
    const projectSelect = document.querySelector('#todo-project');
    if (!projectSelect) return;

    projectSelect.innerHTML = '';
    


    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.project_name;
        projectSelect.appendChild(option);
    });
    projectSelect.value = defaultProjectId;
}

function deleteTodo(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index > -1) {
        todos.splice(index, 1);
        saveTodosToLocalStorage();
        return true;
    }
    return false;
}

function calculateDueStatus(dueDate) {
    if (!dueDate) return 'no-due-date';
    
    const date = parseISO(dueDate);
    
    if (isPast(date)) {
        return 'overdue';
    } else if (isToday(date)) {
        return 'due-today';
    } else if (isTomorrow(date)) {
        return 'due-tomorrow';
    } else if (isWithinNextWeek(date)) {
        return 'due-soon';
    }
    return 'due-later';
}

// Helper function to check if within next week
function isWithinNextWeek(date) {
    const nextWeek = addDays(new Date(), 7);
    return date <= nextWeek;
}

export {
    createProject,
    createTodo,
    updateTodo,
    getProjects,
    getTodos,
    populateProjectsOptions,
    defaultProjectId,
    deleteTodo
};