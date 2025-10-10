import { showAlert } from "./main.js";

async function getTaskList() {
    try {
        const res = await fetch("http://localhost:8000");
        if (!res.ok) throw new Error("Failed to fetch tasks from backend.");
        return await res.json();
    } catch (e) {
        console.error("Error fetching tasks:", e);
        showAlert(`Could not load tasks from server!`, "error");
    }
}

async function addTask(taskData) {
    try {
        const res = await fetch("http://localhost:8000/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskData }),
        });
        showAlert("Task added successfully!", "success");
    } catch (e) {
        console.error("Error creating task:", e);
        showAlert("Could not add task to server", "error");
    }
}

async function deleteTask(id) {
    try {
        const res = await fetch(`http://localhost:8000/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete task");
        showAlert("Task deleted successfully!", "success");
    } catch (e) {
        console.error("Error deleting task:", e);
        showAlert("Could not delete task from server", "error");
    }
}

async function updateTask(id, updatedData) {
    try {
        const res = await fetch(`http://localhost:8000/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ updatedData }),
        });
        if (!res.ok) throw new Error("Failed to update task");
        showAlert("Task updated successfully!", "success");
        return;
    } catch (e) {
        console.error("Error updating task:", e);
        showAlert("Could not update task on server", "error");
    }
}

async function updateCompletionStatus(id) {
    try {
        const res = await fetch(`http://localhost:8000/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });

        if (!res.ok) throw new Error("Failed to update completion status");
    } catch (e) {
        console.error(e);
        showAlert("Could not update task status", "error");
    }
}

async function searchTask(text, filter) {

}
async function sortTask(filter) {
    try {
        const res = await fetch("http://localhost:8000/sort", {
            method: "GET",
            body: JSON.stringify({ sortFilter: filter }),
        });
        if (!res.ok) {
            throw new Error("Error occurred while sorting");
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
}

export {
    getTaskList,
    addTask,
    deleteTask,
    updateTask,
    updateCompletionStatus,
    searchTask,
    sortTask,
};