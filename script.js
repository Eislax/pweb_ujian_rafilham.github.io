//mapping dengan elemen yang ada di html dan css
const taskInput = document.querySelector(".task-input input");
const addButton = document.getElementById("addButton");
const filters = document.querySelectorAll(".filters span");
const deleteAll = document.querySelector(".delete-btn");
const taskBox = document.querySelector(".task-box");

//Deklarasi
let editId;
let isEditTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list"));

function showTodo(filter) {
  //mendefinisikan fungsi showTodo dengan parameter filter
  let liTag = ""; //membuat variabel liTag untuk menyimpan elemen-elemen li
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        //Menambahkan elemen li ke dalam variabel liTag dengan menggunakan template literal
        liTag += `<li class="task"> 
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="option">
                                <i onclick="showMenu(this)" id="dot" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
      }
    });
  }
  taskBox.innerHTML =
    liTag ||
    `<span class="dummy">You don't have any task, please add some</span>`;
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length
    ? deleteAll.classList.remove("active")
    : deleteAll.classList.add("active");
  taskBox.offsetHeight >= 300
    ? taskBox.classList.add("overflow")
    : taskBox.classList.remove("overflow");
}

showTodo("all");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

function editTask(taskId, textName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  addButton.innerHTML = "Update";
}

function deleteTask(deleteId, filter) {
  isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}

deleteAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

addButton.addEventListener("click", () => {
  let userTask = taskInput.value.trim();
  if (userTask === "") {
    alert("Input tidak boleh kosong");
    return;
  }
  if (userTask) {
    if (!isEditTask) {
      todos = !todos ? [] : todos;
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    addButton.innerHTML = "Add Task";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
});
