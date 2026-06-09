// async function loadSidebar() {

//   const response =
//     await fetch(
//       "../component/sidebar.html"
//     );

//   const html =
//     await response.text();

//   document
//     .getElementById(
//       "sidebar-container"
//     )
//     .innerHTML = html;
// }

async function loadSidebar() {

  const response =
    await fetch(
      "../component/sidebar.html"
    );

  const html =
    await response.text();

  document
    .getElementById(
      "sidebar-container"
    )
    .innerHTML = html;

  // // MOBILE MENU
  // const menuBtn =
  //   document.getElementById(
  //     "menuBtn"
  //   );

  // const sidebar =
  //   document.querySelector(
  //     ".sidebar"
  //   );

  // if(menuBtn && sidebar){

  //   menuBtn.addEventListener(
  //     "click",
  //     () => {
  //       sidebar.classList.toggle(
  //         "show"
  //       );
  //     }
  //   );

  // }

  // dropdown
  document
    .querySelectorAll(".dropdown-btn")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          btn.nextElementSibling
            .classList.toggle(
              "active"
            );

        }
      );

    });

}

const menuBtn =
  document.getElementById(
    "menuBtn"
  );

const sidebar =
  document.querySelector(
    ".sidebar"
  );

menuBtn.addEventListener(
  "click",
  () => {
console.log("MENU DIKLIK");
    
    sidebar.classList.toggle(
      "show"
    );
    console.log(sidebar.className);
  }
);

loadSidebar();
