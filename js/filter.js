
// async function filterByDate(
//   tableName,
//   startDate,
//   endDate
// ) {

//   const res = await fetch(
//     `${SUPABASE_URL}/rest/v1/${tableName}?select=*&waktu=gte.${startDate}T00:00:00&waktu=lt.${endDate}T23:59:59&order=waktu.desc`,
//     {
//       headers: {
//         apikey: SUPABASE_KEY,
//         Authorization: `Bearer ${SUPABASE_KEY}`
//       }
//     }
//   );

//   return await res.json();

// }


// // khusus inbound
// async function filterTanggal() {

//   const start =
//     document.getElementById("startDate").value;

//   const end =
//     document.getElementById("endDate").value;

//   const data = await filterByDate(
//     "scan_awb",
//     start,
//     end
//   );

//   renderTable(data);
//   console.log("FILTER JS MASUK");

// }

async function filterByDate(
  tableName,
  dateColumn,
  startDate,
  endDate
) {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${tableName}?select=*&${dateColumn}=gte.${startDate}T00:00:00&${dateColumn}=lt.${endDate}T23:59:59&order=${dateColumn}.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  return await res.json();
}

// INBOUND //
const data = await filterByDate(
  "scan_awb",
  "waktu",
  start,
  end
);

// MANIFEST //
const data = await filterByDate(
  "retur_manifest",
  "created_at",
  start,
  end
);
