const functionalBtns = `<div class="functional-btns">
<img class="del-btn" src="/svgs/delete.svg" alt="delete-img">
<img class="edit-btn" src="/svgs/edit.svg" alt = "edit-img">
</div>`;

const saveCancelBtn = `<div class="col-md-6 d-grid">
<button id="save-btn" class="btn primary-btn purple-btn">
              Save
              </button>
              </div>
              
              <div class="col-md-6 d-grid">
              <button id="cancel-btn" class="btn primary-btn purple-btn">
              Cancel
              </button>
              </div>`;

const addBtn = document.querySelector("#addBtn");
const confirmBox = document.querySelector(".confirm-box");
const confirmMsgBox = document.querySelector(".confirm-msg-box");
const ul = document.querySelector("#taskList");
const taskBox = document.querySelector("#taskInput");
const preferenceBox = document.querySelector("#preferenceInput");
const tagsBox = document.querySelector(".tags-input");
const sortInput = document.querySelector("#sortInput");
const searchBox = document.querySelector("#searchInput");
const searchSelect = document.querySelector("#search-select");
const logoutBtn = document.querySelector(".logout");
const profileBtn = document.querySelector(".profile");

export {
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
  profileBtn,
};

export default class constants {}
