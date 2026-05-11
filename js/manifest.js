async function loadManifest() {

    
const response = await fetch(
  `${SUPABASE_URL}/rest/v1/retur_manifest`,
  {
    method: "POST",

    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization":
        `Bearer ${SUPABASE_KEY}`,
      "Content-Type":
        "application/json",
      "Prefer":
        "resolution=ignore-duplicates"
    },

    body: JSON.stringify(payload)
  }
);
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/retur_manifest?select=*`,
    {
      headers:{
        apikey: SUPABASE_KEY,
        Authorization:
          `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const data = await res.json();

  const tbody =
    document.getElementById(
      "manifestBody"
    );

  tbody.innerHTML = "";

  data.reverse().forEach(item => {

    tbody.innerHTML += `
      <tr>
        <td>${item.resi}</td>
        <td>${item.status}</td>
      </tr>
    `;

  });

}

loadManifest();