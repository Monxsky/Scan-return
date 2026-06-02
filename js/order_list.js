
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


function doSearch() {

  searchResi(
    "order_list",
    renderManifest
  );

}
  
  // 1. ambil data existing dari Supabase
  const existingRes = await fetch(
    `${SUPABASE_URL}/rest/v1/order_list?select=resi`,
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
    `${SUPABASE_URL}/rest/v1/order_list`,
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
    detectExpedisi(resi);

  await client
  .from("order_list")
  .insert([{

    resi,
    ekspedisi,
    pengirim,
    status,
    batas_kirim,

  }]);

}

setupPagination({

  table:"order_list",

  tbodyId:"manifestBody",

  renderRow:(item)=>`

    <tr>
      <td>${item.resi}</td>
      <td>${item.ekspedisi}</td>
      <td>${item.Pengirim}</td>
      <td>${item.status}</td>
      <td>${item.batas_kirim}</td>
      <td>${item.created_at}</td>
    </tr>

  `
});

loadPage({

  page:1,

  table:"order_list",

  tbodyId:"manifestBody",

  renderRow:(item)=>`

    <tr>
      <td>${item.resi}</td>
      <td>${item.ekspedisi}</td>
      <td>${item.Pengirim}</td>
      <td>${item.status}</td>
      <td>${item.batas_kirim}</td>
      <td>${item.created_at}</td>
    </tr>

  `
});

async function repairEkspedisi() {

  const { data, error } =
  await client
  .from("order_list")
  .select("*")
  .is("ekspedisi", null);

  if (error) {

    console.log(error);

    return;

  }

  for (const item of data) {

    const ekspedisi =
    detectExpedisi(item.resi);

    await client
    .from("order_list")
    .update({

      ekspedisi

    })
    .eq("id", item.id);

  }

  console.log("Repair selesai 😎");

}
repairEkspedisi();
