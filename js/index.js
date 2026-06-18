// const menuBtn =
// document.getElementById("menuBtn");

// const sidebar =
// document.querySelector(".sidebar");

// menuBtn.addEventListener("click", () => {

//   sidebar.classList.toggle("show");

// });

let channel;

// ==========================
// LOAD DATA DASHBOARD
// ==========================
async function loadData() {

  try {

    const { data: manifest, error: manifestError } =
      await client
        .from("retur_manifest")
        .select("*");

    const { data: scans, error: scanError } =
      await client
        .from("scan_awb")
        .select("*");

    if (manifestError || scanError) {
      console.log(manifestError || scanError);
      return;
    }

    const scannedResi = scans.map(s => s.resi);

    const totalPerjalanan = manifest.length;

    const sudahTiba = manifest.filter(m =>
      scannedResi.includes(m.resi)
    ).length;

    const belumTiba = totalPerjalanan - sudahTiba;

    document.getElementById("totalPerjalanan").innerText =
      totalPerjalanan;

    document.getElementById("totalTiba").innerText =
      sudahTiba;

    document.getElementById("belumTiba").innerText =
      belumTiba;

  } catch (err) {

    console.log("ERROR LOAD DATA:", err);

  }

}


// ==========================
// REALTIME SUPABASE LISTENER
// ==========================
function setupRealtime() {

  channel = client
    .channel('dashboard-live')

    // kalau scan berubah
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'scan_awb'
    }, () => {
      loadData();
    })

    // kalau manifest berubah
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'retur_manifest'
    }, () => {
      loadData();
    })

    .subscribe();

}

// ==========================
// SEARCH GLOBAL
// ==========================


function renderGlobalResult(
  manifest,
  inbound
) {

  const tbody =
    document.getElementById("tableBody");
  
   if (!tbody) return;

  tbody.innerHTML = "";

  // manifest
  manifest.forEach(item => {

    tbody.innerHTML += `
      <tr>
        <td>${item.resi}</td>
        <td>${item.ekspedisi}</td>
        <td>MANIFEST</td>
        <td>${item.status}</td>
      </tr>
    `;

  });

  // inbound
  inbound.forEach(item => {

    tbody.innerHTML += `
      <tr>
        <td>${item.resi}</td>
        <td>INBOUND</td>
        <td>${item.ekspedisi}</td>
        <td>${item.status}</td>
        <td>
          ${new Date(item.waktu)
            .toLocaleString('id-ID')}
        </td>
      </tr>
    `;

  });

}
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


// ==========================
// START DASHBOARD
// ==========================
loadData();
setupRealtime();
