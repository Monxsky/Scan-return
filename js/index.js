const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {

  sidebar.classList.toggle("show");

});

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

// ==========================
// START DASHBOARD
// ==========================
loadData();
setupRealtime();
