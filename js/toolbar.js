(function () {

    function renderToolbar() {

        const toolbar = document.getElementById("toolbar");

        if (!toolbar) return;

        toolbar.innerHTML = `

            <div class="toolbar">

                <div class="toolbar-left">

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

                <div class="toolbar-right">

                    <input
                        type="text"
                        placeholder="Cari pesanan..."
                    >

                </div>

            </div>

        `;

    }

    window.renderToolbar = renderToolbar;

})();
