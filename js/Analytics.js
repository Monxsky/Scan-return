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

    // ORDER QUERY
    let orderQuery = client
    .from("order_list")
    .select("*",{
        count:"exact",
        head:true
    });
    // FILTER TANGGAL
    orderQuery =
    buildDataQuery(
        orderQuery,
        from,
        to
    );
    // FILTER EKSPEDISI
    if (MARKETPLACE[tab]){

        orderQuery =
        orderQuery.in(
            "ekspedisi",
            MARKETPLACE[tab]
        );
    }

    // JALANKAN QUERY
    const {
        count,
        error

    } = await  orderQuery;

    if(error){
        throw error;
    }

    return{
        order: count ?? 0,
        inbound: 0,
        retur: 0,
        //chart:[]

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
