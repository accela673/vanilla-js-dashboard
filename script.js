function updateClock() {
  const timeEl = document.getElementById("time");
  const now = new Date();
  const hours = now.getHours().toString().padStart(2,'0');
  const minutes = now.getMinutes().toString().padStart(2,'0');
  const seconds = now.getSeconds().toString().padStart(2,'0');
  timeEl.textContent = `${hours}:${minutes}:${seconds}`;
}


setInterval(updateClock, 1000);
updateClock(); // вызов сразу, чтобы не ждать секунду

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskUl = document.getElementById("tasksUl");
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onchange = saveTasks; // сохраняем статус при изменении

  const span = document.createElement("span");
  span.textContent = taskText;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskUl.appendChild(li);
  taskInput.value = "";

  saveTasks(); // сохраняем после добавления
}

function saveTasks() {
  const taskUl = document.getElementById("tasksUl");
  const tasks = [];
  taskUl.querySelectorAll("li").forEach(li => {
    const text = li.querySelector("span").textContent;
    const done = li.querySelector("input").checked;
    tasks.push({ text, done });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 3️⃣ Загрузка задач из localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const taskUl = document.getElementById("tasksUl");

  tasks.forEach(task => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = saveTasks;

    const span = document.createElement("span");
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      li.remove();
      saveTasks();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskUl.appendChild(li);
  });
}

window.onload = loadTasks;