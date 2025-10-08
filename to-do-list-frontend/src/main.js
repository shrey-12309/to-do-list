
import "./scss/styles.scss";

import * as bootstrap from "bootstrap";

const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const functionalBtns = `<div class="functional-btns">
<img class="del-btn" src="./src/assets/svg/delete.svg" alt="delete-img">
<img class="edit-btn" src="./src/assets/svg/edit.svg" alt = "edit-img">
</div>`;

const confirmBox = document.querySelector(".confirm-box");
const confirmMsgBox = document.querySelector(".confirm-msg-box");
const ul = document.querySelector("#taskList");

const taskBox = document.querySelector("#taskInput");
const preferenceBox = document.querySelector("#preferenceInput");
const tagsBox = document.querySelector(".tags-input");
const dateTimeBox = document.querySelector("#dateTimeInput");
const sortInput = document.querySelector("#sortInput");

const alertBox = document.querySelector(".alert-box");
const messageBox = document.querySelector(".message");
const searchBox = document.querySelector('#searchInput');
const searchSelect = document.querySelector('#search-select');


window.onload = async function () {
    try {
        let tasks = await getTaskList();
        await sorting(tasks);
        createFunctionalBtns();
        displayTask(tasks);
    } catch (e) {
        console.error(e);
        showAlert("Could not load tasks from server.", "error");
    }
};




async function getTaskList() {
    try {
        const res = await fetch('http://localhost:8000');
        if (!res.ok) throw new Error("Failed to fetch tasks from backend.");
        return await res.json();
    }
    catch (e) {
        console.error("Error fetching tasks:", e);
        showAlert(`Could not load tasks from server!`, 'error');
    }
}

function displayTask(tasks) {
    const ul = document.querySelector("#taskList");
    ul.innerHTML = "";

    tasks.forEach((t) => {
        const newLi = document.createElement("li");
        let textStyle = 'none'

        if (t.completed === true) {
            textStyle = 'line-through';
        }

        let preferenceColor = "black";
        const pref = t.preference ? t.preference.toLowerCase() : "";
        if (pref === "high") {
            preferenceColor = "#5E503F";
        } else if (pref === "medium") {
            preferenceColor = "#d4aa77ff";
        } else if (pref === "low") {
            preferenceColor = "#cda97dff";
        }


        newLi.innerHTML = `
  <div class="list-container row d-flex align-items-center p-2">
    <div class="col-12 col-md-9 data-container d-flex flex-wrap gap-2 align-items-center">
      <div class="preference-container p-1 px-2 rounded-5" style="background:${preferenceColor}">${t.preference}</div>
    </div>

    <div class="d-flex align-items-center text-container py-3 px-3 gap-2">
      <p class="m-0 text-break" style="text-decoration: ${textStyle}">${t.task}</p>
      <div class="tags-container small text-muted">${Array.isArray(t.tags) ? t.tags.join(" ") : ""}</div>
    </div>

    <div class="btn-container col-12 d-flex">
      <button class="btn primary-btn done-btn">
        ${t.completed === true ? 'Undone' : 'Done'}
      </button>
      ${functionalBtns}
    </div>
  </div>`;


        newLi.id = t.id;
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
        }
        catch (e) {
            showAlert("Unable to mark task as completed", "error");
        }
    });


    ul.addEventListener("click", async (e) => {
        if (e.target.classList.contains("edit-btn")) {
            console.log("inside edit button")
            const listItem = e.target.closest("li");
            const id = listItem.id;

            let tasks = await getTaskList();
            let taskData = null;

            for (let task of tasks) {
                if (id === String(task.id)) {
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

                dateTimeBox.style.background = "#dac2f0ff";
                dateTimeBox.style.border = "2px solid #c083f6ff";

                tagsBox.style.background = "#dac2f0ff";
                tagsBox.style.border = "2px solid #c083f6ff";

                const addTaskContainer = document.querySelector('.addTask-container');
                const existing = document.querySelector('.btn-row');

                if (!existing) {
                    const newDiv = document.createElement('div');
                    newDiv.classList.add('row');
                    newDiv.classList.add('g-3');
                    newDiv.classList.add('pt-3');
                    newDiv.classList.add('btn-row');

                    newDiv.innerHTML = `<div class="col-md-6 d-grid">
            <button id="save-btn" class="btn primary-btn brown-btn">
              Save
            </button>
          </div>

          <div class="col-md-6 d-grid">
            <button id="cancel-btn" class="btn primary-btn brown-btn">
              Cancel
            </button>
          </div>`;

                    addTaskContainer.insertAdjacentElement('afterend', newDiv);

                    const saveBtn = document.querySelector('#save-btn');
                    const cancelBtn = document.querySelector('#cancel-btn');

                    saveBtn.addEventListener('click', async () => {
                        try {
                            const preferenceInput = preferenceBox.value;
                            const taskInput = taskBox.value.trim();
                            const dateTimeInput = dateTimeBox ? dateTimeBox.value : null;
                            const tagsInput = tagsBox.value;
                            const tagsInputArray = tagsInput ? tagsInput.split(",") : [];

                            const updatedData = {
                                task: taskInput,
                                preference: preferenceInput,
                                tags: tagsInputArray,
                            }

                            await updateTask(id, updatedData);

                            restoreInputBoxes();

                            const tasks = await getTaskList();
                            await sorting(tasks);
                            displayTask(tasks);
                        } catch (e) {
                            console.error(e);
                            showAlert("Updation error!", "error");
                        }
                    });

                    cancelBtn.addEventListener('click', () => {
                        restoreInputBoxes();
                    });
                }
            }
        }
    });
}

searchBox.addEventListener("input", async () => {
    try {
        const searchText = searchBox.value;
        const filterValue = searchSelect.value;

        if (filterValue == "") {
            throw new Error("add filter value");
        }
    } catch (e) {
        showAlert("add filter value", "error");
    }
});

searchSelect.addEventListener("change", async () => {

    try {
        const searchText = searchBox.value;
        const filterValue = searchSelect.value;

        const res = await fetch(`/search?text=${searchText}&filter=${encodeURIComponent(filterValue)}`);
        if (!res.ok) throw new Error('cant search');
        const filteredTasks = await res.json();
        displayTask(filteredTasks);
    } catch (error) {
        console.error("Search error:", error);
    }
});


function restoreInputBoxes() {
    const btnBox = document.querySelector('.btn-row');
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
    const dateTimeInput = dateTimeBox ? dateTimeBox.value : null;
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

    if (dateTimeInput) {
        const inputDate = new Date(dateTimeInput + ":00");
        const now = new Date();

        if (inputDate < now) {
            showAlert("Selected time cannot be in the past.", "error");
            return;
        }
    }

    const taskData = {
        task: taskInput,
        preference: preferenceInput,
        tags: tagsInputArray,
    };
    console.log(taskData);

    await storeTask(taskData);

    let tasks = await getTaskList();
    await sorting(tasks);
    displayTask(tasks);

    showAlert("Task added successfully!", "success");

    restoreInputBoxes();
    return;
});

async function storeTask(taskData) {
    try {
        console.log('inside store task starting');
        const res = await fetch('http://localhost:8000/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskData })
        });
        console.log("this is a response", res);
        showAlert('Task added successfully!', 'success');
    } catch (e) {
        console.error('Error creating task:', e);
        showAlert('Could not add task to server', 'error');
    }
}

async function deleteTask(id) {
    try {
        const res = await fetch(`http://localhost:8000/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error("Failed to delete task");
        showAlert('Task deleted successfully!', 'success');
    }
    catch (e) {
        console.error('Error deleting task:', e);
        showAlert('Could not delete task from server', 'error');
    }
}

async function updateTask(id, updatedData) {
    try {
        const res = await fetch(`http://localhost:8000/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                task: updatedData.task,
                preference: updatedData.preference,
                tags: updatedData.tags,
                completed: updatedData.completed,
            })
        });
        if (!res.ok) throw new Error('Failed to update task');
        showAlert('Task updated successfully!', 'success');
        return;
    }
    catch (e) {
        console.error('Error updating task:', e);
        showAlert('Could not update task on server', 'error');
    }
}

async function updateCompletionStatus(id) {
    try {
        const res = await fetch(`http://localhost:8000/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        if (!res.ok) throw new Error('Failed to update completion status');
    } catch (e) {
        console.error(e);
        showAlert('Could not update task status', 'error');
    }
}

async function updateSortedTasks(sortedTasks) {
    try {
        const res = await fetch('http://localhost:8000/sort', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sortedTasks }),
        });

        if (!res.ok) {
            throw new Error('Failed to save sorted tasks');
        }
        return;
    } catch (e) {
        console.error('Error saving sorted tasks:', e);
    }
}



function sortByPreference(tasks) {
    const preferenceOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };

    tasks.sort((a, b) => {
        const aPref = preferenceOrder[a.preference] || 4;
        const bPref = preferenceOrder[b.preference] || 4;
        return aPref - bPref;
    });
    return tasks;
}

function sortByIndex(tasks) {
    tasks.sort((a, b) => {
        return Number(a.id) - Number(b.id);
    });
    return tasks;
}

async function sorting(tasks) {
    try {
        const sortValue = sortInput.value;

        if (sortValue === "preference") {
            tasks = sortByPreference(tasks);
        } else {
            tasks = sortByIndex(tasks);
        }

        await updateSortedTasks(tasks);

        displayTask(tasks);
    } catch (e) {
        console.error(e);
        showAlert("Sorting Error", 'error');
    }
}

sortInput.addEventListener("change", async () => {
    try {
        let tasks = await getTaskList();
        await sorting(tasks);
    } catch (e) {
        console.log(e);
    }
});


function showAlert(message, method) {
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