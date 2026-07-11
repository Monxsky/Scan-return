// async function scanResi() {

//   const resi =
//   document
//   .getElementById("resiInput")
//   .value;

//   const ekspedisi =
//     detectExpedisi(resi);

//   await client
//   .from("inbound")
//   .insert([{

//     resi,
//     ekspedisi,
//     status,
//     created_at,

//   }]);

// }

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
      "ID",
      "SPX Hemat",
      "SPX Standard"
    ]
  },

  tiktok: {
    title:
      "SCAN INBOUND TIKTOK",

    ekspedisi: [
      "J&T",
      "J&T Express",
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
// load inbound  //
// async function loadInbound() {

//   let query =
//   client
//     .from("scan_awb")
//     .select("*");

// if (
//   current &&
//   current.ekspedisi.length > 0
// ) {

//   query =
//     query.in(
//       "ekspedisi",
//       current.ekspedisi
//     );

// }

// const {
//   data,
//   error
// } = await query;

// if (error) {
//     console.error("Supabase Error:", error);
//     return;
//   }

//   console.log(
//     "Platform:",
//     platform
//     );
  
//   console.log(
//     "Filter:",
//     current?.ekspedisi
//     );

//   const tbody = document.getElementById("tableBody");
//   tbody.innerHTML = "";

//   data
//     .slice()
//     .reverse()
//     .forEach(item => {
//       tbody.innerHTML += `
//         <tr>
//           <td>${item.resi}</td>
//           <td>${item.ekspedisi}</td>
//           <td>${item.Pengirim}</td>
//           <td>${item.status}</td>
//           <td>${new Date(item.created_at).toLocaleString("id-ID")}</td>
//         </tr>
//       `;
//     });
// }
function buildQuery(query){
console.log("FILTER =", appState.filter);
    if(current?.ekspedisi?.length){

        query = query.in(
          "ekspedisi",
          current.ekspedisi
      );

     }

     if(appState.filter.scanDateFrom){

        query = query.gte(
            "created_at",
            `${appState.filter.scanDateFrom}T00:00:00+07:00`
        );

    }


    if(appState.filter.scanDateTo){

        query = query.lte(
            "created_at",
            `${appState.filter.scanDateTo}T23:59:59+07:00`
        );

    }

    return query;

}
function renderRow(item){

    return `
        <tr>
            <td>${item.resi}</td>
            <td>${item.ekspedisi ?? "-"}</td>
            <td>${item.Pengirim ?? "-"}</td>
            <td>${item.status ?? "-"}</td>
            <td>${item.scan_type}</td>
            <td>${
                  item.created_at
                  ? new Date(item.created_at).toLocaleString("id-ID")
                  : "-"
                  }</td>
                      `;

}
async function initTable(){

    console.log("1. sebelum setupPagination");

    await setupPagination({

        table:"scan_awb",

        tbodyId:"tableBody",

        buildQuery,

        renderRow

    });
 console.log("2. setelah setupPagination");
    await refreshSummary();
 console.log("3. setelah refreshSummary");
}
// setup TOOLBAR
// =============

setupToolbar({

    title: "Inbound",

    search: true,

    refresh: true,

     filters: {
        // ekspedisi: true,
        scanDate: true

    },

    summary:{

        rpc:"get_inbound_summary",

        getParams(){

            return{

                p_ekspedisi:
                current?.ekspedisi || null,

                p_date_from:
                appState.filter.scanDateFrom || null,

                p_date_to:
                appState.filter.scanDateTo || null
            };

        }

    }

});
window.reloadCurrentPage = initTable;

// Load pertama
initTable();

