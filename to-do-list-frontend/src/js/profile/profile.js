const input = document.getElementById("profilePicInput");
const img = document.getElementById("profilePic");

input.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});
