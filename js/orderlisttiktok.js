renderToolbar({

    title: "Order TikTok",

    filters: {

        status: true,

        expedisi: true,

        search: true

    },

    refresh: true

});
const statusFilter =
document.getElementById("statusFilter");

if(statusFilter){

    statusFilter.addEventListener("change",()=>{

        appState.filter.status =
        statusFilter.value;

        loadOrderListTikTok();

    });

}
loadOrderListTikTok();
async function loadOrderListTikTok() {

    let query = client
        .from("daftar_pesanan")
        .select("*")
        .eq("marketplace","TIKTOK_ID");

    if(appState.filter.status){

    query =
    query.eq(
        "status",
        appState.filter.status
    );

}

    if(appState.filter.search){

        query=query.ilike(
            "marketplace_order_id",
            `%${filterState.search}%`
        );

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

