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
  // const backgroundColor = getRandomColor(); // Get random background color for text
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

// Create a function to render the task list and make cards draggable
function renderTaskList() {
  const todoLane = $("#todo-cards");
  todoLane.empty();

  const inProgressLane = $("#in-progress-cards");
  inProgressLane.empty();

  const doneLane = $("#done-cards");
  doneLane.empty();
  // create variable for done lane

  for (let task of taskList) {
    if (task.status === "to-do") {
      todoLane.append(createTaskCard(task));
    } else if (task.status === "in-progress") {
      inProgressLane.append(createTaskCard(task));
    } else if (task.status === "done") 
      doneLane.append(createTaskCard(task));
  }


  // ? Use JQuery UI to make task cards draggable
  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Create a function to handle adding a new task
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
    // Clear input fields
    $("#task-title").val("");
    $("#task-description").val("");
    $("#task-deadline").val("");
  }
}

// // Create a function to handle deleting a task
function handleDeleteTask(event) {
  event.preventDefault();
  const taskId = $(this).attr("data-task-id");

  taskList = taskList.filter((task) => task.id !== parseInt(taskId));

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList(); // Re-render task list after deleting a task
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // ? Get the project id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  // ? Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of taskList) {
    // ? Find the project card by the `id` and update the project status.
    if (task.id === parseInt(taskId)) {
      task.status = newStatus;
    }
  }
  // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and enable datepicker
$(document).ready(function () {
  renderTaskList();

  $("#add-task-form").on("submit", handleAddTask);

  // Make all task lanes droppable
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
});

// // Enable datepicker on the deadline input field outside the document ready function
$("#task-deadline").datepicker();
