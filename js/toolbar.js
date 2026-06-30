(function () {

    function renderToolbar(options = {}) {

        const {

            title = "",

            filters = {},

            refresh = false

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

            <div class="toolbar-right">

                ${filters.search ? `

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

               
                ${filters.syncScan ? `

                <button id="btnSyncScan">

                        🔄 Sync Scan

                </button>

                ` : ""}

            </div>

        </div>

        `;

    }

    window.renderToolbar =
        renderToolbar;

})();
