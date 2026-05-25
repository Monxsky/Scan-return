// const menuBtn =
// document.getElementById("menuBtn");

// const sidebar =
// document.querySelector(".sidebar");

// menuBtn.addEventListener("click", () => {

//   sidebar.classList.toggle("show");

// });

async function loadInboundShopee() {

  const { data, error } =
    await client
    .from("scan_awb")
    .select("*")
    .in("ekspedisi", [
      "SPX",
      "SPX EXPRESS"
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
loadInboundShopee();
