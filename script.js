// Dark Mode
function darkMode() {
  // Toggle body dark mode
  var element = document.body;
  element.classList.toggle("dark-mode");

  // Toggle job-list dark mode
  var todoList = Array.from(document.getElementsByClassName("todo-list"));
  todoList.forEach((todoList) => {
    todoList.classList.toggle("todo-list-dark-mode");
  });

  // Toggle individual jobs dark mode
  var jobs = Array.from(document.getElementsByClassName("job"));
  jobs.forEach((job) => {
    job.classList.toggle("job-dark-mode");
  });

  var jobList = Array.from(document.getElementsByClassName("job-list"));
  jobList.forEach((job) => {
    job.classList.toggle("job-list-dark-mode");
  });
}

const switchButton = document.querySelector('.switch input[type="checkbox"]');
switchButton.addEventListener("change", darkMode);

const input = document.querySelector("#input-todo");
const jobList = document.querySelector(".job-list");

function saveTasksToLocalStorage() {
  const jobs = document.querySelectorAll(".job");
  const tasks = Array.from(jobs).map((job) => ({
    text: job.querySelector(".job-content h4").textContent,
    completed: job.querySelector(".checkbox").checked,
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    createNewTask(task.text, task.completed);
  });
  initializeDragAndDrop();
}

// Add this function to create draggable job items
function createJobElement(taskText) {
  const job = document.createElement("li");
  job.className = "job";
  job.draggable = true; // Make element draggable

  // ...existing job element creation code...

  return job;
}

function createNewTask(text, completed = false) {
  let li = document.createElement("li");
  li.className = "job";
  li.draggable = true; // Make element draggable

  const jobTitle = document.createElement("div");
  jobTitle.className = "job-title";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.checked = completed;
  jobTitle.appendChild(checkbox);

  const jobContent = document.createElement("div");
  jobContent.className = "job-content";
  const p = document.createElement("h4");
  p.textContent = text;
  jobContent.appendChild(p);

  const jobAction = document.createElement("div");
  jobAction.className = "job-action";
  jobAction.innerHTML = `
    <div class="btn-group">
      <button id="edit">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
      <button id="delete">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
  `;
  li.appendChild(jobTitle);
  li.appendChild(jobContent);
  li.appendChild(jobAction);
  jobList.appendChild(li);

  // Add change listener for checkbox
  checkbox.addEventListener("change", saveTasksToLocalStorage);
}

// Add editTask function
function editTask(taskElement) {
  const contentDiv = taskElement.querySelector(".job-content");
  const h4 = contentDiv.querySelector("h4");
  const currentText = h4.textContent;

  // Create input element
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "edit-input";

  // Replace h4 with input
  contentDiv.replaceChild(input, h4);
  input.focus();

  // Save on Enter
  input.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      h4.textContent = input.value;
      contentDiv.replaceChild(h4, input);
      saveTasksToLocalStorage();
    }
  });

  // Save on blur
  input.addEventListener("blur", function () {
    h4.textContent = input.value;
    contentDiv.replaceChild(h4, input);
    saveTasksToLocalStorage();
  });
}

// Modify addTask function
function addTask() {
  if (input.value === "") {
    alert("Please enter a task before add");
    return;
  }
  createNewTask(input.value);
  saveTasksToLocalStorage();
  input.value = "";
}

// Add these drag and drop event listeners after loadTasksFromLocalStorage()
function initializeDragAndDrop() {
  const jobList = document.querySelector(".job-list");
  let draggedItem = null;
  let placeholder = document.createElement("div");
  placeholder.className = "placeholder";

  jobList.addEventListener("dragstart", (e) => {
    if (!e.target.classList.contains("job")) return;
    draggedItem = e.target;
    draggedItem.classList.add("dragging");
    setTimeout(() => {
      draggedItem.style.display = "none";
    }, 0);
  });

  jobList.addEventListener("dragend", (e) => {
    if (!e.target.classList.contains("job")) return;
    e.target.classList.remove("dragging");
    e.target.style.display = "";
    placeholder.remove();
  });

  jobList.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    const closestJob = e.target.closest(".job");
    if (!closestJob) return;

    const rect = closestJob.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const insertAfter = e.clientY > midY;

    if (insertAfter) {
      closestJob.parentNode.insertBefore(placeholder, closestJob.nextSibling);
    } else {
      closestJob.parentNode.insertBefore(placeholder, closestJob);
    }
  });

  jobList.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!draggedItem || !placeholder.parentNode) return;

    placeholder.parentNode.insertBefore(draggedItem, placeholder);
    placeholder.remove();
    saveTasksToLocalStorage();
  });
}

// Update DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.querySelector(".btn-icon");
  addButton.addEventListener("click", addTask);

  const input = document.querySelector("#input-todo");
  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  jobList.addEventListener("click", (e) => {
    const editBtn = e.target.closest("#edit");
    if (editBtn) {
      const jobItem = editBtn.closest(".job");
      if (jobItem) {
        editTask(jobItem);
      }
    }

    const deleteBtn = e.target.closest("#delete");
    if (deleteBtn) {
      const jobDelete = deleteBtn.closest(".job");
      if (jobDelete) {
        jobDelete.remove();
        saveTasksToLocalStorage();
      }
    }
  });

  // Load saved tasks
  loadTasksFromLocalStorage();
  initializeDragAndDrop();
});
