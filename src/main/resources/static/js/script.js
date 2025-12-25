let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Elements
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

const totalTasksEl = document.getElementById("totalTasks");
const pendingTasksEl = document.getElementById("pendingTasks");
const completedTasksEl = document.getElementById("completedTasks");

const notificationBell = document.getElementById("notificationBell");
const notifyCount = document.getElementById("notifyCount");

// Ask permission ON USER LOAD
document.addEventListener("DOMContentLoaded", () => {
    const tasks = window.tasks || [];
    const notifList = document.getElementById("notifList");
    const notifCount = document.getElementById("notifCount");

    const pendingTasks = tasks.filter(t => t.status === "PENDING");

    notifCount.innerText = pendingTasks.length;

    pendingTasks.forEach(task => {
        const li = document.createElement("li");
        li.innerText = task.title;
        notifList.appendChild(li);
    });

    document.getElementById("bell").onclick = () => {
        document.getElementById("notifDropdown").classList.toggle("show");
    };
});


// Add task
taskForm.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const date = document.getElementById("date").value;

    if (!title || !date) {
        alert("Title & Date required");
        return;
    }

    tasks.push({
        id: Date.now(),
        title,
        description,
        date,
        completed: false,
        notified: false
    });

    save();
    renderTasks();
    updateStats();
    taskForm.reset();
});

// Render
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `
            <b>${task.title}</b>
            <p>${task.description || ""}</p>
            <small>⏰ ${new Date(task.date).toLocaleString()}</small><br>
            <button onclick="toggleTask(${task.id})">
                ${task.completed ? "Undo" : "Complete"}
            </button>
        `;

        if (task.completed) li.style.opacity = "0.6";
        taskList.appendChild(li);
    });
}

// Toggle
function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    save();
    renderTasks();
    updateStats();
}

// Stats
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Save
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Notification Logic
function startReminderCheck() {
    setInterval(() => {
        const now = new Date();
        let pendingNotify = 0;

        tasks.forEach(task => {
            const taskTime = new Date(task.date);

            if (
                !task.completed &&
                !task.notified &&
                taskTime - now <= 5 * 60 * 1000 &&
                taskTime > now
            ) {
                showNotification(task);
                task.notified = true;
            }

            if (!task.completed) pendingNotify++;
        });

        notifyCount.textContent = pendingNotify;
        save();
    }, 60000); // every minute
}

// Show browser notification
function showNotification(task) {
    if (Notification.permission === "granted") {
        new Notification("📚 Task Reminder", {
            body: `${task.title} is due soon!`
        });
    }
}
function filterTasks(status) {
    const tasks = document.querySelectorAll(".task-card");

    tasks.forEach(task => {
        const taskStatus = task.getAttribute("data-status");

        if (status === "ALL" || taskStatus === status) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
}
function checkDeadlines() {
    const now = new Date();

    window.tasks.forEach(task => {
        if (task.status === "PENDING") {
            const due = new Date(task.dueDate);

            if (due <= now && !sessionStorage.getItem(task.id)) {
                new Notification("⏰ Task Deadline", {
                    body: `Task "${task.title}" is due now!`
                });
                sessionStorage.setItem(task.id, "notified");
            }
        }
    });
}

if ("Notification" in window) {
    Notification.requestPermission();
}

setInterval(checkDeadlines, 60000);
checkDeadlines();
