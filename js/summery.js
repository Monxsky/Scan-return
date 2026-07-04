async function loadInboundSummary() {

    const { data, error } =
    await client.rpc(
        "get_inbound_summary",
        {
            p_ekspedisi:
            current?.ekspedisi || null
        }
    );

    if(error){

        console.error(error);
        return;

    }

    if(!data.length) return;

    const summary = data[0];

    document.getElementById("totalScan").textContent =
        summary.total_scan;

    document.getElementById("todayScan").textContent =
        summary.scan_hari_ini;

    document.getElementById("lastScan").textContent =
        summary.last_scan
        ? new Date(summary.last_scan)
            .toLocaleString("id-ID")
        : "-";

}
