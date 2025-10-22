import "../scss/styles.scss";
import { wait, showAlert } from "./toast.js";
import TaskAPI from "./api/TaskAPI.js";
import TokenManagerClass from "../../utils/tokenManager.js";
import {
  addBtn,
  functionalBtns,
  confirmBox,
  confirmMsgBox,
  ul,
  taskBox,
  preferenceBox,
  tagsBox,
  sortInput,
  searchBox,
  searchSelect,
  saveCancelBtn,
  logoutBtn,
  clearTask,
} from "./mainConstants.js";

const api = new TaskAPI();
const tokenManager = new TokenManagerClass();
const accessToken = localStorage.getItem("accessToken");

if (!accessToken) {
  window.location.href = `/pages/login`;
}

window.onload = async function () {
  try {
    let tasks = await api.getTaskList();

    createFunctionalBtns();
    updateAnalyticBox(tasks);
    displayTask(tasks);
  } catch (err) {
    showAlert(err.message, "error");
  }
};

function displayTask(tasks) {
  const ul = document.querySelector("#taskList");
  ul.innerHTML = "";

  tasks.forEach((t) => {
    const newLi = document.createElement("li");
    let textStyle = "none";

    if (t.isCompleted === true) {
      textStyle = "line-through";
    }

    let preferenceColor = "black";

    if (t.preference.toLowerCase() === "high") {
      preferenceColor = " linear-gradient(135deg, #3e0791ff, #563190ff);";
    } else if (t.preference.toLowerCase() === "medium") {
      preferenceColor = "linear-gradient(135deg, #5537aeff, #a75ee8ff);";
    } else if (t.preference.toLowerCase() === "low") {
      preferenceColor = "linear-gradient(135deg, #7C3AED, #A78BFA);";
    }

    newLi.innerHTML = `
      <div class="list-container row d-flex align-items-center p-2">
        <div class="col-12 col-md-9 data-container d-flex flex-wrap gap-2 align-items-center">
          <div class="preference-container p-1 px-2 rounded-5" style="background:${preferenceColor}">${
      t.preference
    }</div>
        </div>

        <div class="d-flex align-items-center text-container py-3 px-3 gap-2">
          <p class="m-0 text-break" style="text-decoration: ${textStyle}">${
      t.task
    }</p>
          <div class="tags-container small text-muted">${t.tags.join(" ")}</div>
        </div>

        <div class="btn-container col-12 d-flex">
          <button class="btn primary-btn done-btn">
            ${t.isCompleted === true ? "Undone" : "Done"}
          </button>
          ${functionalBtns}
        </div>
      </div>`;

    newLi.id = t._id;
    ul.appendChild(newLi);
  });
}

async function createFunctionalBtns() {
  ul.addEventListener("click", async (e) => {
    try {
      if (e.target.classList.contains("del-btn")) {
        const result = await showConfirmBox("Do you want to delete the task?");

        if (result === "yes") {
          confirmMsgBox.innerText = "";
          confirmBox.classList.remove("down");
          const listItem = e.target.closest("li");
          const deleteId = listItem.id;

          await api.deleteTask(deleteId);

          const tasks = await api.getTaskList();

          displayTask(tasks);
          updateAnalyticBox(tasks);
          showAlert("Task Deleted Successfully!", "success");
        }
      }
    } catch (e) {
      showAlert("Error in deleting tasks! Please try again.", "error");
    }
  });

  ul.addEventListener("click", async (e) => {
    try {
      if (e.target.classList.contains("done-btn")) {
        const listItem = e.target.closest("li");
        const id = listItem.id;

        await api.updateCompletionStatus(id);

        const tasks = await api.getTaskList();

        displayTask(tasks);
        updateAnalyticBox(tasks);
      }
    } catch (e) {
      showAlert("Unable to mark task as isCompleted", "error");
    }
  });

  ul.addEventListener("click", async (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const listItem = e.target.closest("li");
      const id = listItem.id;

      let tasks = await api.getTaskList();
      let taskData = null;

      for (let task of tasks) {
        if (id === task._id) {
          taskData = task;
          break;
        }
      }

      if (taskData) {
        taskBox.value = taskData.task;
        preferenceBox.value = taskData.preference;
        tagsBox.value = taskData.tags;

        taskBox.style.background = "#dac2f0ff";
        taskBox.style.border = "2px solid #c083f6ff";

        preferenceBox.style.background = "#dac2f0ff";
        preferenceBox.style.border = "2px solid #c083f6ff";

        tagsBox.style.background = "#dac2f0ff";
        tagsBox.style.border = "2px solid #c083f6ff";

        const addTaskContainer = document.querySelector(".addTask-container");
        const existing = document.querySelector(".btn-row");

        if (!existing) {
          const newDiv = document.createElement("div");
          newDiv.classList.add("row");
          newDiv.classList.add("g-3");
          newDiv.classList.add("pt-3");
          newDiv.classList.add("btn-row");

          newDiv.innerHTML = saveCancelBtn;

          addTaskContainer.insertAdjacentElement("afterend", newDiv);

          const saveBtn = document.querySelector("#save-btn");
          const cancelBtn = document.querySelector("#cancel-btn");

          saveBtn.addEventListener("click", async () => {
            try {
              const preferenceInput = preferenceBox.value;
              const taskInput = taskBox.value.trim();
              const tagsInput = tagsBox.value;
              const tagsInputArray = tagsInput ? tagsInput.split(",") : [];

              const updatedData = {
                task: taskInput,
                preference: preferenceInput,
                tags: tagsInputArray,
              };

              await api.updateTask(id, updatedData);

              restoreInputBoxes();

              const tasks = await api.getTaskList();

              displayTask(tasks);
            } catch (err) {
              showAlert(err.message, "error");
            }
          });

          cancelBtn.addEventListener("click", () => {
            restoreInputBoxes();
          });
        }
      }
    }
  });
}

async function searching() {
  try {
    const searchText = searchBox.value.trim();
    const searchFilter = searchSelect.value;

    if (!searchFilter) {
      showAlert("Please select filter", "error");
      return;
    }

    const filteredTasks = await api.searchTask(searchText, searchFilter);
    displayTask(filteredTasks);
  } catch {
    showAlert("Some error occured while filtering! Please try again", "error");
  }
}

searchBox.addEventListener("input", searching);

function restoreInputBoxes() {
  const btnBox = document.querySelector(".btn-row");
  taskBox.value = "";
  preferenceBox.value = "";
  tagsBox.value = "";

  taskBox.style.background = "white";
  taskBox.style.border = "none";

  preferenceBox.style.background = "white";
  preferenceBox.style.border = "none";

  tagsBox.style.background = "white";
  tagsBox.style.border = "none";

  if (btnBox) btnBox.remove();
}

addBtn.addEventListener("click", async () => {
  try {
    const preferenceInput = preferenceBox.value;
    const taskInput = taskBox.value.trim();
    const tagsInput = tagsBox.value;
    const tagsInputArray = tagsInput ? tagsInput.split(",") : [];

    if (taskInput === "") {
      showAlert("Please enter the task!", "error");
      return;
    }

    if (preferenceInput === "") {
      showAlert("Please select preference!", "error");
      return;
    }

    const taskData = {
      task: taskInput,
      preference: preferenceInput,
      tags: tagsInputArray,
      isCompleted: false,
    };

    await api.addTask(taskData);
    let tasks = await api.getTaskList();

    displayTask(tasks);
    updateAnalyticBox(tasks);

    showAlert("Task added successfully!", "success");

    restoreInputBoxes();
    return;
  } catch (e) {
    showAlert(e.message, "error");
  }
});

async function sorting() {
  try {
    const sortValue = sortInput.value;
    let sortedTasks = await api.sortTask(sortValue);

    displayTask(sortedTasks);
  } catch (err) {
    showAlert(err.message, "error");
  }
}

sortInput.addEventListener("change", sorting);

function updateAnalyticBox(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted === true).length;
  const pending = total - completed;

  document.querySelector(".total-tasks .analytic-body").innerText = total;
  document.querySelector(".completed-tasks .analytic-body").innerText =
    completed;
  document.querySelector(".pending-tasks .analytic-body").innerText = pending;
}

function showConfirmBox(message) {
  confirmMsgBox.innerHTML = message;
  confirmBox.classList.add("up");

  return new Promise((resolve) => {
    const yesBtn = document.querySelector(".yes-btn");
    const noBtn = document.querySelector(".no-btn");

    yesBtn.onclick = () => {
      confirmBox.classList.remove("up");
      confirmBox.classList.add("down");
      resolve("yes");
    };
    noBtn.onclick = () => {
      confirmBox.classList.remove("up");
      confirmBox.classList.add("down");
      resolve("no");
    };
  });
}

logoutBtn.addEventListener("click", () => {
  try {
    tokenManager.clearTokens();
    window.location.href = "/pages/login";
  } catch (e) {
    showAlert("Unable to logout user! Please try after sometime");
  }
});

clearTask.addEventListener("click", async () => {
  try {
    await api.clearTask();
    showAlert("Task cleared successfully!");

    displayTask([]);
  } catch (e) {
    showAlert(e.message);
  }
});
