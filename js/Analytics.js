const MARKETPLACE = {

    semua: null,

    shopee: ["SHOPEE_ID"],

    tiktok: ["TIKTOK_ID"],

    tokopedia: [],

    lazada: []

};

let currentTab = "semua";

const cache = {};

let analyticsChart = null;

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

async function getOrderCount(tab, from, to) {
    let query = client
    .from("daftar_pesanan")
    .select("*", {
        count: "exact",
        head: true
    })

    query = buildDataQuery(query, from, to);

        query = query.in("status", [
            "READY_TO_SHIP",
            "SHIPPING",
            "DELIVERED"
        ]);
    if (MARKETPLACE[tab]) {
        query = query.in("marketplace", MARKETPLACE[tab]);
        }

        const { count, error } = await query;
        if (error) throw error;

        return count ?? 0;
    
}

function getInboundFilter(tab, query){
    switch(tab){
        case "shopee":
            return query.or(
                "resi.ilike.SPX%,resi.ilike.SPXID%,resi.ilike.ID%"
            );
        case "tiktok":
            return query.or(
                "resi.ilike.J&T%,resi.ilike.J&T Express%,resi.ilike.0029%"
            );
        default:
            return query;    
    }
}

async function getInboundCount(tab, from, to) {
    let query = client
    .from("scan_awb")
    .select("*", {
        count: "exact",
        head: true
    });

    query = buildDataQuery(query, from, to);

    query = getInboundFilter(tab, query);

        const { count, error } = await query;
        if (error) throw error;

        return count ?? 0;
    
}

async function getReturCount(tab, from, to) {

    let query = client
        .from("v_pesanan_retur")
        .select("*", {
            count: "exact",
            head: true
        });

    query = buildDataQuery(query, from, to);

    if (MARKETPLACE[tab]) {
        query = query.in("marketplace", MARKETPLACE[tab]);
    }

    const { count, error } = await query;

    if (error) throw error;

    return count ?? 0;
}

// async function getAnalyticsData(tab) {

//     const [
//         order,
//         retur,
//         inbound
//     ] = await Promise.all([
//         getOrderCount(tab, from, to),
//         getReturCount(tab, from, to),
//         getInboundCount(tab, from, to)
//     ]);
    
// }

async function loadAnalytics(tab = "semua"){
console.log("TAB :", tab);
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

    const container =
document.getElementById(tab);

const from =
container
.querySelector(".filterFrom")
.value;

const to =
container
.querySelector(".filterTo")
.value;
const [
    order,
    inbound,
    retur
] = await Promise.all([

    getOrderCount(
        tab,
        from,
        to
    ),

    getInboundCount(
        tab,
        from,
        to
    ),

    getReturCount(
        tab,
        from,
        to
    )

]);
    const chart =
await getChartData(
    tab,
    from,
    to
);
console.log({
    order,
    inbound,
    retur
});
    return{
        order,
        inbound,
        retur,
        chart

    };

}

// chart

async function getChartData(tab, from, to){

    let query = client
        .from("daftar_pesanan")
        .select("created_at, marketplace");

    query = buildDataQuery(query, from, to);

    if(MARKETPLACE[tab]){
        query = query.in(
            "marketplace",
            MARKETPLACE[tab]
        );
    }

    const { data, error } = await query;

    if(error) throw error;

    const result = {};

    data.forEach(item => {

        const date = item.created_at.slice(0,10);

        result[date] = (result[date] || 0) + 1;

    });

    return Object.entries(result).map(([date,total]) => ({
        date,
        total
    }));

}
// RENDER DATA
function renderSummary(data){
     console.log("RENDER SUMMARY:", data);
    
    const container =
        document.getElementById(currentTab);

    container.querySelector(".orderCount").textContent =
        data.order;

    container.querySelector(".inboundCount").textContent =
        data.inbound;

    container.querySelector(".returCount").textContent =
        data.retur;

}
// RENDER CHART
function renderChart(chartData){

    const ctx =
        document
        .getElementById("analyticsChart");

    if(analyticsChart){

        analyticsChart.destroy();

    }

    analyticsChart = new Chart(ctx,{

        type:"line",

        data:{

            labels:
                chartData.map(d=>d.date),

            datasets:[{

                label:"Order",

                data:
                    chartData.map(d=>d.total),

                borderColor:"#f97316",

                backgroundColor:"rgba(249,115,22,.15)",

                fill:true,

                tension:0.35

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    display:false
                }

            }

        }

    });

}
// LOADING
function showLoading(){

    console.log("Loading...");

}

function hideLoading(){

    console.log("Selesai");

}
document.addEventListener("DOMContentLoaded", () => {

    // Load pertama
    loadAnalytics("semua");

    // Event klik tab
    document.querySelectorAll(".tab-btn").forEach(btn => {

        btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const tab = btn.dataset.tab;
    currentTab = tab;

    document.querySelectorAll(".tab-btn")
        .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    document.querySelectorAll(".tab-content")
        .forEach(c => c.classList.remove("active"));

    document.getElementById(tab)
        .classList.add("active");

    console.log("Klik Tab :", tab);

    await loadAnalytics(tab);
});

    });

document.querySelectorAll(".btnAnalytics")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        loadAnalytics(currentTab);

    });

});

});
