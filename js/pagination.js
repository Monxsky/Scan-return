const limit = 50;

async function loadPage({

  page,
  table,
  tbodyId,
  renderRow

}) {

  currentPage = page;

  const from =
    (currentPage - 1) * limit;

  const to =
    from + (limit - 1);

  const { data, error } = await client
    .from(table)
    .select("*")
    .range(from, to);

  const tbody =
    document.getElementById(tbodyId);

  tbody.innerHTML = "";

  if (!data || data.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          Belum ada data
        </td>
      </tr>
    `;

    return;
  }

  data.forEach(item => {

    tbody.innerHTML += renderRow(item);

  });
}

function changePage(
  page,
  table,
  tbodyId
){

  loadPage({
    page,
    table,
    tbodyId,
    renderRow: window.currentRenderRow
  });
}

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
