renderToolbar({

    title: "Order Shopee",

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

        loadOrderListShopee();

    });

}
loadOrderListShopee();
async function loadOrderListShopee() {

    let query = client
        .from("daftar_pesanan")
        .select("*")
        .eq("marketplace","SHOPEE_ID");

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

setupPagination({

    table:"daftar_pesanan",

    tbodyId:"tableBody",

    renderRow(item){

        return `

            <tr>

                <td>${item.marketplace_order_id}</td>

                <td>${item.resi}</td>

                <td>${item.ekspedisi}</td>

                <td>${item.status}</td>

                <td>${new Date(item.created_at)
                    .toLocaleString("id-ID")}</td>

            </tr>

        `;

    },

    buildQuery(query){

        query =
        query.eq(
            "marketplace",
            "SHOPEE_ID"
        );

        if(appState.filter.status){

            query =
            query.eq(
                "status",
                appState.filter.status
            );

        }

        if(appState.filter.expedisi){

            query =
            query.eq(
                "ekspedisi",
                appState.filter.expedisi
            );

        }

        if(appState.filter.search){

            query =
            query.ilike(
                "marketplace_order_id",
                `%${appState.filter.search}%`
            );

        }

        return query;

    }

});
loadOrderListShopee();
