const limit = 50;

async function loadPage({

page,
  table,
  tbodyId,
  renderRow,
  ekspedisiFilter = []

}) {

  currentPage = page;

  const from =
    (currentPage - 1) * limit;

  const to =
    from + (limit - 1);

  let query = client
  .from(table)
  .select("*");

if (ekspedisiFilter.length > 0) {

  query = query.in(
    "ekspedisi",
    ekspedisiFilter
  );

}

const { data, error } =
  await query.range(from, to);

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

async function setupPagination({

  table,
  tbodyId,
  renderRow,
  ekspedisiFilter = []

}) {

  window.currentTable = table;
  window.currentTbodyId = tbodyId;
  window.currentRenderRow = renderRow;
  window.currentEkspedisiFilter =
  ekspedisiFilter;

  let countQuery = client
  .from(table)
  .select("*", {
    count: "exact",
    head: true
  });

if (ekspedisiFilter.length > 0) {

  countQuery =
    countQuery.in(
      "ekspedisi",
      ekspedisiFilter
    );

}

const { count } =
  await countQuery;

  const totalPages =
    Math.ceil(count / limit);

  let html = "";

  for(let i = 1; i <= totalPages; i++) {

    html += `
      <button
        onclick="changePage(${i})"
      >
        ${i}
      </button>
    `;
  }

  document
    .getElementById("pagination")
    .innerHTML = html;
}

function changePage(page){

  loadPage({

    page,

    table: window.currentTable,

    tbodyId: window.currentTbodyId,

    renderRow: window.currentRenderRow,

    ekspedisiFilter:
      window.currentEkspedisiFilter

  });

}
