
// ==========================
// Hitung Data
// ==========================

async function getCount(
    table,
    statusColumn,
    status,
    marketplace,
    dateColumn = "created_at",
    dateFrom = null,
    dateTo = null
) {

    let query = client
        .from(table)
        .select("*", {
            count: "exact",
            head: true
        })
        .eq(statusColumn, status)
        .eq("marketplace", marketplace);

    if (dateFrom) {
        query = query.gte(dateColumn, dateFrom);
    }

    if (dateTo) {
        query = query.lte(dateColumn, dateTo + "T23:59:59");
    }

    const { count, error } = await query;

    if (error) {
        console.error(error);
        return 0;
    }

    return count || 0;

}

// ==========================
// Load Report
// ==========================

async function loadReport() {

    const dateFrom =
        document.getElementById("date-from").value || null;

    const dateTo =
        document.getElementById("date-to").value || null;


    // ==========================
    // SHOPEE
    // ==========================

    document.getElementById("shopee-masuk").textContent =
        await getCount(
            "daftar_pesanan",
            "status",
            "READY_TO_SHIP",
            "SHOPEE_ID",
            "created_at",
            dateFrom,
            dateTo
        );

    document.getElementById("shopee-dikirim").textContent =
        await getCount(
            "daftar_pesanan",
            "status",
            "SHIPPING",
            "SHOPEE_ID",
            "created_at",
            dateFrom,
            dateTo
        );

    document.getElementById("shopee-batal").textContent =
        await getCount(
            "daftar_pesanan",
            "status",
            "CANCELLED",
            "SHOPEE_ID",
            "created_at",
            dateFrom,
            dateTo
        );

    document.getElementById("shopee-retur").textContent =
        await getCount(
            "pesanan_retur",
            "return_status",
            "RETURNED",
            "SHOPEE_ID",
            "scan_at",
            dateFrom,
            dateTo
        );

    document.getElementById("shopee-rejected").textContent =
        await getCount(
            "scan_awb",
            "status",
            "DELIVERY_FAILED_RETURN",
            "SHOPEE_ID",
            "created_at",
            dateFrom,
            dateTo
        );


    // ==========================
    // TIKTOK
    // ==========================

    document.getElementById("tiktok-masuk").textContent =
        await getCount(
            "daftar_pesanan",
            "status",
            "READY_TO_SHIP",
            "TIKTOK_ID",
            "created_at",
            dateFrom,
            dateTo
        );

    document.getElementById("tiktok-dikirim").textContent =
        await getCount(
            "daftar_pesanan",
            "status",
            "SHIPPING",
            "TIKTOK_ID",
            "created_at",
            dateFrom,
            dateTo
        );

    document.getElementById("tiktok-batal").textContent =
        await getCount(
            "daftar_pesanan",
            "status",
            "CANCELLED",
            "TIKTOK_ID",
            "created_at",
            dateFrom,
            dateTo
        );

    document.getElementById("tiktok-retur").textContent =
        await getCount(
            "pesanan_retur",
            "status",
            "RETURNED",
            "TIKTOK_ID",
            "scan_at",
            dateFrom,
            dateTo
        );

    document.getElementById("tiktok-rejected").textContent =
        await getCount(
            "scan_awb",
            "return_status",
            "DELIVERY_FAILED_RETURN",
            "TIKTOK_ID",
            "created_at",
            dateFrom,
            dateTo
        );

}

// ==========================
// Init
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const today = new Date().toISOString().split("T")[0];

    document.getElementById("date-from").value = today;
    document.getElementById("date-to").value = today;

    document
        .getElementById("btn-report")
        .addEventListener("click", loadReport);

    loadReport();

});
