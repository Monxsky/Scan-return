(function () {

    function renderMenuBar(containerId = "toolBar") {

        const container = document.getElementById(containerId);

        if (!container) return;

        container.innerHTML = `

            <div class="menu-bar">

                <div class="menu-item">

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

            </div>

        `;

    }

    window.renderMenuBar = renderMenuBar;

})();
