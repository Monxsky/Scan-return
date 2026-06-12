async function loadOrderListTikTok() {

  const { data, error } =
    await client
    .from("order_list")
    .select("*")
    .in("ekspedisi", [
      "J&T",
      "J&T Express",
      "SiCepat"
    ]);


  const transitData =
  data.filter(item => {

    return isTransitToday(item);

    console.log(
  item.resi,
  item.batas_kirim,
  item.ekspedisi,
  item.batas_kirim
);

  });

    if (error) {
    console.error("Supabase Error:", error);
    return;
  }

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  transitData
    .slice()
    .reverse()
    .forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td>${item.resi}</td>
          <td>${item.Pengirim}</td>
          <td>${item.ekspedisi}</td>
          <td>${item.status}</td>
          <td>${item.batas_kirim}</td>
          <td>${new Date(item.created_at).toLocaleString("id-ID")}</td>
        </tr>
      `;
    });
}
loadOrderListTikTok();

function isTransitToday(item){

  const today =
    new Date()
      .toLocaleDateString("sv-SE");

  // SPX & J&T
  if(item.batas_kirim){

    return item.batas_kirim === today;

  }

  // SiCepat
  if(item.ekspedisi === "SiCepat"){

    const created =
      new Date(item.created_at);

    const jam =
      created.getHours();

    let transitDate =
      new Date(created);

    if(jam >= 15){

      transitDate.setDate(
        transitDate.getDate() + 1
      );

    }

    return (
      transitDate
        .toLocaleDateString("sv-SE")
      ===
      today
    );
  }

  return false;
}
