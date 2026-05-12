async function filterByDate(
  tableName,
  startDate,
  endDate
) {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${tableName}?select=*&waktu=gte.${startDate}T00:00:00&waktu=lte.${endDate}T23:59:59&order=waktu.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  return await res.json();
}
