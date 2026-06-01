// Application State
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");
        li.classList.add("task-item");
        li.dataset.id = task.id;

        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>

            <div class="actions">
                <button class="complete-btn">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Create Task
function addTask() {

    const text = taskInput.value.trim();

    if (!text) return;

    const newTask = {
        id: Date.now(),
        text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

// Add Button Event
addBtn.addEventListener("click", addTask);

// Enter Key Event
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Event Delegation
taskList.addEventListener("click", (e) => {

    const li = e.target.closest(".task-item");

    if (!li) return;

    const id = Number(li.dataset.id);

    // Delete
    if (e.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();
    }

    // Complete
    if (e.target.classList.contains("complete-btn")) {

        const task = tasks.find(task => task.id === id);

        if (task) {
            task.completed = !task.completed;
        }

        saveTasks();
        renderTasks();
    }

    // Edit
    if (e.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        const updatedText = prompt(
            "Edit Task:",
            task.text
        );

        if (
            updatedText !== null &&
            updatedText.trim() !== ""
        ) {
            task.text = updatedText.trim();
        }

        saveTasks();
        renderTasks();
    }
});

// Filter Buttons
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// Initial Render
renderTasks();