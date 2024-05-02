// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Create a function to generate a unique task id
function generateTaskId() {
  const id = nextId;
  nextId++;
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return id;
}

// let lastColor = ""; // Global variable to store the last color used

// function getRandomColor() {
//   const colors = [
//     "#FF0000",
//     "#ADD8E6",
//     "#E6E6FA",
//     "#FFFF00",
//     "#FFA500",
//     "#FFCCFF",
//     "#CCFFCC",
//     "#E0E0FF",
//     "#A8E3F1",
//   ];

//   let newColor = lastColor;
//   while (newColor === lastColor) {
//     newColor = colors[Math.floor(Math.random() * colors.length)];
//   }

//   lastColor = newColor;
//   return newColor;
// }

// Create a function to create a task card with a background color for the text
function createTaskCard(task) {
  const card = $("<div>")
    .addClass("card w-75 task-card draggable my-3")
    .attr("data-task-id", task.id);
 
  const title = $("<h3>").text(task.title);

  const description = $("<p>").text(task.description);

  const deadline = $("<p>").text("Deadline: " + task.deadline);

  const deleteButton = $("<button>")
    .text("Delete")
    .addClass("btn btn-danger delete-task-btn")
    .attr("data-task-id", task.id);
  // Event listener for delete button
  deleteButton.on("click", handleDeleteTask);

  card.append(title, description, deadline, deleteButton);

  return card;
}

function renderTaskList() {
  const todoLane = $("#todo-cards");
  todoLane.empty();

  const inProgressLane = $("#in-progress-cards");
  inProgressLane.empty();

  const doneLane = $("#done-cards");
  doneLane.empty();
  

  for (let task of taskList) {
    if (task.status === "to-do") {
      todoLane.append(createTaskCard(task));
    } else if (task.status === "in-progress") {
      inProgressLane.append(createTaskCard(task));
    } else if (task.status === "done") 
      doneLane.append(createTaskCard(task));
  }


  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,
    helper: function (e) {
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

function handleAddTask(event) {
  event.preventDefault();

  const title = $("#task-title").val();
  const description = $("#task-description").val();
  const deadline = $("#task-deadline").val();

  if (title && deadline) {
    const newTask = {
      id: generateTaskId(),
      title: title,
      description: description,
      deadline: deadline,
      status: "to-do", // Initial status
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
    $("#task-title").val("");
    $("#task-description").val("");
    $("#task-deadline").val("");
  }
}

function handleDeleteTask(event) {
  event.preventDefault();
  const taskId = $(this).attr("data-task-id");

  taskList = taskList.filter((task) => task.id !== parseInt(taskId));

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList(); // Re-render task list after deleting a task
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable[0].dataset.taskId;

  const newStatus = event.target.id;

  for (let task of taskList) {
    if (task.id === parseInt(taskId)) {
      task.status = newStatus;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

$(document).ready(function () {
  renderTaskList();

  $("#add-task-form").on("submit", handleAddTask);

  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
});

$("#task-deadline").datepicker();
