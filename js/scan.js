let audioCtx;
let mode = "RETUR";
let data = [];
// ===============================
// CACHE ANTI DOUBLE SCAN
// ===============================
const rejectedCache = new Set();
let isProcessing = false;
// aktifin audio
function enableSound() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
// DEBUG
function debug(msg) {
  const el = document.getElementById("debug");
  if (!el) return;

  el.innerHTML += msg + "<br>";
  el.scrollTop = el.scrollHeight;
}
// warning
  function showWarning(msg) {
  const el = document.getElementById("warning");
  if (!el) return;

  el.innerText = msg;

  setTimeout(() => {
    el.innerText = "";
  }, 1500);
}
// 
// bunyi sukses
function beep() {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1000, audioCtx.currentTime);

  osc.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

// bunyi error
function errorBeep() {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);

  osc.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}
// ======================================= RESOLVE ORDER =========================================== //

async function resolveOrderStatus(keyword){

    debug("SEARCH: " + keyword);

    const { data, error } = await client.rpc(
        "search_order",
        {
            keyword: keyword
        }
    );


    if(error){

        console.error(error);

        debug(
          "RPC ERROR: " + error.message
        );

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


    if(!data){

        return {
            status: "NOT_FOUND",
            order: null,
            shipping: null,
            return: null
        };

    }


    return data;

}


// );
// debug(
//  JSON.stringify(result);
// ganti mode
function setMode(m) {
  enableSound();
  mode = m;
  document.getElementById("mode").innerText = m;
}

// render list
function render() {
 console.log("===== RENDER =====");
    console.log(data);
  const list = document.getElementById("list");
    console.log(list);
  list.innerHTML = "";

  data.forEach((item, i) => {
    list.innerHTML += `
      <div class="item">
        ${item.resi} (${item.status})
        <button onclick="removeItem(${i})">Hapus</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = data.length;
}

// hapus item
function removeItem(i) {
  data.splice(i, 1);
  render();
}

// clear semua
function clearAll() {
  if (confirm("Hapus semua data?")) {
    data = [];
    render();
  }
}

// kirim data ke Supabase + sync manifest
async function sendData() {

  if (data.length === 0) {
    alert("Tidak ada data!");
    return;
  }

  try {

    const payload = data.map(item => ({
      resi: item.resi,
      // ekspedisi: item.ekspedisi,
      status: item.status,
      scan_type: item.scanType,
      created_at: new Date().toISOString()
    }));

    console.log(payload);
    // 1. INSERT ke inbound / scan table
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/scan_awb`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) throw new Error("Gagal kirim inbound");

    // 2. UPDATE manifest kalau ada
    for (const item of data) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/pesanan_retur?resi=eq.${item.resi}`,
        {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: "SUDAH DIKEMBALIKAN"
          })
        }
      );
    }

    alert("Data berhasil dikirim & manifest terupdate!");

    data = [];
    render();

  } catch (err) {
    console.log(err);
    alert("Gagal kirim data!");
  }
}

// START CAMERA
window.onload = async () => {

  try {

    const scanner = new Html5Qrcode("reader");

    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },

      async (decodedText) => {
        //  debug("SCAN: " + decodedText);
        // if (data.find(d => d.resi === decodedText)) {
        //   errorBeep();
        //   showWarning("⚠ Resi sudah di scan!");
        //   return;
        // }
        if (isProcessing) return;

    isProcessing = true;

    try {

        debug("SCAN: " + decodedText);

       const result = await resolveOrderStatus(decodedText);
debug("SHIPPING = " + JSON.stringify(result.shipping));
debug("RETURN = " + JSON.stringify(result.return));
debug("RESULT = " + JSON.stringify(result));
        const status = result.status;

    //     const ekspedisi =
    // result.shipping?.ekspedisi ||
    // result.return?.ekspedisi ||
    // detectExpedisi(decodedText);

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
                  status === "NORMAL_ORDER"
              ) {
              
                  scanType = "DELIVERY_FAILED_RETURN";
              
              }
              else {
              
                  scanType = "NORMAL";
              
              }
      
        debug("STATUS: " + status);
        const cacheKey = decodedText + ":" + status;
        if (rejectedCache.has(cacheKey)) {
            showWarning("⚠ sudah diproses");
            return;
        }
        rejectedCache.add(cacheKey);
         console.log("STATUS:", status);
         // const ekspedisi = detectExpedisi(decodedText);
          debug("SEBELUM PUSH");
          console.log("DATA BEFORE:", data.length);
console.log("=== RESULT ===", result);
console.log("ORDER     :", result.order);
console.log("SHIPPING  :", result.shipping);
console.log("RETURN    :", result.return);
            

data.push({
    resi: decodedText,

    order_id:
        result.order?.order_id ??
        result.return?.order_id ??
        null,

    marketplace:
        result.order?.marketplace ??
        result.return?.marketplace ??
        null,

    ekspedisi:
        result.shipping?.ekspedisi ??
        result.return?.ekspedisi ??
        null,

    status,

    scanType,

    source: result.source ?? null,

    order: result.order ?? null,

    shipping: result.shipping ?? null,

    return: result.return ?? null
});
        console.log("DATA ARRAY:", data);
        debug("PUSH OK");
        if (status === "RETUR_EXIST") {
          showWarning("📦 Sudah retur");
          errorBeep();
        }

        else if (status === "AUTO_REJECTED") {
          showWarning("🔁 REJECTED AUTO");
          beep();
        }

        else if (status === "NORMAL_ORDER") {
          showWarning("✅ Normal order");
          beep();
        }

        else if (status === "NOT_FOUND") {
          showWarning("❌ Tidak ditemukan");
          errorBeep();
        }
        debug("RENDER");
        render();

       } catch (err) {

    console.error(err);

    debug("SCAN ERROR: " + err.message);

    showWarning("⚠ Terjadi error, scan berikutnya tetap bisa lanjut");

    errorBeep();

      } finally {

        isProcessing = false;

    }

      }
    );


  } catch (err) {
    console.log(err);
    alert("Camera gagal dibuka!");
  }
};

// async function simulateClassification(limit = 30) {

//     const { data: scans, error } = await client
//         .from("scan_awb")
//         .select("id,resi,status,scan_type")
//         .order("created_at", { ascending: false })
//         .limit(limit);

//     if (error) {
//         console.error(error);
//         return;
//     }

//     console.log("===== SIMULATION START =====");

//     for (const scan of scans) {

//         const result = await resolveOrderStatus(scan.resi);

//         let scanType = "NORMAL";

//         if (result.return) {

//             scanType = "CUSTOMER_RETURN";

//         }
//         else if (
//             result.shipping?.status === "CANCELLED"
//         ) {

//             scanType = "CANCELLED_BEFORE_SHIP";

//         }
//         else if (result.shipping) {

//             scanType = "DELIVERY_FAILED_RETURN";

//         }

//         console.log({
//             id: scan.id,
//             resi: scan.resi,
//             old_status: scan.status,
//             old_scan_type: scan.scan_type,
//             new_scan_type: scanType,
//             result: result.status
//         });

//     }

//     console.log("===== SIMULATION END =====");

// }
