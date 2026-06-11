const menuBtn =
  document.getElementById("menuBtn");

const sidebar =
  document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

const dropdownBtns =
  document.querySelectorAll(".dropdown-btn");

dropdownBtns.forEach((btn) => {

  btn.addEventListener("click", () => {

    const content =
      btn.nextElementSibling;

    content.classList.toggle("active");

  });

});
