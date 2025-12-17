const modal = document.getElementById("guestbook-modal");
const btn = document.getElementById("guestbook-btn");
const span = document.querySelector(".close");

btn.onclick = () => { modal.style.display = "block"; }
span.onclick = () => { modal.style.display = "none"; }
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
