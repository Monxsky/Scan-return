async function loadOrderListTikTok() {

  const { data, error } =
    await client
    .from("daftar_pesanan")
    .select("*")
    .in("marketplace", [
      "TIKTOK_ID"
    ]);

    if (error) {
    console.error("Supabase Error:", error);
    return;
  }

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data
    .slice()
    .reverse()
    .forEach(item => {
      tbody.innerHTML += `
        <tr>
        <td>${item.externalOrderId}</td>
          <td>${item.resi}</td>
          <td>${item.Pengirim}</td>
          <td>${item.ekspedisi}</td>
          <td>${item.status}</td>
          <td>${new Date(item.created_at).toLocaleString("id-ID")}</td>
        </tr>
      `;
    });
}
loadOrderListTikTok();
