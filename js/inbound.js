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

setInterval(loadInbound, 3000);
