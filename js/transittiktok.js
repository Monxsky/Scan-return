// function isTransitToday(order){
//   const transitDate =
//   getBatasKirim(order);

//   const today =
//   new Date()
//   .toISOString()
//   >split("T")[0];

//   return transitDate === today;
// }

async function loadTransitShopee() {

  const { data, error } =
    await client
      .from("order_list")
      .select("*")
      .eq("ekspedisi", "SPX");

}

const transitOrders =
  data.filter(order => {

    return isTransitToday(order);

  });

  renderTransitTable(
  transitOrders
);