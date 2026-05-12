
let channel;

// ==========================
// LOAD DATA DASHBOARD
// ==========================
async function loadData() {

  try {

    // ambil manifest
    const manifestRes = await fetch(
      `${SUPABASE_URL}/rest/v1/retur_manifest?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const manifest = await manifestRes.json();

    // ambil scan
    const scanRes = await fetch(
      `${SUPABASE_URL}/rest/v1/scan_awb?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const scans = await scanRes.json();

    const scannedResi = scans.map(s => s.resi);

    // total
    const totalPerjalanan = manifest.length;

    // sudah tiba
    const sudahTiba = manifest.filter(m =>
      scannedResi.includes(m.resi)
    ).length;

    // belum tiba
    const belumTiba = totalPerjalanan - sudahTiba;

    // render card
    document.getElementById("totalPerjalanan").innerText = totalPerjalanan;
    document.getElementById("totalTiba").innerText = sudahTiba;
    document.getElementById("belumTiba").innerText = belumTiba;

  } catch (err) {
    console.log("ERROR LOAD DATA:", err);
  }
}


// ==========================
// REALTIME SUPABASE LISTENER
// ==========================
function setupRealtime() {

  channel = supabase
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

  tbody.innerHTML = "";

  // manifest
  manifest.forEach(item => {

    tbody.innerHTML += `
      <tr>
        <td>${item.resi}</td>
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
        <td>
          ${new Date(item.waktu)
            .toLocaleString('id-ID')}
        </td>
      </tr>
    `;

  });

}

// ==========================
// START DASHBOARD
// ==========================
loadData();
setupRealtime();
