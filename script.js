function updateClock() {
  const timeEl = document.getElementById("time");
  const now = new Date();
  const hours = now.getHours().toString().padStart(2,'0');
  const minutes = now.getMinutes().toString().padStart(2,'0');
  const seconds = now.getSeconds().toString().padStart(2,'0');
  timeEl.textContent = `${hours}:${minutes}:${seconds}`;
}


setInterval(updateClock, 1000);
updateClock(); 

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskUl = document.getElementById("tasksUl");
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onchange = saveTasks; 

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

  saveTasks(); 
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

const apiKey = "83779411609b5b8c36e020d8f7c095c6"; 
const lat = 42.8746; 
const lon = 74.5698;

async function fetchWeather() {
  const weatherDiv = document.getElementById("weatherInfo");
  weatherDiv.textContent = "Loading...";

  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=${apiKey}`;

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
    weatherDiv.textContent = "Unable to load weather";
    console.error("Weather error:", error);
  }
}

async function loadCurrency() {
  const url = encodeURIComponent("https://www.nbkr.kg/XML/daily.xml");
  const proxy = `https://api.allorigins.win/get?url=${url}`;

  try {
    const response = await fetch(proxy);
    const data = await response.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "application/xml");

    const currencies = ["USD", "EUR", "CNY"];
    let html = "<ul>";

    currencies.forEach(code => {
      const node = xml.querySelector(`Currency[ISOCode="${code}"] Value`);
      if (node) {
        html += `<li>${code}: ${node.textContent} KGS</li>`;
      }
    });

    html += "</ul>";
    document.getElementById("currency").innerHTML = "<h3>Currency</h3>" + html;

  } catch (error) {
    document.getElementById("currency").innerHTML = "Error loading rates";
    console.error(error);
  }
}

loadCurrency();

fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000);
window.onload = loadTasks;