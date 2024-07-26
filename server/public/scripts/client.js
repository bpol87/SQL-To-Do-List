console.log('JS is sourced!');

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
function addTask() {
const taskText = document.getElementById('task-text').value;

let taskToSubmit = {
    text: taskText
}

axios({
    method: `POST`,
    url: `/todos`,
    data: taskToSubmit
}) 
.then((response) => {
    getTasks();
}) 
.catch((error) => {
    console.log(`Error in POST /todos response:`, error)
})
};

// PUT route

// DELETE route

// HELPER functions


function renderTasks(tasks) {
    const tasksTable = document.getElementById('to-do-list');

    tasksTable.innerHTML = '';

    for (let taskItem of tasks) {
        let completeStatus;
        if (taskItem.isComplete) {
            completeStatus = '✅'
        } else {
            completeStatus = '❌'
        }

        tasksTable.innerHTML += `
            <tr data-testid="toDoItem">
                <td>${completeStatus}</td>
                <td>${taskItem.id}</td>
                <td contenteditable="true">${taskItem.text}</td>
                <td><button>Edit Task</button></td>
                <td><button data-testid="completeButton">Complete?</button></td>
                <td><button data-testid="deleteButton">Delete</button></td>
            </tr>
    `;
    };
};

// EXTRA FEATURES functions

// FUNCTION CALLS
getTasks();