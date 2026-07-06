async function syncRejectedOrder(order) {

  const isRejected =
    order.is_rejected === true ||
    order.order_status === "CANCELLED";

  if (!isRejected) return "NOT_REJECTED";

  const payload = {
    order_id: order.order_id,
    marketplace_order_id: order.marketplace_order_id,
    external_return_id: order.external_return_id || null,
    tracking_number: order.tracking_number,
    marketplace: order.marketplace,
    return_status: "REJECTED_AUTO",
    process_status: "SYNC_ENGINE",
    created_at: new Date().toISOString()
  };

  // UPSERT = idempotent layer
  const { error: upsertError } = await client
    .from("pesanan_retur")
    .upsert(payload, {
      onConflict: "marketplace_order_id"
    });

  if (upsertError) {
    console.log("UPSERT ERROR:", upsertError);
    return "FAILED";
  }

  // UPDATE daftar_pesanan (jangan ganggu kalau sudah true)
  const { error: updateError } = await client
    .from("daftar_pesanan")
    .update({
      is_rejected: true,
      rejected_detected_at: new Date().toISOString()
    })
    .eq("marketplace_order_id", order.marketplace_order_id);

  if (updateError) {
    console.log("UPDATE ERROR:", updateError);
  }

  return "SYNCED";
}

window.syncRejectedOrder = syncRejectedOrder;

// ===============================
// REJECTED BATCH SYNC ENGINE
// ===============================
async function runRejectedSyncBatch() {

  const { data } = await client
    .from("daftar_pesanan")
    .select("*")
    .eq("order_status", "CANCELLED")
    .eq("is_rejected", false);

  if (!data?.length) return;

  for (const order of data) {
    const result = await syncRejectedOrder(order);
    console.log("BATCH:", order.marketplace_order_id, result);
  }

  console.log("SYNC REJECTED DONE");
}
window.runRejectedSyncBatch = runRejectedSyncBatch;
