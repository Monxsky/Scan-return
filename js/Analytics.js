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

// DUMMY DATA
async function getAnalyticsData(tab){

    return{

        order:10,

        inbound:5,

        retur:0,

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
