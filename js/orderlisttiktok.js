async function loadOrderListTikTok() {

  const { data, error } =
    await client
    .from("order_list")
    .select("*")
    .in("ekspedisi", [
      "J&T",
      "J&T Express",
      "Sicepat"
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
          <td>${item.Pengirim}</td>
          <td>${item.ekspedisi}</td>
          <td>${item.status}</td>
          <td>${new Date(item.created_at).toLocaleString("id-ID")}</td>
        </tr>
      `;
    });
}
loadOrderListTikTok();
