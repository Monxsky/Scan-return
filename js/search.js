
async function globalSearch() {

  const keyword =
    document.getElementById("searchInput")
    .value
    .trim();

  if (!keyword) return;

  try {

    // cari manifest
    const manifestRes = await fetch(
      `${SUPABASE_URL}/rest/v1/retur_manifest?select=*&resi=ilike.*${keyword}*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const manifestData =
      await manifestRes.json();

    // cari inbound
    const inboundRes = await fetch(
      `${SUPABASE_URL}/rest/v1/scan_awb?select=*&resi=ilike.*${keyword}*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const inboundData =
      await inboundRes.json();

    renderGlobalResult(
      manifestData,
      inboundData
    );

  } catch(err) {

    console.log(err);

    alert("Search gagal!");

  }

}
