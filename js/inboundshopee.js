const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {

  sidebar.classList.toggle("show");

});

async function loadInboundTikTok() {

  const { data, error } =
    await client
    .from("scan_awb")
    .select("*")
    .in("ekspedisi", [
      "SPX",

    ]);

  if (error) {
    console.error(error);
    return;
  }

  renderTable(data);

}