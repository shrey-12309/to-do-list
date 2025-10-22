import { DOMAIN, PORT } from "../../../constants.js";
import fetchAuth from "./interceptor.js";

const BASE_URL = `${DOMAIN}:${PORT}`;

export default class TaskAPI {
  getTaskList = async () => {
    try {
      const res = await fetchAuth(`${BASE_URL}`);

      let data;
      try {
        const parsedRes = await res.json();
        data = parsedRes.data;
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data.error || "Error in fetching taskList!");
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  addTask = async (taskData) => {
    try {
      const res = await fetchAuth(`${BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Unable to add task in the taskList."
        );
      }

      return;
    } catch (err) {
      throw err;
    }
  };

  deleteTask = async (id) => {
    try {
      const res = await fetchAuth(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Unable to add task in the taskList."
        );
      }

      return;
    } catch (err) {
      throw err;
    }
  };

  updateTask = async (id, updatedData) => {
    try {
      const res = await fetchAuth(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error in updating task!");
      }

      return;
    } catch (err) {
      throw err;
    }
  };

  updateCompletionStatus = async (id) => {
    try {
      const res = await fetchAuth(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error in updating task!");
      }

      return;
    } catch (err) {
      throw err;
    }
  };

  searchTask = async (searchText, searchFilter) => {
    try {
      const res = await fetchAuth(
        `${BASE_URL}/search?searchText=${searchText}&searchFilter=${searchFilter}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error in searching tasks!");
      }

      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  sortTask = async (sortFilter) => {
    try {
      const res = await fetchAuth(`${BASE_URL}/sort?sortFilter=${sortFilter}`);
      const filteredData = await res.json();

      if (!res.ok) {
        throw new Error(filteredData.error || "Error in sorting task!");
      }

      return filteredData.filteredTasks;
    } catch (err) {
      throw err;
    }
  };
}
