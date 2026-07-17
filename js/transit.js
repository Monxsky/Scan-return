// ======================================================
// TRANSIT.JS
// ======================================================

// const client = window.supabase.createClient(
//     SUPABASE_URL,
//     SUPABASE_KEY
// );

// ======================================================
// KONFIGURASI
// ======================================================

// transit_shopee.html
// const MARKETPLACE = "SHOPEE_ID";

// transit_tiktok.html
// const MARKETPLACE = "TIKTOK_ID";

let currentEkspedisi = "ALL";

// ======================================================
// RANGE HARI INI (WIB)
// database = timestamptz UTC
// ======================================================

function getTodayRangeWIB(){

    const now = new Date();

    const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,0,0
    );


    const end = new Date(start);

    end.setDate(end.getDate()+1);


    return {
        start:start.toISOString(),
        end:end.toISOString()
    };

}

// ======================================================
// LOAD DATA
// ======================================================

async function loadTransit(ekspedisi="ALL") {

    currentEkspedisi = ekspedisi;

    const { start, end } = getTodayRangeWIB();

    let query = client
        .from("daftar_pesanan")
        .select(`
            marketplace_order_id,
            resi,
            marketplace,
            ekspedisi,
            batas_kirim,
            status
        `)
        .eq("marketplace", MARKETPLACE)
        .eq("status","READY_TO_SHIP")
        .gte("batas_kirim", start)
        .lt("batas_kirim", end)
        .order("batas_kirim",{ascending:true});

    if(ekspedisi !== "ALL"){

        query = query.eq("ekspedisi", ekspedisi);

    }

    const { data, error } = await query;

    if(error){

        console.error(error);

        return;

    }

    console.log(data);

    // renderSummary(data);

    renderTable(data);

    setActiveTab(ekspedisi);

}

// ======================================================
// SUMMARY
// ======================================================

// function renderSummary(data){

//     document
//         .getElementById("totalTransit")
//         .textContent = data.length;

// }

// ======================================================
// TABLE
// ======================================================

function renderTable(rows){

    const container =
        document.getElementById("data");

    if(!container) return;


    if(rows.length === 0){

        container.innerHTML = `
            <div class="alert alert-warning">
                Tidak ada transit hari ini
            </div>
        `;

        return;
    }


    let html = `

    <table class="table table-striped">

        <thead>
            <tr>
                <th>No</th>
                <th>Order ID</th>
                <th>Resi</th>
                <th>Ekspedisi</th>
                <th>Batas Kirim</th>
                <th>Status</th>
            </tr>
        </thead>

        <tbody>

    `;


    rows.forEach((row,index)=>{

        html += `

        <tr>

            <td>${index+1}</td>

            <td>
            ${row.marketplace_order_id ?? "-"}
            </td>

            <td>
            ${row.resi ?? "-"}
            </td>

            <td>
            ${row.ekspedisi ?? "-"}
            </td>

            <td>
            ${new Date(row.batas_kirim)
            .toLocaleString("id-ID")}
            </td>

            <td>
            ${row.status}
            </td>

        </tr>

        `;

    });


    html += `

        </tbody>

    </table>

    `;


    container.innerHTML = html;

}
// ======================================================
// ACTIVE TAB
// ======================================================

function setActiveTab(ekspedisi){

    document
        .querySelectorAll(".tab-ekspedisi")
        .forEach(x=>x.classList.remove("active"));

    const btn =
        document.querySelector(`[data-ekspedisi="${ekspedisi}"]`);

    if(btn){

        btn.classList.add("active");

    }

}

// ======================================================
// EVENT TAB
// ======================================================

document
.querySelectorAll(".tab-ekspedisi")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        loadTransit(

            btn.dataset.ekspedisi

        );

    });

});

// ======================================================
// AUTO LOAD
// ======================================================

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadTransit("ALL");

    }

);
