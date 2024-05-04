// Grabs the nextId and tasks from Local Storage. If nothing is entered, it will form an empty array.
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Create elements for to do, in progress, and done divs.
const $toDoEl = $("#cards-todo").addClass(".lane");
const $inProgressEl = $("#cards-in-progress").addClass(".lane");
const $doneEl = $("#cards-done").addClass(".lane");

// Todo: create a function to generate a unique task id
function generateTaskId() {
  //nextId is set to 0 os if local storage is empty the new nextId will be the current Id plus 1.
  nextId++;
  localStorage.setItem("nextId", nextId);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  //Creates task card from object values
  const $cardEl = $("<div>").addClass("card drag-box").attr("id", task.id);
  const $cardBodyEl = $("<div>").attr("class", "card-body");
  const $cardTitleEl = $("<h5>").attr("class", "card-header");
  const $cardDate = $("<p>").attr("class", "card-date");
  const $cardTextEl = $("<p>").attr("class", "card-text");
  const $cardButtonEl = $("<a>")
    .attr("href", "#")
    .attr("class", "btn btn-primary")
    .text("Delete")
    .attr("id", task.id);

  // Created cardState function to return the class depending on task state: to do, in progress, or done.
  const backgroundCard = cardState(task.date);

  $cardEl.addClass(backgroundCard);

  //Pushes text from the task object into corresponding elements.
  $cardTitleEl.text(task.title);
  $cardTextEl.text(task.taskDescription);
  $cardDate.text(task.date);

  // Generate a card by adding elements to the card body.
  $cardBodyEl.append($cardTextEl, $cardDate, $cardButtonEl);

  // Insert all elements into the card using the cardBodyEl.
  $cardEl.append($cardTitleEl, $cardBodyEl);

  return $cardEl;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Local Storage saved tasks are grabbed.
  taskList = JSON.parse(localStorage.getItem("tasks")) || [];

  // Makes sure the cards that are already there are removed from all the lanes.
  $toDoEl.empty();
  $inProgressEl.empty();
  $doneEl.empty();

  // All local storage saved tasks are looped through
  for (let i = 0; i < taskList.length; i++) {
    // Grabs the current task
    const task = taskList[i];

    // Card elements are built and returned
    const card = createTaskCard(task);

    // Tasks are loaded into the lane they are currently occupying
    if (task.status === "to-do") {
      $toDoEl.append(card);
    } else if (task.status === "in-progress") {
      $inProgressEl.append(card);
    } else {
      $doneEl.append(card);
    }
  }

  // Creates draggable card
  $(".drag-box").draggable({
    opacity: 0.7,
    zIndex: 100,
    // Visual clone card created when dragging.
    helper: function (e) {
      // Locates draggable parent if a parent element is selected.
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

// Todo: create a function to handle adding a new task.
function handleAddTask(event) {
  event.preventDefault();

  //Form created variables
  const titleEl = document.querySelector("#task-title");
  const dateEl = document.querySelector("#task-date");
  const taskDescriptionEl = document.querySelector("#task-description");

  // New taskId is created by called function generateTaskId
  generateTaskId();

  // New task is stored by created object
  const taskObject = {
    title: titleEl.value,
    date: dateEl.value,
    taskDescription: taskDescriptionEl.value,
    id: nextId,
    status: "to-do",
  };

  //Form is cleared
  document.getElementById("form").reset();

  // Array is filled with current task object.
  taskList.push(taskObject);

  // Local Storage is filled with updated array of objects.
  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

// Todo: create a function to handle deleting a task.
function handleDeleteTask(event) {
  const deleteId = event.target.id;
  let taskList = JSON.parse(localStorage.getItem("tasks"));

  // The task with the appropriate Id from the array is the only task deleted.
  taskList.forEach(function (task, index) {
    if (task.id == deleteId) {
      taskList.splice(index, 1);
    }
  });

  // Local Storage takes in saved updated array.
  localStorage.setItem("tasks", JSON.stringify(taskList));

  //This function renders our updated task list saved to Local Storage.
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane.
function handleDrop(event, ui) {
  //Element's Id thats been dropped
  const taskId = ui.draggable[0].id;

  //Updates the status to the appropriate lane by finding the task by its "id".
  const newStatus = event.target.id;

  const updateTasks = JSON.parse(localStorage.getItem("tasks"));

  for (let i = 0; i < updateTasks.length; i++) {
    // Current task grabbed
    const task = updateTasks[i];

    if (task.id == taskId) {
      task.status = newStatus;
    }
  }
  // Update tasks in local storage
  localStorage.setItem("tasks", JSON.stringify(updateTasks));
  // Render the updated task list
  renderTaskList();
}

function cardState(cardDate) {
  const today = dayjs();
  const date1 = dayjs(cardDate);
  const dateDiff = date1.diff(today, "days");

  if (dateDiff > 1) {
    return "overdue";
  } else if (dateDiff >= 0) {
    return "due";
  } else {
    return "current";
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker.
$(document).ready(function () {
  // Event listener executes handleAddTask function through the submit button.
  $("#saveBtn").on("click", handleAddTask);

  // Datepicker added to modal.
  $("#task-date").datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // Droppable lanes.
  $(".lane").droppable({
    accept: ".drag-box",
    drop: handleDrop,
  });

  // On page load tasks from local storage are rendered.
  renderTaskList();
});
