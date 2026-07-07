async function scanResi() {

  const resi =
  document
  .getElementById("resiInput")
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

// Parameter Platform
const params =
  new URLSearchParams(
    window.location.search
  );

const platform =
  params.get("platform");

const config = {

  shopee: {
    title:
      "SCAN INBOUND SHOPEE",

    ekspedisi: [
      "SPX",
      "Shopee Express",
      "J&T Cargo",
      "ID"
    ]
  },

  tiktok: {
    title:
      "SCAN INBOUND TIKTOK",

    ekspedisi: [
      "J&T",
      "SiCepat"
    ]
  }

};

const current =
  config[platform];

if (current) {

  document
    .getElementById(
      "pageTitle"
    )
    .textContent =
      current.title;

}

   async function refreshSummary(){

    const { data, error } =
await client.rpc(

        "get_inbound_summary",

        {

            p_ekspedisi:
            current?.ekspedisi,

            p_date_from:
            appState.filter.scanDateFrom,

            p_date_to:
            appState.filter.scanDateTo

        }

    );

    if(error){

    console.error(error);
    return;

}

renderSummary(data?.[0]);
}
// load inbound  //
async function loadInbound() {

  let query =
  client
    .from("scan_awb")
    .select("*");

if (
  current &&
  current.ekspedisi.length > 0
) {

  query =
    query.in(
      "ekspedisi",
      current.ekspedisi
    );

}

const {
  data,
  error
} = await query;

if (error) {
    console.error("Supabase Error:", error);
    return;
  }

  console.log(
    "Platform:",
    platform
    );
  
  console.log(
    "Filter:",
    current?.ekspedisi
    );

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data
    .slice()
    .reverse()
    .forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td>${item.resi}</td>
          <td>${item.ekspedisi}</td>
          <td>${item.Pengirim}</td>
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
          <td>${item.ekspedisi}</td>
          <td>${item.Pengirim}</td>
          <td>${item.status}</td>
          <td>${item.scanType}</td>
          <td>${new Date(item.waktu).toLocaleString("id-ID")}</td>
      </tr>
    `;
  });
}

function buildQuery(query){

    if(current?.ekspedisi?.length){

        query = query.in(
            "ekspedisi",
            current.ekspedisi
        );

    }

    if(appState.filter.scanDateFrom){

        query = query.gte(
            "created_at",
            `${appState.filter.scanDateFrom}T00:00:00`
        );

    }

    if(appState.filter.scanDateTo){

        query = query.lte(
            "created_at",
            `${appState.filter.scanDateTo}T23:59:59`
        );

    }

    return query;

}

function renderRow(item){

    return `
        <tr>
            <td>${item.resi}</td>
            <td>${item.ekspedisi}</td>
            <td>${item.Pengirim}</td>
            <td>${item.status}</td>
            <td>${item.scanType}</td>
            <td>${item.created_at}</td>
        </tr>
    `;

}

// setupPagination({

//     table: "scan_awb",

//     tbodyId: "tableBody",

//     buildQuery(query){

//         // Filter platform
//         if(current?.ekspedisi?.length){

//             query = query.in(
//                 "ekspedisi",
//                 current.ekspedisi
//             );

//         }

//         // Filter tanggal scan mulai
//         if(appState.filter.scanDateFrom){

//             query = query.gte(
//                 "created_at",
//                 `${appState.filter.scanDateFrom}T00:00:00`
//             );

//         }

//         // Filter tanggal scan akhir
//         if(appState.filter.scanDateTo){

//             query = query.lte(
//                 "created_at",
//                 `${appState.filter.scanDateTo}T23:59:59`
//             );

//         }

//         return query;

//     },

//     renderRow(item){

//         return `
//             <tr>
//                 <td>${item.resi}</td>
//                 <td>${item.ekspedisi}</td>
//                 <td>${item.Pengirim}</td>
//                 <td>${item.status}</td>
//                 <td>${item.created_at}</td>
//             </tr>
//         `;

//     }

// });

async function initTable(){

    await setupPagination({

        table:"scan_awb",

        tbodyId:"tableBody",

        buildQuery,

        renderRow

    });

    await refreshSummary();

}
// setup TOOLBAR
// =============

setupToolbar({

    title: "Inbound",

    search: true,

    refresh: true,

     filters: {
        ekspedisi: true,
        scanDate: true

    },

    summary:{

        rpc:"get_inbound_summary",

        getParams(){

            return{

                p_ekspedisi:
                current?.ekspedisi,

                p_date_from:
                appState.filter.scanDateFrom,

                p_date_to:
                appState.filter.scanDateTo

            };

        }

    }

});
window.reloadCurrentPage = initTable;

// Load pertama
initTable();


window.reloadCurrentPage();
// ======================
// REPAIR DATA LAMA
// ======================

// async function repairEkspedisi() {

//   const { data } =
//   await client
//   .from("scan_awb")
//   .select("*")
//   .is("ekspedisi", null);

//   for (const item of data) {

//     const ekspedisi =
//     detectExpedisi(item.resi);

//     await client
//     .from("scan_awb")
//     .update({

//       ekspedisi

//     })
//     .eq("id", item.id);

//     console.log(
//       item.resi,
//       ekspedisi
//     );

//   }

//   console.log(
//     "Repair selesai 😎"
//   );

// }
// repairEkspedisi();
