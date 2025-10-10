import "../src/scss/styles.scss";

import * as bootstrap from "bootstrap";
import {
    getTaskList,
    addTask,
    deleteTask,
    updateTask,
    updateCompletionStatus,
    sortTask,
} from "./api.js";
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const functionalBtns = `<div class="functional-btns">
<img class="del-btn" src="../src/assets/svg/delete.svg" alt="delete-img">
<img class="edit-btn" src="../src/assets/svg/edit.svg" alt = "edit-img">
</div>`;

const confirmBox = document.querySelector(".confirm-box");
const confirmMsgBox = document.querySelector(".confirm-msg-box");
const ul = document.querySelector("#taskList");

const taskBox = document.querySelector("#taskInput");
const preferenceBox = document.querySelector("#preferenceInput");
const tagsBox = document.querySelector(".tags-input");
const sortInput = document.querySelector("#sortInput");

const alertBox = document.querySelector(".alert-box");
const messageBox = document.querySelector(".message");
const searchBox = document.querySelector("#searchInput");
const searchSelect = document.querySelector("#search-select");

window.onload = async function () {
    try {
        let tasks = await getTaskList();
        createFunctionalBtns();
        displayTask(tasks);
    } catch (e) {
        console.error(e);
        showAlert("Could not load tasks from server.", "error");
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
            preferenceColor = "#5E503F";
        } else if (t.preference.toLowerCase() === "medium") {
            preferenceColor = "#d4aa77ff";
        } else if (t.preference.toLowerCase() === "low") {
            preferenceColor = "#cda97dff";
        }

        newLi.innerHTML = `
      <div class="list-container row d-flex align-items-center p-2">
        <div class="col-12 col-md-9 data-container d-flex flex-wrap gap-2 align-items-center">
          <div class="preference-container p-1 px-2 rounded-5" style="background:${preferenceColor}">${t.preference
            }</div>
        </div>

        <div class="d-flex align-items-center text-container py-3 px-3 gap-2">
          <p class="m-0 text-break" style="text-decoration: ${textStyle}">${t.task
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
                console.log("delete btn clicked");
                const result = await showConfirmBox("Do you want to delete the task?");
                if (result === "yes") {
                    confirmMsgBox.innerText = "";
                    confirmBox.classList.remove("down");
                    const listItem = e.target.closest("li");
                    const deleteId = listItem.id;

                    await deleteTask(deleteId);

                    const tasks = await getTaskList();
                    displayTask(tasks);
                    showAlert("Task Deleted Successfully!", "success");
                }
            }
        } catch (e) {
            console.error(e);
            showAlert("Deletion Error", "error");
        }
    });

    ul.addEventListener("click", async (e) => {
        try {
            if (e.target.classList.contains("done-btn")) {
                const listItem = e.target.closest("li");
                const id = listItem.id;

                await updateCompletionStatus(id);
                const tasks = await getTaskList();
                displayTask(tasks);
            }
        } catch (e) {
            showAlert("Unable to mark task as isCompleted", "error");
        }
    });

    ul.addEventListener("click", async (e) => {
        if (e.target.classList.contains("edit-btn")) {
            console.log("inside edit button");
            const listItem = e.target.closest("li");
            const id = listItem.id;

            let tasks = await getTaskList();
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

                taskBox.style.background = "#5E503F";
                taskBox.style.border = "2px solid #cda97dff";

                preferenceBox.style.background = "#5E503F";
                preferenceBox.style.border = "2px solid #cda97dff";

                tagsBox.style.background = "#5E503F";
                tagsBox.style.border = "2px solid #cda97dff";

                const addTaskContainer = document.querySelector(".addTask-container");
                const existing = document.querySelector(".btn-row");

                if (!existing) {
                    const newDiv = document.createElement("div");
                    newDiv.classList.add("row");
                    newDiv.classList.add("g-3");
                    newDiv.classList.add("pt-3");
                    newDiv.classList.add("btn-row");

                    newDiv.innerHTML = `<div class="col-md-6 d-grid">
            <button id="save-btn" class="btn primary-btn purple-btn">
              Save
            </button>
          </div>

          <div class="col-md-6 d-grid">
            <button id="cancel-btn" class="btn primary-btn purple-btn">
              Cancel
            </button>
          </div>`;

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

                            await updateTask(id, updatedData);

                            restoreInputBoxes();

                            const tasks = await getTaskList();
                            displayTask(tasks);
                        } catch (e) {
                            console.error(e);
                            showAlert("Updation error!", "error");
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

searchBox.addEventListener("input", async () => {
    try {
        const searchText = searchBox.value.trim();
        const filterValue = searchSelect.value;

        if (!filterValue) throw new Error("Please select filter!");
        console.log("Searching:", searchText, filterValue);

        const tasks = await getTaskList();
        let filteredTasks = tasks;

        if (filterValue === "tags") {
            filteredTasks = tasks.filter(
                (t) =>
                    Array.isArray(t.tags) &&
                    t.tags.some((tag) => tag.toLowerCase().includes(searchText))
            );
        } else if (filterValue === "title") {
            filteredTasks = tasks.filter(
                (t) => t.task && t.task.toLowerCase().includes(searchText)
            );
        } else if (filterValue === "preference") {
            filteredTasks = tasks.filter(
                (t) => t.preference && t.preference.toLowerCase().includes(searchText)
            );
        }

        console.log("Filtered tasks:", filteredTasks);
        displayTask(filteredTasks);
    } catch (err) {
        showAlert(err.message, "error");
        console.error(err);
    }
});

function restoreInputBoxes() {
    // console.log("aaagya");
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
    };
    console.log(taskData);

    await addTask(taskData);

    let tasks = await getTaskList();
    displayTask(tasks);

    showAlert("Task added successfully!", "success");

    restoreInputBoxes();
    return;
});

async function sorting() {
    try {
        const sortValue = sortInput.value;
        let sortedTasks = await sortTask(sortValue);

        displayTask(tasks);
    } catch (e) {
        console.log(e);
    }
}

sortInput.addEventListener("change", sorting);



export function showAlert(message, method) {
    messageBox.innerText = message;
    alertBox.classList.remove("success", "error", "show");
    alertBox.classList.add("show", method === "success" ? "success" : "error");
    setTimeout(() => {
        alertBox.classList.remove("success", "error", "show");
    }, 3000);
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