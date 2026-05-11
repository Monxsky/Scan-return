
async function loadData() {

  // 1. ambil manifest
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

  // 2. ambil scan (inbound/log scan)
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

  // 3. resi yang sudah discan
  const scannedResi = scans.map(s => s.resi);

  // 4. total semua manifest
  const totalPerjalanan = manifest.length;

  // 5. yang sudah tiba (ada di scan)
  const sudahTiba = manifest.filter(m =>
    scannedResi.includes(m.resi)
  ).length;

  // 6. belum tiba
  const belumTiba = totalPerjalanan - sudahTiba;

  // 7. render card
  document.getElementById("totalPerjalanan").innerText = totalPerjalanan;
  document.getElementById("totalTiba").innerText = sudahTiba;
  document.getElementById("belumTiba").innerText = belumTiba;
}

// jalan pertama kali
loadData();

// auto refresh
setInterval(loadData, 3000);