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
// async function resolveOrderStatus(resi) {

//   // cek di pesanan_retur dulu
//   const { data: retur } = await client
//     .from("pesanan_retur")
//     .select("*")
//     .eq("tracking_number", resi)
//     .maybeSingle();
// debug("RESULT: " + JSON.stringify(order));
//   if (retur) {
//     return "RETUR_EXIST";
//   }

//   // cek di daftar_pesanan
//   const { data: order } = await client
//     .from("daftar_pesanan")
//     .select("*")
//     .eq("resi", resi)
//     .maybeSingle();
// debug("RESULT: " + JSON.stringify(order));
//   if (!order) {
//     return "NOT_FOUND";
//   }

//   // REJECTED ENGINE (VERSI SIMPLE DULU)
//   const isRejected =
//     order.is_rejected === true ||
//     order.order_status === "CANCELLED";

//   if (isRejected) {
//     await syncRejectedOrder(order);
//     return "AUTO_REJECTED";
//   }

//   return "NORMAL_ORDER";
// }
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

debug(
 JSON.stringify(result);
);
// ganti mode
function setMode(m) {
  enableSound();
  mode = m;
  document.getElementById("mode").innerText = m;
}

// render list
function render() {

  const list = document.getElementById("list");
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
      status: item.status,
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
        const status = result.status;
        debug("STATUS: " + status);
        const cacheKey = decodedText + ":" + status;
        if (rejectedCache.has(cacheKey)) {
            showWarning("⚠ sudah diproses");
            return;
        }
        rejectedCache.add(cacheKey);
         console.log("STATUS:", status);
           data.push({
            
                resi: decodedText,
            
                status: status,
            
                source: result.source,
            
                order: result.order,
            
                shipping: result.shipping,
            
                return: result.return
            
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
