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

async function fetchWeather() {
  const apiKey = "YOUR_API_KEY"; // replace with your API key
  const weatherDiv = document.getElementById("weatherInfo");
  weatherDiv.textContent = "Loading...";

  if (!navigator.geolocation) {
    weatherDiv.textContent = "Geolocation is not supported.";
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const exclude = "minutely,alerts"; // optional
    const units = "metric"; // Celsius
    const lang = "en"; // language

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&lang=${lang}&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();

      const temp = Math.round(data.current.temp);
      const description = data.current.weather[0].description;
      const icon = data.current.weather[0].icon;

      weatherDiv.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
        ${temp}°C, ${description}
      `;
    } catch (error) {
      weatherDiv.textContent = "Unable to load weather.";
      console.error("Weather error:", error);
    }
  }, (error) => {
    weatherDiv.textContent = "Unable to get location.";
    console.error("Geolocation error:", error);
  });
}

fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000);
window.onload = loadTasks;