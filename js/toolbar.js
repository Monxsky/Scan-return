(function () {

    function renderToolbar(options = {}) {
    console.log("Toolbar Options:", options);
    console.log("Toolbar Filters:", options.filters);
        const {

            title = "",

            filters = {},

            search = false,

            refresh = false,

            syncScan = false

        } = options;

        const toolbar =
            document.getElementById("toolbar");

        if (!toolbar) return;

        toolbar.innerHTML = `

        <div class="toolbar">

            <div class="toolbar-left">

                ${title ? `<h3>${title}</h3>` : ""}

                ${filters.status ? `

                    <div class="toolbar-item">

                        <label>Status</label>

                        <select id="statusFilter">

                            <option value="">Semua Status</option>

                            <option value="PAID">PAID</option>

                            <option value="READY_TO_SHIP">READY TO SHIP</option>

                            <option value="SHIPPING">SHIPPING</option>

                            <option value="DELIVERED">DELIVERED</option>

                            <option value="CANCELED">CANCELED</option>

                        </select>

                    </div>

                ` : ""}

                ${filters.returnStatus ? `

                    <div class="toolbar-item">
                
                        <label>Status Retur</label>
                
                        <select id="returnStatusFilter">
                
                            <option value="">Semua Status</option>
                            <option value="WAITING_RETURN">Waiting Return</option>
                            <option value="RETURNING">Returning</option>
                            <option value="RETURNED">Returned</option>
                
                        </select>
                
                    </div>
                
                ` : ""}

                ${filters.expedisi ? `

                    <div class="toolbar-item">

                        <label>Ekspedisi</label>

                        <select id="expedisiFilter">

                            <option value="">Semua Ekspedisi</option>

                            <option value="SPX">SPX</option>

                            <option value="J&T">J&T</option>

                            <option value="JNE">JNE</option>

                            <option value="SiCepat">SiCepat</option>

                        </select>

                    </div>

                ` : ""}

            </div>

                                    ${filters.orderDate ? `
                        
                        <div class="toolbar-item">
                        
                            <label>Tanggal Order</label>
                        
                            <div class="date-filter">
                        
                                <input
                                    type="date"
                                    id="orderDateFrom"
                                >
                        
                                <span>-</span>
                        
                                <input
                                    type="date"
                                    id="orderDateTo"
                                >
                        
                            </div>
                        
                        </div>
                        
                        ` : ""}

                        ${filters.scanDate ? `

<div class="toolbar-item">

    <label>Tanggal Scan</label>

    <div class="date-filter">

        <input
            type="date"
            id="scanDateFrom"
        >

        <span>-</span>

        <input
            type="date"
            id="scanDateTo"
        >

    </div>

</div>

` : ""}

            <div class="toolbar-right">

                ${search ? `

                    <input
                        id="searchInput"
                        type="text"
                        placeholder="Cari..."
                    >

                ` : ""}

                ${refresh ? `

                    <button id="btnRefresh">

                       🔄 Refresh

                    </button>

                ` : ""}

               
                ${syncScan ? `

                <button id="btnSyncScan">

                        🔄 Sync Scan

                </button>

                ` : ""}

            </div>

        </div>

        `;

        // evenListener
 const scanDateFrom =
document.getElementById("scanDateFrom");

const scanDateTo =
document.getElementById("scanDateTo");

if(scanDateFrom){

    scanDateFrom.addEventListener("change",()=>{

        appState.filter.scanDateFrom =
        scanDateFrom.value;

        if(window.reloadCurrentPage){

            window.reloadCurrentPage();

        }

    });

}

if(scanDateTo){

    scanDateTo.addEventListener("change",()=>{

        appState.filter.scanDateTo =
        scanDateTo.value;

        if(window.reloadCurrentPage){

            window.reloadCurrentPage();

        }

    });

}
    }

async function loadSummary(
    rpc,
    params = {}
){

    const { data, error } =
    await client.rpc(
        rpc,
        params
    );

    if(error){

        console.error(error);
        return;

    }

    return data?.[0];

}

function renderSummary(summary){

    const container =
    document.getElementById("summary");

    if(!container) return;

    if(!summary){

        container.innerHTML = "";
        return;

    }

    async function refreshSummary(){

    const summary =
    await loadSummary(

        "get_inbound_summary",

        {

            p_ekspedisi:
            current?.ekspedisi,

            p_date_from:
            appState.filter.scanDateFrom,

            p_date_to:
            appState.filter.scanDateTo

        }

    );

    renderSummary(summary);

}

    container.innerHTML = `

        <div class="summary-grid">

            <div class="summary-card">

                <span>Total Scan</span>

                <h2>${summary.total_scan ?? 0}</h2>

            </div>

            <div class="summary-card">

                <span>Hari Ini</span>

                <h2>${summary.scan_hari_ini ?? 0}</h2>

            </div>

            <div class="summary-card">

                <span>Last Scan</span>

                <h2>${
                    summary.last_scan
                    ? new Date(summary.last_scan)
                        .toLocaleString("id-ID")
                    : "-"
                }</h2>

            </div>

        </div>

    `;

}

// =============
// SETUP TOOLBAR
// =============

async function setupToolbar(options = {}){

    renderToolbar(options);

    if(options.summary){

        const summary =
        await loadSummary(

            options.summary.rpc,

            options.summary.params

        );

        renderSummary(summary);

    }

}
    
    window.renderToolbar =
        renderToolbar;
    window.setupToolbar =
        setupToolbar;

})();
