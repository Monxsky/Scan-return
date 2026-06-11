function isTransitToday(order){
  const transitDate =
  getBatasKirim(order);

  const today =
  new Date()
  .toISOString()
  >split("T")[0];

  return transitDate === today;
}