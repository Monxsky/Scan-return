async function resolveOrderStatus(keyword) {

    const { data, error } = await client.rpc(
        "search_order",
        {
            keyword
        }
    );

    if (error) {

        console.error(error);

        return {
            status: "NOT_FOUND",
            order: null,
            shipping: null,
            return: null
        };

    }

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
