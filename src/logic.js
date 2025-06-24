let todos = []; // Master array for all todo items
let projects = []; // Master array for all project items

// --- Data Model Factories ---
const TodoItem = (id, title, description, dueDate, priority, completed, projectId) => {
    // Renamed 'complete' to 'completed' for consistency and clarity
    return { id, title, description, dueDate, priority, completed, projectId };
};

const Project = (id, project_name, createdOn) => {
    // Projects should NOT contain their own 'todos' array here.
    // Todos will be linked by their 'projectId'.
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
    return false; // Todo not found
}

function getProjects() {
    return [...projects]; // Return a shallow copy
}

function getTodos(projectId = null) { // Default to null for projectId
    if (projectId) {
        return todos.filter(todo => todo.projectId === projectId);
    }
    return [...todos]; // Return all todos if no specific project is requested
}

// --- UI-related function (still in logic.js for convenience) ---
function populateProjectsOptions() {
    const projectSelect = document.querySelector('#todo-project');
    if (!projectSelect) return;

    projectSelect.innerHTML = '';
    // Add a default "Select Project" option if desired
    // const defaultOption = document.createElement('option');
    // defaultOption.value = '';
    // defaultOption.textContent = 'Select Project';
    // projectSelect.appendChild(defaultOption);


    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.project_name;
        projectSelect.appendChild(option);
    });
    // Set the default project in the dropdown if it's there
    projectSelect.value = defaultProjectId;
}


export {
    createProject,
    createTodo,
    updateTodo, // Export this new function!
    getProjects,
    getTodos,
    populateProjectsOptions,
    defaultProjectId
};