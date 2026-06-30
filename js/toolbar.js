(function () {

    function renderToolbar(options = {}) {

        const {
            title = "",
            status = false,
            search = false,
            refresh = false
        } = options;

        const toolbar = document.getElementById("toolbar");

        if (!toolbar) return;

        toolbar.innerHTML = `

            <div class="toolbar">

                <div class="toolbar-left">

                    ${title ? `<h3>${title}</h3>` : ""}

                    ${status ? `
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

                </div>

                <div class="toolbar-right">

                    ${search ? `
                        <input
                            type="text"
                            id="searchInput"
                            placeholder="Cari..."
                        >
                    ` : ""}

                    ${refresh ? `
                        <button id="btnRefresh">
                            Refresh
                        </button>
                    ` : ""}

                </div>

            </div>

        `;

    }

    window.renderToolbar = renderToolbar;

})();
