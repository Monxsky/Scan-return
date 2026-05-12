
async function globalSearch() {

  const keyword =
    document.getElementById("searchInput")
    .value
    .trim();

  console.log(keyword);

  if (!keyword) return;

  try {

    // manifest
    const manifestRes = await fetch(
      `${SUPABASE_URL}/rest/v1/retur_manifest?select=*&resi=ilike.*${encodeURIComponent(keyword)}*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const manifestData =
      await manifestRes.json();

    console.log(manifestData);

    // inbound
    const inboundRes = await fetch(
      `${SUPABASE_URL}/rest/v1/scan_awb?select=*&resi=ilike.*${encodeURIComponent(keyword)}*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const inboundData =
      await inboundRes.json();

    console.log(inboundData);

    renderGlobalResult(
      manifestData,
      inboundData
    );

  } catch(err) {

    console.log(err);

    alert("Search gagal!");

  }

}
