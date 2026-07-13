
// ==========================
// Hitung Data
// ==========================

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
            "READY_TO_SHIP",
            "SHOPEE_ID",
            dateFrom,
            dateTo
        );

    document.getElementById("shopee-dikirim").textContent =
        await getCount(
            "daftar_pesanan",
            "SHIPPING",
            "SHOPEE_ID",
            dateFrom,
            dateTo
        );

    document.getElementById("shopee-batal").textContent =
        await getCount(
            "daftar_pesanan",
            "CANCELLED",
            "SHOPEE_ID",
            dateFrom,
            dateTo
        );

    document.getElementById("shopee-retur").textContent =
        await getCount(
            "pesanan_retur",
            "RETURNED",
            "SHOPEE_ID",
            dateFrom,
            dateTo
        );

    document.getElementById("shopee-rejected").textContent =
        await getCount(
            "daftar_pesanan",
            "REJECTED",
            "SHOPEE_ID",
            dateFrom,
            dateTo
        );


    // ==========================
    // TIKTOK
    // ==========================

    document.getElementById("tiktok-masuk").textContent =
        await getCount(
            "daftar_pesanan",
            "READY_TO_SHIP",
            "TIKTOK_ID",
            dateFrom,
            dateTo
        );

    document.getElementById("tiktok-dikirim").textContent =
        await getCount(
            "daftar_pesanan",
            "SHIPPING",
            "TIKTOK_ID",
            dateFrom,
            dateTo
        );

    document.getElementById("tiktok-batal").textContent =
        await getCount(
            "daftar_pesanan",
            "CANCELLED",
            "TIKTOK_ID",
            dateFrom,
            dateTo
        );

    document.getElementById("tiktok-retur").textContent =
        await getCount(
            "pesanan_retur",
            "RETURNED",
            "TIKTOK_ID",
            dateFrom,
            dateTo
        );

    document.getElementById("tiktok-rejected").textContent =
        await getCount(
            "daftar_pesanan",
            "REJECTED",
            "TIKTOK_ID",
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