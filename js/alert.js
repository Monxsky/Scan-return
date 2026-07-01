console.log("alert.js loaded");
async function loadReturnAlert() {

    const sevenDaysAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await client
        .from("pesanan_retur")
        .select("tracking_number, marketplace_order_id, nama_toko, returning_at")
        .eq("return_status", "RETURNING");
        .lte("returning_at", sevenDaysAgo);

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

document.addEventListener("DOMContentLoaded", async () => {

    const alerts = await loadReturnAlert();
    await showReturnAlert();
    console.log(alerts);

});

async function showReturnAlert(){

    const alerts =
        await loadReturnAlert();
console.log("ALERTS:", alerts);
    const box =
        document.getElementById("returnAlert");

    const text =
        document.getElementById("returnAlertText");
console.log("TEXT ELEMENT:", text);
    if(alerts.length===0){

        box.hidden=true;

        return;

    }

    box.hidden=false;

    text.innerHTML = `
⚠ <b>${alerts.length}</b> paket retur telah berstatus
<b>RETURNING</b> lebih dari <b>7 hari</b>.
Segera lakukan pengecekan dengan pihak ekspedisi.
`;
}

    console.log("AFTER:", text.innerHTML);
}
