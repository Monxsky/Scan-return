const PAGE_LIMIT = 50;

const paginationState = {
    page: 1,
    limit: PAGE_LIMIT,
    totalPages: 1,
    table: "",
    tbodyId: "",
    renderRow: null,
    buildQuery: null
};

async function loadPage(page = 1) {

    paginationState.page = page;

    const from =
        (page - 1) * paginationState.limit;

    const to =
        from + paginationState.limit - 1;

    let query = client
        .from(paginationState.table)
        .select("*");

    if (paginationState.buildQuery) {
        query = paginationState.buildQuery(query);
    }

    const { data, error } =
        await query.range(from, to);

    if (error) {
        console.error(error);
        return;
    }

    const tbody =
        document.getElementById(
            paginationState.tbodyId
        );

    tbody.innerHTML = "";

    if (!data || data.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="20">
                Tidak ada data
            </td>
        </tr>
        `;

        updatePaginationUI();

        if (paginationState.onLoaded) {
    await paginationState.onLoaded(data);
}

        return;
    }

    data.forEach(item => {

        tbody.innerHTML +=
            paginationState.renderRow(item);

    });

    updatePaginationUI();

}

async function setupPagination(options) {

    paginationState.table =
        options.table;

    paginationState.tbodyId =
        options.tbodyId;

    paginationState.renderRow =
        options.renderRow;

    paginationState.buildQuery =
        options.buildQuery;

    let countQuery =
        client
        .from(options.table)
        .select("*", {
            count: "exact",
            head: true
        });

    if (paginationState.buildQuery) {

        countQuery =
            paginationState.buildQuery(
                countQuery
            );

    }

    const { count } =
        await countQuery;

    paginationState.totalPages =
        Math.max(
            1,
            Math.ceil(
                count /
                paginationState.limit
            )
        );

    paginationState.page = 1;

    await loadPage(1);

}

function updatePaginationUI() {

    document
        .getElementById("pagination")
        .innerHTML = `

        <button
            id="prevPage"
            ${paginationState.page === 1 ? "disabled" : ""}
        >
            ◀ Previous
        </button>

        <span class="page-info">

            Halaman
            ${paginationState.page}
            /
            ${paginationState.totalPages}

        </span>

        <button
            id="nextPage"
            ${paginationState.page === paginationState.totalPages ? "disabled" : ""}
        >
            Next ▶
        </button>

    `;

    document
        .getElementById("prevPage")
        .onclick = () => {

            if (paginationState.page > 1) {

                loadPage(
                    paginationState.page - 1
                );

            }

        };

    document
        .getElementById("nextPage")
        .onclick = () => {

            if (
                paginationState.page <
                paginationState.totalPages
            ) {

                loadPage(
                    paginationState.page + 1
                );

            }

        };

}
