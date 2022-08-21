const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
  sideDrawer.classList.add("open");
}

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);

var modalCheckin = document.getElementById("checkinModal");
var modalAnnualLave = document.getElementById("AnnualLeaveModal");

// Get the button that opens the modal
var checkinBtn = document.getElementById("checkinBtn");
var checkoutBtn = document.getElementById("checkoutBtn");
var AnnualLeaveBtn = document.getElementById("annualLeaveBtn");

// Get the <span> element that closes the modal
var checkinClose = document.getElementsByClassName("close")[0];
var annualLeaveClose = document.getElementsByClassName("close")[1];

// When the user clicks on the button, open the modal
checkinBtn.onclick = function () {
  modalCheckin.style.display = "block";
};
checkoutBtn.onclick = function () {
  modalCheckout.style.display = "block";
};
AnnualLeaveBtn.onclick = function () {
  modalAnnualLave.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
checkinClose.onclick = function () {
  modalCheckin.style.display = "none";
};

annualLeaveClose.onclick = function () {
  modalAnnualLave.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modalCheckin) {
    modalCheckin.style.display = "none";
  } else if (event.target == modalAnnualLave) {
    modalAnnualLave.style.display = "none";
  }
};
