async function loadData() {

  // ambil scan
  const scanRes = await fetch(
    `${SUPABASE_URL}/rest/v1/scan_awb?select=*`,
    {
      headers:{
        apikey: SUPABASE_KEY,
        Authorization:
          `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const scans =
    await scanRes.json();

  // hitung dashboard
  const totalPerjalanan =
    manifest.length;

  const scannedResi =
    scans.map(s => s.resi);

  const sudahTiba =
    manifest.filter(m =>
      scannedResi.includes(m.resi)
    ).length;

  const belumTiba =
    totalPerjalanan - sudahTiba;

  // render card
  document.getElementById(
    "totalPerjalanan"
  ).innerText = totalPerjalanan;

  document.getElementById(
    "totalTiba"
  ).innerText = sudahTiba;

  document.getElementById(
    "belumTiba"
  ).innerText = belumTiba;

}

loadData();

setInterval(loadData, 3000);