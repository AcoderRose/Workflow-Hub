// Grabs the nextId and tasks from Local Storage
// If nothing is entered, it will form an empty array.
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;
console.log(nextId);
// Create elements for to do, in progress, and done divs.
const $toDoEl = $("#todo-cards");
const $inProgressEl = $("#in-progress");
const $doneEl = $("#done");

// Todo: create a function to generate a unique task id
function generateTaskId() {
  // Checks if array is empty.
  nextId++;
  // Adds 1 to nextId
  localStorage.setItem("nextId", nextId);
  console.log(nextId);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  //Creates card element dynamically.
  const $cardEl = $("<div>").addClass("card drag-box");
  const $cardBodyEl = $("<div>").attr("class", "card-body");
  const $cardTitleEl = $("<h5>").attr("class", "card-heading");
  const $cardTextEl = $("<p>").attr("class", "card-text");
  const $cardDate = $("<p>").attr("class", "card-date");
  const $cardButtonEl = $("<a>")
    .attr("href", "#")
    .attr("class", "btn btn-primary")
    .text("Delete")
    .attr("id", task.id);

  $cardTitleEl.text(task.title);

  $cardTextEl.text(task.taskData);
  $cardDate.text(task.date);

  // Generate a card by adding elements to the card body.
  $cardBodyEl.append($cardTitleEl, $cardTextEl, $cardDate, $cardButtonEl);

  // Insert all elements into the card using the cardBodyEl.
  $cardEl.append($cardBodyEl);

  // To do section has card added into it.
  $toDoEl.append($cardEl);
  // Creates draggable card
  $(".drag-box").draggable({
    opacity: 0.7,
    zIndex: 100,
    // Visual clone card created when dragging.
    helper: function (e) {
      // Locates draggable parent, if a parent element is selected.
      const original = $(e.target).hasClass(".drag-box")
        ? $(e.target)
        : $(e.target).closest(".drag-box");
      // Original card width is matched
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  //Form created variables
  const titleEl = document.querySelector("#title-of-task");
  const dateEl = document.querySelector("#task-date");
  const taskDataEl = document.querySelector("#task-text");

  // New taskId is created by called function generateTaskId
  // New task is stored by created object

  if (taskList === null) {
    taskList = [];
  }
  const taskObj = {
    title: titleEl.value,
    date: dateEl.value,
    taskData: taskDataEl.value,
    id: generateTaskId(),
    status: "To Do",
  };

  // Array is filled with current task object.
  taskList.push(taskObj);

  // Local Storage is filled with updated array of objects.
  localStorage.setItem("tasks", JSON.stringify(taskList));

  //createTaskCard function called
  createTaskCard(taskObj);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  $("#saveBtn").on("click", handleAddTask);

  $("#task-date").datepicker();
});
