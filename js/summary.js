async function loadInboundSummary() {

    const { data, error } =
    await client.rpc(
        "get_inbound_summary",
        {
            p_ekspedisi:
            current?.ekspedisi || null,
            
            p_date_from:
            appState.filter.scanDateFrom || null,

            p_date_to:
            appState.filter.scanDateTo || null
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

async function refreshSummary() {

    const params = {
        p_ekspedisi: current?.ekspedisi ?? null,
        p_date_from: appState.filter.scanDateFrom || null,
        p_date_to: appState.filter.scanDateTo || null
    };

    console.log("RPC PARAMS =", params);

    const { data, error } = await client.rpc(
    "get_inbound_summary",
    params
);

console.log("DATA =", data);
console.log("ERROR =", error);

    if (error) {
        console.error("RPC ERROR =", error);
        return;
    }

    renderSummary(data?.[0]);
  console.log(data[0]);
  console.log("RPC PARAMS =", params);
console.log("CURRENT =", current);
}
