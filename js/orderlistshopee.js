async function loadOrderListShopee() {

  const { data, error } =
    await client
    .from("order_list")
    .select("*")
    .in("ekspedisi", [
      "SPX",
      "Shopee Express"
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
loadOrdeListShopee();