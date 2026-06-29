const tbody = document.getElementById("riwayatBody");

document.addEventListener("DOMContentLoaded", () => {
    loadRiwayat();
});

async function loadRiwayat() {

    const today = new Date();
    today.setHours(0,0,0,0);

    // Ambil scan
    const {
        data: scans,
        error: scanError
    } = await client
    .from("scan_awb")
    .select("*")
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending:false });

    if(scanError){
        console.error(scanError);
        return;
    }

    // Ambil data retur
    const {
        data: retur,
        error: returError
    } = await client
    .from("pesanan_retur")
    .select("resi");

    if(returError){
        console.error(returError);
        return;
    }

    const returnedSet = new Set(
        retur.map(item => item.resi)
    );

    const hasil = scans.map(item => ({
        ...item,
        status: returnedSet.has(item.resi)
            ? "DIKEMBALIKAN"
            : "RETUR"
    }));

    // Kirim ke render
    renderTable(hasil);

}
// RENDER //
function renderTable(data){

    let html = "";

    data.forEach(item => {

        html += `
        <tr>

            <td>${item.resi}</td>

            <td>
                ${new Date(item.created_at).toLocaleTimeString()}
            </td>

            <td>
                <span class="${
                    item.status === "RETUR"
                    ? "badge-warning"
                    : "badge-success"
                }">
                    ${item.status}
                </span>
            </td>

        </tr>
        `;

    });

    tbody.innerHTML = html;

}
