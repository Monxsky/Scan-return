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
    "retur_manifest",
    renderManifest
  );

}
  
  // 1. ambil data existing dari Supabase
  const existingRes = await fetch(
    `${SUPABASE_URL}/rest/v1/retur_manifest?select=resi`,
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
    `${SUPABASE_URL}/rest/v1/retur_manifest`,
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

async function loadPage(page) {

  currentPage = page;

  const from = (currentPage - 1) * limit;
  const to = from + (limit - 1);

  const { data, error } = await client
    .from("retur_manifest")
    .select("*")
    .range(from, to);

  console.log(data);

  const tbody =
    document.getElementById("manifestBody");

  tbody.innerHTML = "";

  if (!data || data.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="3">
          Belum ada data
        </td>
      </tr>
    `;

    return;
  }

  data.reverse().forEach(item => {

    tbody.innerHTML += `
      <tr>
        <td>${item.resi}</td>
        <td>${item.status}</td>
        <td>${item.created_at}</td>
      </tr>
    `;
  });

  setupPagination();
}

setupPagination();
loadPage(1);
