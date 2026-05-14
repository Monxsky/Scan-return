async function loadInbound() {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/scan_awb?select=*`,
    {
      headers:{
        apikey: SUPABASE_KEY,
        Authorization:
          `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const data = await res.json();
  
  const tbody =
    document.getElementById(
      "tableBody"
    );


async function filterInbound() {

  const start =
    document.getElementById("startDate").value;

  const end =
    document.getElementById("endDate").value;

  const data = await filterByDate(
    "scan_awb",
    start,
    end
  );

  renderTable(data);
}
  

function doSearch() {

  searchResi(
    "scan_awb",
    renderTable
  );

}
  
  tbody.innerHTML = "";

  data.reverse().forEach(item => {

    tbody.innerHTML += `
      <tr>
        <td>${item.resi}</td>

        <td>${item.status}</td>

        <td>
          ${new Date(item.waktu)
            .toLocaleString('id-ID')}
        </td>
      </tr>
    `;

  });

}

loadInbound();

setupPagination({

  table:"scan_awb",

  tbodyId:"tableBody",

  renderRow:(item)=>`

    <tr>
      <td>${item.resi}</td>
      <td>${item.status}</td>
      <td>${item.created_at}</td>
    </tr>

  `
});

loadPage({

  page:1,

  table:"scan_awb",

  tbodyId:"tableBody",

  renderRow:(item)=>`

    <tr>
      <td>${item.resi}</td>
      <td>${item.status}</td>
      <td>${item.created_at}</td>
    </tr>

  `
});

setInterval(loadInbound, 3000);
