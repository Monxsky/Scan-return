const MARKETPLACE = {

    semua: null,

    shopee: [
        "Shopee Express"
    ],

    tiktok: [
        "J&T",
        "SiCepat"
    ],

    tokopedia: [],

    lazada: []

};

let currentTab = "semua";

const cache = {};

// Build data function
function buildDataQuery(query, from, to){

    if(from){

        query = query.gte(
            "created_at",
            from
        );

    }

    if(to){

        query = query.lte(
            "created_at",
            to + "T23:59:59"
        );

    }

    return query;

}
// HELPER
async function getCount(table, tab, from, to){

    let query = client

    .from(table)

    .select("*",{

        count:"exact",

        head:true

    });

    query = buildDataQuery(
        query,
        from,
        to
    );

    if(MARKETPLACE[tab]){

        query = query.in(
            "ekspedisi",
            MARKETPLACE[tab]
        );

    }

    const {

        count,
        error

    } = await query;

    if(error){

        throw error;

    }
console.log({
    table,
    tab,
    filter: MARKETPLACE[tab],
    count
});
    return count ?? 0;

}
// LOAD
async function loadAnalytics(tab = "semua"){

    currentTab = tab;

    showLoading();

    try{

        const data = await getAnalyticsData(tab);

        renderSummary(data);

        renderChart(data.chart);

    }catch(err){

        console.error(err);

    }finally{

        hideLoading();

    }

}

// REAL DATA
async function getAnalyticsData(tab){

    const from =
    document
    .getElementById("filterFrom")
    .value;

    const to =
    document
    .getElementById("filterTo")
    .value;

    // // ORDER QUERY
    // let orderQuery = client
    // .from("order_list")
    // .select("*",{
    //     count:"exact",
    //     head:true
    // });
    // // FILTER TANGGAL
    // orderQuery =
    // buildDataQuery(
    //     orderQuery,
    //     from,
    //     to
    // );
    // // FILTER EKSPEDISI
    // if (MARKETPLACE[tab]){

    //     orderQuery =
    //     orderQuery.in(
    //         "ekspedisi",
    //         MARKETPLACE[tab]
    //     );
    // }

    // // JALANKAN QUERY
    // const {
    //     count,
    //     error

    // } = await  orderQuery;

    // if(error){
    //     throw error;
    // }
    const  [
        order,
        inbound,
        retur

    ] = await Promise.all([
        getCount(
            "order_list",
            tab,
            from,
            to
        ),

        getCount(
            "scan_awb",
            tab,
            from,
            to
        ),

        getCount(
            "retur_manifest",
            tab,
            from,
            to
        )
    ]);
console.log({
    order,
    inbound,
    retur
});
    return{
        order,
        inbound: 0,
        retur: 0,
        chart:[]

    };

}
// RENDER DATA
function renderSummary(data){

    document.getElementById("orderCount").textContent =
    data.order;

    document.getElementById("inboundCount").textContent =
    data.inbound;

    document.getElementById("returCount").textContent =
    data.retur;

}
// RENDER CHART
function renderChart(chartData){

    console.log(chartData);

}
// LOADING
function showLoading(){

    console.log("Loading...");

}

function hideLoading(){

    console.log("Selesai");

}
// DASHBOARD BUKA
document.addEventListener("DOMContentLoaded",()=>{

    loadAnalytics("semua");

});
