async function getCount(
    table,
    status,
    marketplace,
    dateFrom = null,
    dateTo = null
) {

    let query = client
        .from(table)
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("status", status)
        .eq("marketplace", marketplace);

    if (dateFrom) {
        query = query.gte("created_at", dateFrom);
    }

    if (dateTo) {
        query = query.lte("created_at", dateTo + "T23:59:59");
    }

    const { count, error } = await query;

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

    // document.getElementById("shopee-masuk").textContent =
    //     await getCount("daftar_pesanan", "READY_TO_SHIP", "SHOPEE_ID");

    // document.getElementById("shopee-dikirim").textContent =
    //     await getCount("daftar_pesanan", "SHIPPING", "SHOPEE_ID");

    // document.getElementById("shopee-batal").textContent =
    //     await getCount("daftar_pesanan", "CANCELLED", "SHOPEE_ID");

    // document.getElementById("shopee-retur").textContent =
    //     await getCount("pesanan_retur", "RETURNED", "SHOPEE_ID");

    // document.getElementById("shopee-rejected").textContent =
    //     await getCount("daftar_pesanan", "REJECTED", "SHOPEE_ID");
    const dateFrom =
    document.getElementById("date-from").value;

    const dateTo =
    document.getElementById("date-to").value;

    document.getElementById("shopee-masuk").textContent =
    await getCount(
        "daftar_pesanan",
        "READY_TO_SHIP",
        "SHOPEE_ID",
        dateFrom,
        dateTo
    );


    // ==========================
    // TIKTOK
    // ==========================

    // document.getElementById("tiktok-masuk").textContent =
    //     await getCount("daftar_pesanan", "READY_TO_SHIP", "TIKTOK_ID");

    // document.getElementById("tiktok-dikirim").textContent =
    //     await getCount("daftar_pesanan", "SHIPPING", "TIKTOK_ID");

    // document.getElementById("tiktok-batal").textContent =
    //     await getCount("daftar_pesanan", "CANCELLED", "TIKTOK_ID");

    // document.getElementById("tiktok-retur").textContent =
    //     await getCount("pesanan_retur", "RETURNED", "TIKTOK_ID");

    // document.getElementById("tiktok-rejected").textContent =
    //     await getCount("daftar_pesanan", "REJECTED", "TIKTOK_ID");

}

setupToolbar({

    title: "Report",

    search: true,

    refresh: true,

     filters: {
        // ekspedisi: true,
        scanDate: true,
        orderDate: true

    },
});


loadReport();