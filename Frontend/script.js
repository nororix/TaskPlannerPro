//Cargamos por completo el DOM:

document.addEventListener('DOMContentLoaded', () =>{
const taskform = document.getElementById("new-task");
const taskList = document.getElementById("tasks-container");

let table;
let tbody;

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

    //Botón para eliminar tareas y eventos 
    const cellActions = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.classList.add("delete-btn");
    

    deleteBtn.addEventListener("click", async () => {

        const token = localStorage.getItem('token')
        await fetch (`http://localhost:3000/api/tasks/${task.id}`,{
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
     // Eliminar del DOM
    row.remove();
});

cellActions.appendChild(editBtn);
cellActions.appendChild(deleteBtn);
row.appendChild(cellActions);


    tbody.appendChild(row);
};

const loadTasks = async () => {
    try{
    const res = await fetch("http://localhost:3000/api/tasks");
    const tasks = await res.json();
    tasks.forEach(task => addTask(task));
    }catch(err){
        console.error("Error al cargar las tareas:", err);
    }
};

//Capturamos los valores del formulario:
taskform.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskType = document.querySelector('input[name="task-type"]:checked').value;
    const taskName = document.getElementById ("task-title").value;
    const taskDate= document.getElementById ("task-date").value;
    const taskDesc = document.getElementById("task-desc").value;
    const taskStats = document.getElementById("task-stats").value;

//Guardamos los valores en un objeto para crear la nueva tarea:
const newtask = {
    type: taskType,
    title: taskName,
    date: taskDate,
    desc: taskDesc,
    status: taskStats,
}

//Editar las tareas/eventos 
const editingId = taskform.getAttribute("data-editing-id");

if(editingId){
    try{
        const token = localStorage.getItem('token');

        const res = await fetch (`http://localhost:3000/api/tasks/${editingId}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'applications/json',
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(newtask)
        });
        const updatedTask = await res.json();
        taskform.removeAttribute("data-editing-id");
        tbody.innerHTML ="";
        loadTasks();
    }catch (err){
        console.error("Error al actualizar la tarea:", err);
    }
}else{
    try{
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/tasks',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify(newtask)
        });
        const createdTask = await res.json();
        createdTask.id = createdTask._id;

        addTask(createdTask);
    }catch{
        console.error("Error al crear la tarea: ", err);
    }
}

taskform.reset();
});

loadTasks();

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

//Visibilidad de los formularios de registro y login 
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
  
showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});
  
showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    });

//Conectar formularios de registro y login con el backend
document.getElementById('register-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    //Formulario de registro
    const username = document.getElementById('register-name').value;
    const password = document.getElementById('register-password').value;

    const res = await fetch ('http://localhost:3000/api/auth/login',{
        method: 'POST',
        headers: {'Content-Type': 'applications/json'},
        body: JSON.stringify({username, password})
    });

    const data = await res.json();
    alert(data.message ||'Registro completado');
});
    //Formulario de Login
document.getElementById('login-form').addEventListener('submit', async (e)=>{
    const username = document.getElementById('login-form__username').value;
    const password = document.getElementById('login-form__password').value;

    const res = await fetch ('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({username, password})
    });
    
    const data = await res.json();
    if(res.ok){
        localStorage.setItem('token', data.token);
        alert('Login exitoso');
    }else{
        alert(data.message || 'Error en login');
    }
});

//Gestión de la subida de archivos
document.getElementById('upload-form').addEventListener('submit', async (e)=>{
    e.preventDefault();

    const file = document.getElementById('file').files[0];
    if(!file){
        alert ('Por favor selecciona un archivo');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');

    try{
        const res =await fetch('http://localhost:3000/upload',{
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();
        if(res.ok){
            alert('Archivo subido con éxito');
            console.log('Archivo: ', data.file);
        }else{
            alert(data.message || 'Error al subir el archivo');
        }
    }catch (err){
        console.log('Error en la subida: ', err);
    }
})

});



