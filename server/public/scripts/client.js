console.log('JS is sourced!');
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Global Variables
let valid = true;
let taskForm = document.getElementById('task-form');

// GET route
function getTasks() {
    console.log("in getTasks");
    // axios call to server to get koalas
    axios({
        method: 'GET',
        url: '/todos'
    }).then(function (response) {
        console.log('getTasks() response', response.data);
        allTasks = response.data;
        renderTasks(allTasks);
    }).catch(function (error) {
        console.log('error in GET', error);
    });
};

// POST route
function addTask(event) {
    event.preventDefault();
    const taskText = document.getElementById('task-text').value;
    valid = true;
    if (!isValid(taskText)) {
        let errorInput = document.getElementById('task-text');
        errorInput.classList.add('error-validation');
        let errorValidation = document.getElementById('error');
        errorValidation.innerHTML = `<p id="error-text">Please fill out the required fields.</p>`
        return;
    } else {
        let errorInput = document.getElementById('task-text');
        errorInput.classList.remove('error-validation');
        let errorValidation = document.getElementById('error');
        errorValidation.innerHTML = '';
    }

    console.log('went past the return')
    let taskToSubmit = {
        text: taskText
    }

    axios({
        method: `POST`,
        url: `/todos`,
        data: taskToSubmit
    })
        .then((response) => {
            taskForm.reset();
            getTasks();

        })
        .catch((error) => {
            console.log(`Error in POST /todos response:`, error)
        })
};

// PUT route
function statusChange(taskId) {
    let timestamp = Date.now();
    console.log(timestamp);
    let convertedTimestamp = new Date(timestamp) ;
    console.log(convertedTimestamp);
    let taskToUpdate = {
        isComplete: 'true',
        completedAt: convertedTimestamp,

    }
    
    axios({
        method: "PUT",
        url: `/todos/${taskId}`,
        data: taskToUpdate

    })
        .then((response) => {
            getTasks();
        })
        .catch((error) => {
            console.log("statusChange() error:", error);
        });
};

// DELETE route
function deleteTask(taskId) {
    axios({
        method: `DELETE`,
        url: `/todos/${taskId}`,
    })
        .then(
            (response) => {
                getTasks()
            })
        .catch((error) => {
            console.log("Error in DELETE /todos: ", error);
        });
};

// HELPER functions
function renderTasks(tasks) {
    const tasksTable = document.getElementById('to-do-list');

    tasksTable.innerHTML = '';

    for (let taskItem of tasks) {
        let completeStatus;
        if (taskItem.isComplete) {
            completeStatus = `<i class="bi-check-circle-fill" style="font-size: 1.5rem; color: green;"></i>`
        } else {
            completeStatus = `<i class="bi-x-circle-fill" style="font-size: 1.5rem; color: red;"></i>`
        }
        let convertedString = new Date(taskItem.completedAt);
        let dateString = convertedString.toDateString();
        let timeString = convertedString.toTimeString();
        console.log(taskItem.completedAt);
        if (taskItem.completedAt === null) {
            tasksTable.innerHTML += `
            <tr data-testid="toDoItem" id="to-do-item-${taskItem.id}">
                <td>${completeStatus}</td>
                <td>${taskItem.id}</td>
                <td contenteditable="true" id="to-do-text-${taskItem.id}">${taskItem.text}</td>
                <td><button class="btn btn-secondary btn-sm" onclick="updateTask(${taskItem.id})">Edit</button></td>
                <td><button id="complete-btn-${taskItem.id}"  class="btn btn-success btn-sm" data-testid="completeButton" onclick="statusChange(${taskItem.id})">Complete?</button></td>
                <td><button data-testid="deleteButton" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="${taskItem.id}">Delete</button></td>
            </tr>
            `
        } else {
            tasksTable.innerHTML += `
            <tr data-testid="toDoItem" id="to-do-item-${taskItem.id}">
                <td>${completeStatus}</td>
                <td>${taskItem.id}</td>
                <td contenteditable="true" id="to-do-text-${taskItem.id}">${taskItem.text}</td>
                <td><button class="btn btn-secondary btn-sm" onclick="updateTask(${taskItem.id})">Edit</button></td>
                <td>${dateString} <br />
                ${timeString}</td>
                <td><button data-testid="deleteButton" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="${taskItem.id}">Delete</button></td>
            </tr>
            `
        }
        ;

        if (taskItem.isComplete){
            let toDoItem = document.getElementById(`to-do-item-${taskItem.id}`);
            toDoItem.classList.add('completed');
        }
    };
};

function isValid(text) {
    if (text.length === 0) {
        valid = false;
    }
    return valid;
};

// EXTRA FEATURES functions
function editAlert(status, id) {
    let alertMsg = document.getElementById('alert');
    alertMsg.style.diplay = "block";
    alertMsg.classList.add('p-2');
    if (status === 'success') {
        alertMsg.innerHTML = `<div id="success"><p id="alert-text"><i class="bi-check-circle-fill"></i> Task ${id} was updated successfully!</p><button class="btn btn-sm" onclick="removeAlert()"><i class="bi-x-lg"></i></button></div>`
        console.log('Alert Message is:', status)
    } else if (status === 'error') {
        console.log('Error displaying', status)
        alertMsg.innerHTML = `<div id="error"><p id="alert-text"><i class="bi-check-circle-fill"></i> Task ${id} was updated successfully!</p><button class="btn btn-sm" onclick="removeAlert()"><i class="bi-x-lg"></i></button></div>`
    }

}

function removeAlert() {
    let alertMsg = document.getElementById('alert');
    alertMsg.innerHTML = '';
}


function updateTask(taskId) {
    let newTaskText = document.getElementById(`to-do-text-${taskId}`).innerText

    let updateObj = {
        newTaskText: newTaskText,
    }

    console.log(`Task update info to PATCH:`, updateObj)

    axios({
        method: `PATCH`,
        url: `/todos/${taskId}`,
        data: updateObj
    }).then((response) => {
        getTasks();
        editAlert('success', `${taskId}`);
    }).catch((error) => {
        console.log('Something went wrong with the Patch');
        editAlert('error')
    })
}

const exampleModal = document.getElementById('exampleModal')
if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const taskNum = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = exampleModal.querySelector('.modal-title')
    const modalTask = exampleModal.querySelector('.modal-body')

    modalTitle.textContent = `Delete Task ${taskNum} from To-Do List`
    modalTask.textContent = `Are you sure you want to delete task ${taskNum} from the database?`

    const deleteButton = exampleModal.querySelector('#delete-btn');
    
    deleteButton.addEventListener('click',() => {
        console.log('TaskNum is:', taskNum);
        deleteTask(taskNum);
    })

})
}
// FUNCTION CALLS
getTasks();