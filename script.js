// Dark Mode
function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}
const switchButton = document.querySelector('.switch input[type="checkbox"]');
switchButton.addEventListener("change", darkMode);

//Clock
function Clock() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById("clock").innerHTML = h + ":" + m + ":" + s;
  setTimeout(Clock, 1000);
}
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  } // add zero in front of numbers < 10
  return i;
}

document.addEventListener("DOMContentLoaded", function () {
  Clock();
});

//Form Submit

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const span = document.getElementsByClassName("close")[0];

  modal.style.display = "flex";

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
