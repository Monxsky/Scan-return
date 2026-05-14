const limit = 100;

async function setupPagination() {

  const { count } = await client
    .from("retur_manifest")
    .select("*", { count: "exact", head: true });

  const totalPages = Math.ceil(count / limit);

  let buttons = "";

  for(let i = 1; i <= totalPages; i++) {

    html += `
      <button
        class="${i === currentPage ? 'active-page' : ''}"
        onclick="changePage(${i})"
      >
        ${i}
      </button>
    `;
  }

  document.getElementById("pagination").innerHTML = buttons;
}
function changePage(page){

  currentPage = page;

  loadManifest();

  setupPagination();
}
