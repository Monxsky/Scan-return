renderToolbar({

    title: "Order TikTok",

    status: true,

    search: true,

    refresh: true

});

const statusFilter =
document.getElementById("statusFilter");

if(statusFilter){

    statusFilter.addEventListener("change",()=>{

        filterState.status =
        statusFilter.value;

        loadOrderListTikTok();

    });

}
loadOrderListTikTok();
async function loadOrderListTikTok() {

    let query = client
        .from("daftar_pesanan")
        .select("*")

    if(filterState.marketplace){

    query =
    query.eq(
        "marketplace",
        filterState.marketplace
    );

}

    if(filterState.status){

    query =
    query.eq(
        "status",
        filterState.status
    );

}

    if(filterState.search){

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

