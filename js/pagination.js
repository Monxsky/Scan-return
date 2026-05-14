const limit = 50;

async function setupPagination({

  table,
  tbodyId,
  renderRow

}) {

  const { count } = await client
    .from(table)
    .select("*", {
      count:"exact",
      head:true
    });

  const totalPages = 
    Math.ceil(count / limit);

  let html = "";

  for(let i = 1; i <= totalPages; i++) {

    html += `
      <button
        onclick="
         changePage(
         ${i},
         '${table}'
         '${tbodyId}'
        )
      "
    >
       ${i}
      </button>
    `;
  }

  document
    .getElementById("pagination")
    .innerHTML = html;

  window.currentRenderRow =
    renderRow;
}

function changePage(page){
  loadPage({
    page,
    table,
    tbodyId,
    renderRow: window.currentRenderRow
  });

  setupPagination();
}
