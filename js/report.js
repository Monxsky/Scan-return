async function getCount(table, status, marketplace) {

    const { count, error } = await supabase
        .from(table)
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("status", status)
        .eq("marketplace", marketplace);

    if (error) {
        console.error(error);
        return 0;
    }

    return count || 0;
}

async function loadReport() {

    // ==========================
    // SHOPEE
    // ==========================

    document.getElementById("shopee-masuk").textContent =
        await getCount("daftar_pesanan", "READY_TO_SHIP", "SHOPEE_ID");

    document.getElementById("shopee-dikirim").textContent =
        await getCount("daftar_pesanan", "SHIPPING", "SHOPEE_ID");

    document.getElementById("shopee-batal").textContent =
        await getCount("daftar_pesanan", "CANCELLED", "SHOPEE_ID");

    document.getElementById("shopee-retur").textContent =
        await getCount("pesanan_retur", "RETURNED", "SHOPEE_ID");

    document.getElementById("shopee-rejected").textContent =
        await getCount("daftar_pesanan", "REJECTED", "SHOPEE_ID");


    // ==========================
    // TIKTOK
    // ==========================

    document.getElementById("tiktok-masuk").textContent =
        await getCount("daftar_pesanan", "READY_TO_SHIP", "TIKTOK");

    document.getElementById("tiktok-dikirim").textContent =
        await getCount("daftar_pesanan", "SHIPPING", "TIKTOK");

    document.getElementById("tiktok-batal").textContent =
        await getCount("daftar_pesanan", "CANCELLED", "TIKTOK");

    document.getElementById("tiktok-retur").textContent =
        await getCount("pesanan_retur", "RETURNED", "TIKTOK");

    document.getElementById("tiktok-rejected").textContent =
        await getCount("daftar_pesanan", "REJECTED", "TIKTOK");

}

loadReport();