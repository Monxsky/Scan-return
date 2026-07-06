async function syncRejectedOrder(order) {

  const isRejected =
    order.is_rejected === true ||
    order.order_status === "CANCELLED";

  if (!isRejected) return false;

  // cek biar gak double insert
  const { data: exist } = await client
    .from("pesanan_retur")
    .select("id")
    .eq("marketplace_order_id", order.marketplace_order_id)
    .maybeSingle();

  if (exist) return "ALREADY_EXIST";

  // INSERT ke pesanan_retur
  await client
    .from("pesanan_retur")
    .insert([{
      order_id: order.order_id,
      marketplace_order_id: order.marketplace_order_id,
      tracking_number: order.tracking_number,
      marketplace: order.marketplace,
      return_status: "REJECTED_AUTO",
      process_status: "SYNC_ENGINE",
      created_at: new Date().toISOString()
    }]);

  // UPDATE daftar_pesanan
  await client
    .from("daftar_pesanan")
    .update({
      is_rejected: true,
      rejected_detected_at: new Date().toISOString()
    })
    .eq("marketplace_order_id", order.marketplace_order_id);

  return "SYNCED";
}
window.syncRejectedOrder = syncRejectedOrder;

async function runRejectedSyncBatch() {

  const { data } = await client
    .from("daftar_pesanan")
    .select("*")
    .eq("order_status", "CANCELLED")
    .eq("is_rejected", false);

  for (const order of data) {
    await syncRejectedOrder(order);
  }

  console.log("SYNC REJECTED DONE");
}
