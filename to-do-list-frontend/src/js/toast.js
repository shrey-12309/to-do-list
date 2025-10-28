function showAlert(message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  let backgroundColor = "White";

  if (type === "success") {
    backgroundColor = "#e6ccb2";
  } else {
    backgroundColor = "#5e503f";
  }

  toast.className = `toast align-items-center text-black border-0 show fade ${backgroundColor}`;

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
    </div>
  `;

  toastContainer.appendChild(toast);
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.transition = "opacity 0.5s";
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { wait, showAlert };
