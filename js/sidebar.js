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
}

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

loadSidebar();
