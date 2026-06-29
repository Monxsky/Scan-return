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
            "marketplace",
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
document.getElementById(currentTab);

const from =
container
.querySelector(".filterFrom")
.value;

const to =
container
.querySelector(".filterTo")
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
            "daftar_pesanan",
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
            "pesanan_retur",
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

        btn.addEventListener("click", async () => {

            // Hapus active tombol
            document.querySelectorAll(".tab-btn")
            .forEach(b => b.classList.remove("active"));

            // Active tombol sekarang
            btn.classList.add("active");

            // Hapus active content
            document.querySelectorAll(".tab-content")
            .forEach(c => c.classList.remove("active"));

            // Ambil nama tab
            const tab =
            btn.dataset.tab;

            currentTab = tab;

            // Tampilkan content
            document
            .getElementById(tab)
            .classList.add("active");

            console.log("Klik Tab :", tab);

            // Load analytics
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
