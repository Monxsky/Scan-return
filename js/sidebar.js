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

loadSidebar();
