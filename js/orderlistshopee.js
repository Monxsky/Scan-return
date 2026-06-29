async function loadOrderListShopee() {

  const { data, error } =
    await client
    .from("daftar_pesanan")
    .select("*")
    .in("marketplace", [
      "SHOPEE_ID"
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
          <td>${item.resi}</td>
          <td>${item.ekspedisi}</td>
          <td>${item.status}</td>
          <td>${new Date(item.waktu).toLocaleString("id-ID")}</td>
        </tr>
      `;
    });
}
loadOrderListShopee();
