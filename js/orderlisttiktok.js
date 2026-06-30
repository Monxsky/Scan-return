renderToolbar({

    title: "Order TikTok",

    status: true,

    search: true,

    refresh: true

});

const statusFilter = document.getElementById("statusFilter");

if (statusFilter) {

    statusFilter.addEventListener("change", function () {

        loadOrderListTikTok(this.value);

    });

}

loadOrderListTikTok();
async function loadOrderListTikTok(status = "") {

    let query = client
        .from("daftar_pesanan")
        .select("*")
        .in("marketplace", ["TIKTOK_ID"]);

    if (status) {
        query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        return;
    }

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    data
        .slice()
        .reverse()
        .forEach(item => {

            tbody.innerHTML += `
                <tr>
                    <td>${item.marketplace_order_id}</td>
                    <td>${item.resi}</td>
                    <td>${item.ekspedisi}</td>
                    <td>${item.status}</td>
                    <td>${new Date(item.created_at).toLocaleString("id-ID")}</td>
                </tr>
            `;

        });

}

loadOrderListTikTok();

