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

// Create a function to create a task card
function createTaskCard(task) {
  const card = $("<div>").addClass("task-card").attr("id", "task-" + task.id);
  const title = $("<h3>").text(task.title);
  const description = $("<p>").text(task.description);
  const deadline = $("<p>").text("Deadline: " + task.deadline);
  card.append(title, description, deadline);
  return card;
}

// Create a function to render the task list and make cards draggable
function renderTaskList() {
  $(".task-lane").empty(); // Clear existing tasks

  // Loop through taskList and create task cards
  taskList.forEach(function (task) {
    const card = createTaskCard(task);
    $("#lane-" + task.status).append(card);
  });

  // Make task cards draggable
  $(".task-card").draggable({
    revert: true,
    revertDuration: 0,
  });
}

// // Create a function to handle adding a new task
// function handleAddTask(event) {
//   event.preventDefault();

//   const title = $("#task-title").val();
//   const description = $("#task-description").val();
//   const deadline = $("#task-deadline").val();

//   if (title && deadline) {
//     const newTask = {
//       id: generateTaskId(),
//       title: title,
//       description: description,
//       deadline: deadline,
//       status: "not-started", // Initial status
//     };

//     taskList.push(newTask);
//     localStorage.setItem("tasks", JSON.stringify(taskList));

//     renderTaskList(); // Re-render task list after adding a new task

//     // Clear input fields
//     $("#task-title").val("");
//     $("#task-description").val("");
//     $("#task-deadline").val("");
//   }
// }
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
        status: "not-started", // Initial status
      };
  
      taskList.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(taskList));
  
      // Only render the new task in the "To Do" column
      const card = createTaskCard(newTask);
      $("#todo-cards").append(card); // Append to "todo-cards" specifically
  
      // Make the new task card draggable
      card.draggable({
        revert: true,
        revertDuration: 0,
      });
  
      // Clear input fields
      $("#task-title").val("");
      $("#task-description").val("");
      $("#task-deadline").val("");
    }
  }
  

// Create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).closest(".task-card").attr("id").split("-")[1];
  taskList = taskList.filter(task => task.id != taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList(); // Re-render task list after deleting a task
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr("id").split("-")[1];
  const newStatus = $(this).attr("id").split("-")[1];

  // Update task status in taskList
  const taskIndex = taskList.findIndex(task => task.id == taskId);
  taskList[taskIndex].status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList(); // Re-render task list after updating task status
}

// // When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// $(document).ready(function () {
//   renderTaskList();

//   $("#add-task-form").on("submit", handleAddTask);
//   $(".task-lane").on("click", ".delete-task-btn", handleDeleteTask);
//   $(".task-lane").droppable({
//     accept: ".task-card",
//     drop: handleDrop,
//   });
//   $("#task-deadline").datepicker();
// });
// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
  
    // Initialize Bootstrap modal
    var myModal = new bootstrap.Modal(document.getElementById('formModal'), {
      keyboard: false
    });
  
    // Event listener for "Add Task" button click
    $(".btn-success").on("click", function () {
      // Show the modal
      myModal.show();
    });
  
    $("#add-task-form").on("submit", handleAddTask);
    $(".task-lane").on("click", ".delete-task-btn", handleDeleteTask);
    $(".task-lane").droppable({
      accept: ".task-card",
      drop: handleDrop,
    });
    $("#task-deadline").datepicker();
  });
  