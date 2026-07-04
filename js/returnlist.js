let overdueMode = false;
renderToolbar({

    title: "Daftar Retur",

    filters: {
        returnStatus: true,
        ekspedisi: true,
        orderDate: true

    },
    search: true,
    syncScan: true,
    refresh: true

});
// console.log(document.getElementById("toolbar").innerHTML);

const params = new URLSearchParams(window.location.search);

const MARKETPLACE = params.get("marketplace");

// tombol SyncScan
async function syncOldScan(){

    const btn =
        document.getElementById("btnSyncScan");

    btn.disabled = true;
    btn.innerText = "⏳ Sync...";

    const { error } =
        await client.rpc("sync_old_scan");

    if(error){

        console.error(error);

        alert("❌ Gagal sinkronisasi");

    }else{

        alert("✅ Sinkronisasi selesai!");

        // Refresh card summary
        await loadSummary();

        // Refresh tabel
        await loadPage(1);

    }

    btn.disabled = false;
    btn.innerText = "🔄 Sync Scan";

}
const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {

  sidebar.classList.toggle("show");

});


const dropdownBtns =
  document.querySelectorAll(".dropdown-btn");

dropdownBtns.forEach((btn) => {

  btn.addEventListener("click", () => {

    const content =
      btn.nextElementSibling;

    content.classList.toggle("active");

  });

});


async function uploadCSV() {

  const file = document.getElementById("csvFile").files[0];

  if (!file) {
    alert("Pilih file CSV dulu bre");
    return;
  }

  const text = await file.text();

  const rows = text
    .split("\n")
    .map(r => r.trim())
    .filter(r => r.length > 0);

  const incoming = rows.map(r => {
    const cols = r.split(",");
    return {
      resi: cols[0]?.trim(),
      status: cols[1]?.trim() || "BELUM"
    };
  });
  
  // 1. ambil data existing dari Supabase
  const existingRes = await fetch(
    `${SUPABASE_URL}/rest/v1/pesanan_retur?select=resi`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const existingData = await existingRes.json();
  const existingSet = new Set(existingData.map(x => x.resi));

  // 2. filter duplikat
  const uniqueData = [];
  let duplicateCount = 0;

  incoming.forEach(item => {
    if (existingSet.has(item.resi)) {
      duplicateCount++;
    } else {
      uniqueData.push(item);
      existingSet.add(item.resi); // biar duplikat dalam CSV juga ketangkep
    }
  });

  // 3. notif hasil filter
  if (duplicateCount > 0) {
    alert(`⚠️ ${duplicateCount} resi duplikat tidak diimport`);
  }

  if (uniqueData.length === 0) {
    alert("Tidak ada data baru untuk diimport");
    return;
  }

  // 4. insert data unik saja
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/pesanan_retur`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates"
      },
      body: JSON.stringify(uniqueData)
    }
  );

  console.log("UPLOAD RESULT:", await res.json());

  alert(`✅ Upload sukses: ${uniqueData.length} data masuk`);

  loadManifest();
}



async function filterManifest() {

  const start =
    document.getElementById("startDate").value;

  const end =
    document.getElementById("endDate").value;

  const data = await filterByDate(
    "retur_manifest",
    start,
    end
  );

  renderManifest(data);
}

async function scanResi() {

  const resi =
  document
  .grtElementById("resiInput")
  .value;

  const ekspedisi =
    detectekspedisi(resi);

  await client
  .from("pesanan_retur")
  .insert([{

    marketplace_order_id,
    return_status,
    process_status,
    tracking_number,
    created_at,

  }]);

}
// FILTER SESUAI DI BUAT PESANAN
const orderDateFrom =
document.getElementById("orderDateFrom");

const orderDateTo =
document.getElementById("orderDateTo");

if(orderDateFrom){

    orderDateFrom.addEventListener("change",()=>{

        appState.filter.orderDateFrom =
            orderDateFrom.value;

        loadPage(1);

    });

}

if(orderDateTo){

    orderDateTo.addEventListener("change",()=>{

        appState.filter.orderDateTo =
            orderDateTo.value;

        loadPage(1);

    });

}

const returnStatusFilter =
    document.getElementById("returnStatusFilter");
    returnStatusFilter?.addEventListener("change", () => {

        window.appState.filter.returnStatus =
            returnStatusFilter.value;
        loadPage(1);
});

async function loadSummary(){

    const { data, error } = await client
        .from("v_pesanan_retur")
        .select("tracking_number, scan_at")
        .eq("marketplace", MARKETPLACE)
        .eq("is_active_return", true);

    if(error){

        console.error(error);
        return;

    }

    const filteredData = data.filter(
    item => item.tracking_number && item.tracking_number.trim() !== ""
);
    const total = filteredData.length;

    const scanned = data.filter(
        item => item.scan_at
    ).length;

    const pending = total - scanned;

    const progress = total > 0
        ? Math.round((scanned / total) * 100)
        : 0;

    document.getElementById("totalReturn").innerText =
        total;

    document.getElementById("totalScanned").innerText =
        scanned;

    document.getElementById("totalPending").innerText =
        pending;

    document.getElementById("scanProgress").innerText =
        `${progress}%`;

}

// SEARCH
const searchInput =
document.getElementById("searchInput");

if(searchInput){

    searchInput.addEventListener("input",()=>{

        window.appState.filter.search =
            searchInput.value;

        loadPage(1);

    });

}

// PAGINATION
setupPagination({

    table: "v_pesanan_retur",

    tbodyId: "manifestBody",

    renderRow(item){

        return `

            <tr>
                <td>${item.tracking_number}</td>
                <td>${item.marketplace_order_id}</td>
                <td>${item.nama_toko}</td>
                <td>${item.return_status}</td>
                <td>${item.process_status}</td>
                    <td>${
                        item.order_created_at
                        ? new Date(item.order_created_at).toLocaleString("id-ID")
                        : "-"
                    }</td>
                <td>${item.scan_at
                      ? `<span class="badge-green">✅ Sudah Scan</span>`
                      : '<span class="badge-red">❌ Belum Scan</span>'
                }
            </td>
            </tr>

        `;

    },

    buildQuery(query){

    query = query
        .eq("marketplace", MARKETPLACE)
        .eq("is_active_return", true);

    if(window.appState.filter.returnStatus){

        query = query.eq(
            "return_status",
            window.appState.filter.returnStatus
        );

    }
    if (overdueMode) {
        const sevenDaysAgo = new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString();

        query = query
        .eq("return_status", "RETURNING")
        .lte("returning_at", sevenDaysAgo);

    }

    if(window.appState.filter.orderDateFrom){

    query = query.gte(
        "order_created_at",
        window.appState.filter.orderDateFrom
    );

}

if(window.appState.filter.orderDateTo){

    query = query.lte(
        "order_created_at",
        window.appState.filter.orderDateTo + "T23:59:59"
    );

}

if(window.appState.filter.search){

    query = query.or(
        `tracking_number.ilike.%${window.appState.filter.search}%,marketplace_order_id.ilike.%${window.appState.filter.search}%`
    );

}
        
    return query;

}

});

loadSummary();

const btnSyncScan =
document.getElementById(
    "btnSyncScan"
);

if(btnSyncScan){

    btnSyncScan.addEventListener(
        "click",
        syncOldScan
    );

}
window.addEventListener("show-overdue", () => {

    overdueMode = true;

     loadPage(1);

});
console.log("Filter:", window.appState.filter.returnStatus);
// loadReturnList();

// async function repairEkspedisi() {

//   const { data, error } =
//   await client
//   .from("order_list")
//   .select("*")
//   .is("ekspedisi", null);

//   if (error) {

//     console.log(error);

//     return;

//   }

//   for (const item of data) {

//     const ekspedisi =
//     detectekspedisi(item.resi);

//     await client
//     .from("order_list")
//     .update({

//       ekspedisi

//     })
//     .eq("id", item.id);

//   }

//   console.log("Repair selesai 😎");

// }
// repairEkspedisi();
