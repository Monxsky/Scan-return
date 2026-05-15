// import { detectExpedisi }
// from "./detect.js";

async function scanResi() {

  const resi =
  document
  .grtElementById("resiInput")
  .value;

  const ekspedisi =
    detectExpedisi(resi);

  await client
  .from("inbound")
  .insert([{

    resi,
    ekspedisi,
    status,

  }]);

}
// load inbound  //
async function loadInbound() {

  const { data, error } = await client
    .from("scan_awb")
    .select("*");

  if (error) {
    console.error("Supabase Error:", error);
    return;
  }

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data
    .slice()
    .reverse()
    .forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td>${item.resi}</td>
          <td>${item.status}</td>
          <td>${new Date(item.waktu).toLocaleString("id-ID")}</td>
        </tr>
      `;
    });
}

async function filterInbound() {

  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  const data = await filterByDate("scan_awb", start, end);

  renderTable(data);
}

function doSearch() {
  searchResi("scan_awb", renderTable);
}

function renderTable(data) {

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.resi}</td>
        <td>${item.status}</td>
        <td>${new Date(item.waktu || item.created_at).toLocaleString("id-ID")}</td>
      </tr>
    `;
  });
}

setupPagination({
  table: "scan_awb",
  tbodyId: "tableBody",
  renderRow: (item) => `
    <tr>
      <td>${item.resi}</td>
      <td>${item.status}</td>
      <td>${new Date(item.waktu || item.created_at).toLocaleString("id-ID")}</td>
    </tr>
  `
});

loadPage({
  page: 1,
  table: "scan_awb",
  tbodyId: "tableBody",
  renderRow: (item) => `
    <tr>
      <td>${item.resi}</td>
      <td>${item.status}</td>
      <td>${new Date(item.waktu || item.created_at).toLocaleString("id-ID")}</td>
    </tr>
  `
});
