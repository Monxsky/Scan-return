
async function searchResi(
  tableName,
  renderFunction
) {

  const keyword =
    document.getElementById("searchInput")
    .value
    .trim();

  // kalau kosong load semua lagi
  if (!keyword) {

    loadData();

    return;
  }

  try {

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${tableName}?resi=ilike.*${keyword}*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await res.json();

    renderFunction(data);

  } catch(err) {

    console.log(err);

    alert("Gagal mencari data!");

  }

}
