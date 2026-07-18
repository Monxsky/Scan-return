async function resolveOrderStatus(keyword) {

    const { data, error } = await client.rpc(
        "search_order",
        {
            keyword
        }
    );

    if (error) {

        console.error(error);
        throw error;
        return {
            status: "NOT_FOUND",
            order: null,
            shipping: null,
            return: null
        };

    }
    console.log(
    "SEARCH RESULT:",
    data
        );

    return data ?? {
        status: "NOT_FOUND",
        order: null,
        shipping: null,
        return: null
    };

}

async function processScan(scan) {

    const result =
        await resolveOrderStatus(scan.resi);

    let scanType = "NORMAL";

    if (result.return) {

        scanType = "CUSTOMER_RETURN";

    }
    else if (
        result.shipping &&
        result.shipping.status === "CANCELLED"
    ) {

        scanType = "CANCELLED_BEFORE_SHIP";

    }
    else if (
        result.shipping &&
        result.status === "NORMAL_ORDER"
    ) {

        scanType = "DELIVERY_FAILED_RETURN";

    }

    return {

        status: result.status,

        scan_type: scanType,

        result

    };

}

async function updateScan(id, payload) {
    
    if(!id){
        throw new Error("SCAN ID kosong");
    }
    const { error } =
        await client
            .from("scan_awb")
            .update(payload)
            .eq("id", id);

    if (error)
        throw error;

}


async function processAndSave(scan) {

    try {

        await updateScan(scan.id, {

            sync_status: "PROCESSING",

            sync_error: null

        });

        const processed =
            await processScan(scan);

        await updateScan(scan.id, {

            status:
                processed.status,

            scan_type:
                processed.scan_type,

            sync_status: "DONE",

            sync_at:
                new Date().toISOString(),

            sync_error: null

        });

        console.log(
            "DONE",
            scan.resi
        );

    }
    catch (err) {

        console.error(err);

        await updateScan(scan.id, {

            sync_status: "FAILED",

            sync_error:
                err.message,

            sync_at:
                new Date().toISOString()

        });

    }

}

// =================================
// SYNC PENDING ENGINE
// =================================

async function syncPending(limit = 50) {


    console.log(
        "=== SYNC PENDING START ==="
    );


    const {
        data: scans,
        error
    } = await client
        .from("scan_awb")
        .select("*")
        .eq(
            "sync_status",
            "PENDING"
        )
        .order(
            "created_at",
            {
                ascending:true
            }
        )
        .limit(limit);



    if(error){

        console.error(
            "GET PENDING ERROR:",
            error
        );

        return;

    }



    if(!scans || scans.length === 0){

        console.log(
            "Tidak ada pending scan"
        );

        return;

    }



    console.log(
        "TOTAL PENDING:",
        scans.length
    );



    for(const scan of scans){


        console.log(
            "PROCESS:",
            scan.resi
        );


        await processAndSave(scan);


    }



    console.log(
        "=== SYNC PENDING END ==="
    );

}
