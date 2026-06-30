const PAGE_LIMIT = 50;

const paginationState = {

    page: 1,

    limit: PAGE_LIMIT,

    table: "",

    tbodyId: "",

    renderRow: null,

    buildQuery: null

};

async function loadPage(page = 1){

    paginationState.page = page;

    const from =
        (page - 1) * paginationState.limit;

    const to =
        from + paginationState.limit - 1;

    let query = client
        .from(paginationState.table)
        .select("*");

    if(typeof paginationState.buildQuery === "function"){

        query =
            paginationState.buildQuery(query);

    }

    query = query.range(from, to);

    const { data, error } = await query;

    if(error){

        console.error(error);

        return;

    }

    const tbody =
        document.getElementById(
            paginationState.tbodyId
        );

    tbody.innerHTML = "";

    if(!data || data.length === 0){

        tbody.innerHTML=`
            <tr>

                <td colspan="20">

                    Tidak ada data

                </td>

            </tr>
        `;

        return;

    }

    data.forEach(item=>{

        tbody.innerHTML +=
            paginationState.renderRow(item);

    });

}

async function setupPagination(options){

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
        .from(paginationState.table)
        .select("*",{

            count:"exact",

            head:true

        });

    if(typeof paginationState.buildQuery==="function"){

        countQuery =
            paginationState.buildQuery(countQuery);

    }

    const { count } =
        await countQuery;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                count /
                paginationState.limit
            )
        );

    let html = "";

    for(let i=1;i<=totalPages;i++){

        html += `
            <button
                class="${
                    i===paginationState.page
                    ? "active-page"
                    : ""
                }"
                onclick="changePage(${i})"
            >
                ${i}
            </button>
        `;

    }

    document
        .getElementById("pagination")
        .innerHTML = html;

    await loadPage(
        paginationState.page
    );

}

async function changePage(page){

    await loadPage(page);

    document
        .querySelectorAll("#pagination button")
        .forEach((btn,index)=>{

            btn.classList.toggle(

                "active-page",

                index + 1 === page

            );

        });

}
