//Cargamos por completo el DOM:

document.addEventListener('DOMContentLoaded', () =>{
const taskform = document.getElementById("new-task");
const taskList = document.getElementById("tasks-container");

let table;
let tbody;

const loadTasksFromStorage = () =>{
   const tasks = JSON.parse (localStorage.getItem('tasks')) || [];
   tasks.forEach(task=>addTask(task));
}
//Definimos la funcion para crear la tabla en la que se mostrarán las tareas
const addTask =(task)=>{
    if(!table){
        table = document.createElement ("table");
        table.classList.add("task-table");

        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");

        ["Tipo","Nombre", "Fecha de vencimiento", "Descripción de la tarea", "Estado", "Acciones"].forEach(text =>{
            const th = document.createElement("th");
            th.textContent = text;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        tbody = document.createElement("tbody");
        table.appendChild(tbody);

        taskList.appendChild(table);
    };

//Creamos la tabla donde irán las tareas
    const row = document.createElement ("tr");

    const cellType = document.createElement("td");
    cellType.textContent = task.type;
    cellType.setAttribute('data-label','Tipo');

    const cellTitle = document.createElement("td");
    cellTitle.textContent = task.title;
    cellTitle.setAttribute('data-label','Nombre');

    const cellDate = document.createElement ("td");
    cellDate.textContent = task.date;
    cellDate.setAttribute('data-label','Fecha de vencimiento');

    const cellDesc = document.createElement ("td");
    cellDesc.textContent = task.desc;
    cellDesc.setAttribute('data-label','Descripción de la tarea');

    const cellStatus = document.createElement ("td");
    cellStatus.textContent = task.status;
    cellStatus.setAttribute('data-label','Estado');

    row.appendChild(cellType);
    row.appendChild(cellTitle);
    row.appendChild(cellDate);
    row.appendChild(cellDesc);
    row.appendChild(cellStatus);

    //Botón para eliminar tareas y eventos 
    const cellActions = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.classList.add("delete-btn");

    //Botón para editar tareas y eventos
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", ()=>{
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-date").value = task.date;
        document.getElementById("task-desc").value = task.desc;
        document.getElementById("task-stats").value= task.status;

        taskform.setAttribute("data-editing-id",task.id);
    });

    deleteBtn.addEventListener("click", () => {
     // Eliminar del DOM
    row.remove();

    // Eliminar del localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(taskItem => taskItem.id !== task.id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
});

cellActions.appendChild(editBtn);
cellActions.appendChild(deleteBtn);
row.appendChild(cellActions);


    tbody.appendChild(row);
};

//Capturamos los valores del formulario:
taskform.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskType = document.querySelector('input[name="task-type"]:checked').value;
    const taskName = document.getElementById ("task-title").value;
    const taskDate= document.getElementById ("task-date").value;
    const taskDesc = document.getElementById("task-desc").value;
    const taskStats = document.getElementById("task-stats").value;

//Editar las tareas/eventos 
const editingId = taskform.getAttribute("data-editing-id");

if(editingId){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(t=>{
        if(t.id==editingId){
            return{
                ...t,
                title: taskName, 
                date: taskDate,
                desc: taskDesc,
                status: taskStats
            };
        }
        return t;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskform.removeAttribute("data-editing-id");
    tbody.innerHTML="";
    tasks.forEach(task=>addTask(task));
    return;

}


//Guardamos los valores en un objeto para crear la nueva tarea:
const newtask = {
    id:Date.now(),
    type: taskType,
    title: taskName,
    date: taskDate,
    desc: taskDesc,
    status: taskStats,
}

const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.push(newtask);
localStorage.setItem('tasks', JSON.stringify(tasks));


addTask(newtask);
});

loadTasksFromStorage();

//Llamada a la API para obtener el tiempo de hoy 
const getWeather = async () => {
  const apiKey = "9c07c7a4e4cf01f0fa2073a775da81b9";
  const city = "Madrid";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudo obtener el clima");

    const data = await res.json();

    const weatherDiv = document.getElementById("weather-info");
    weatherDiv.innerHTML = `
      <p><strong>${data.name}</strong></p>
      <p>${data.weather[0].description}</p>
      <p>🌡️ Temp: ${data.main.temp}°C</p>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icono clima">
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("weather-info").textContent = "No se pudo cargar el clima.";
  }
};

getWeather();

//Llamada a la API de consejos:
const getAdvice = async () => {
    const adviceUrl = 'https://api.adviceslip.com/advice';

    try {
        const response = await fetch(adviceUrl);
        const data = await response.json();

        // Mostrar el consejo en el div correspondiente
        const adviceContainer = document.getElementById('advice-info');
        adviceContainer.innerHTML = '';

        const adviceText = document.createElement('p');
        adviceText.textContent = `"${data.slip.advice}"`;
        adviceContainer.appendChild(adviceText);
    } catch (error) {
        console.error("Error fetching advice:", error);
        document.getElementById('advice-info').textContent = "Error al cargar el consejo.";
    }
};

// Llamamos a la función para cargar un consejo
getAdvice();



});



