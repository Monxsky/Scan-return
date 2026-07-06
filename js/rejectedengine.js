async function syncRejectedOrder(order) {

  const isRejected =
    order.is_rejected === true ||
    order.order_status === "CANCELLED";

  if (!isRejected) return "NOT_REJECTED";

  await client
    .from("pesanan_retur")
    .upsert(
      [{
        order_id: order.order_id,
        marketplace_order_id: order.marketplace_order_id,
        tracking_number: order.tracking_number,
        marketplace: order.marketplace,
        return_status: "REJECTED_AUTO",
        process_status: "SYNC_ENGINE",
        created_at: new Date().toISOString()
      }],
      { onConflict: "marketplace_order_id" }
    );

  const { error } = await client
    .from("daftar_pesanan")
    .update({
      is_rejected: true,
      rejected_detected_at: new Date().toISOString()
    })
    .eq("marketplace_order_id", order.marketplace_order_id);

  if (error) {
    console.log("UPDATE ERROR:", error);
  }

  return "SYNCED";
}

window.syncRejectedOrder = syncRejectedOrder;

async function runRejectedSyncBatch() {

  const { data } = await client
    .from("daftar_pesanan")
    .select("*")
    .eq("order_status", "CANCELLED")
    .eq("is_rejected", false);

  if (!data || data.length === 0) return;

  for (const order of data) {
    const result = await syncRejectedOrder(order);
    console.log(order.marketplace_order_id, result);
  }

  console.log("SYNC REJECTED DONE");
}
