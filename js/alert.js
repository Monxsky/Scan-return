async function loadReturnAlert() {

    const sevenDaysAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await client
        .from("pesanan_retur")
        .select("tracking_number, marketplace_order_id, nama_toko, returning_at")
        .eq("return_status", "RETURNING")
        .lte("returning_at", sevenDaysAgo);

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

document.addEventListener("DOMContentLoaded", async () => {

    const alerts = await loadReturnAlert();

    console.log(alerts);

});
