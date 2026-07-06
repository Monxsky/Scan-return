// const menuBtn =
// document.getElementById("menuBtn");

// const sidebar =
// document.querySelector(".sidebar");

// menuBtn.addEventListener("click", () => {

//   sidebar.classList.toggle("show");

// });

let audioCtx;
let mode = "RETUR";
let data = [];

// aktifin audio
function enableSound() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

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
async function resolveOrderStatus(resi) {

  // cek di pesanan_retur dulu
  const { data: retur } = await client
    .from("pesanan_retur")
    .select("*")
    .eq("tracking_number", resi)
    .maybeSingle();

  if (retur) {
    return "RETUR_EXIST";
  }

  // cek di daftar_pesanan
  const { data: order } = await client
    .from("daftar_pesanan")
    .select("*")
    .eq("tracking_number", resi)
    .maybeSingle();

  if (!order) {
    return "NOT_FOUND";
  }

  // REJECTED ENGINE (VERSI SIMPLE DULU)
  const isRejected =
    order.is_rejected === true ||
    order.order_status === "CANCELLED";

  if (isRejected) {
    return "AUTO_REJECTED";
  }

  return "NORMAL_ORDER";
}
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

        if (data.find(d => d.resi === decodedText)) {
          errorBeep();
          document.getElementById("warning").innerText = "⚠ Resi sudah di scan!";
          setTimeout(() => {
            document.getElementById("warning").innerText = "";
          }, 2000);
          return;
        }
        const status = await resolveOrderStatus(decodedText);
        data.push({
          resi: decodedText,
          status: status
        });
        if (status === "RETUR_EXIST") {
  document.getElementById("warning").innerText = "📦 Sudah retur";
  errorBeep();
}

if (status === "AUTO_REJECTED") {
  document.getElementById("warning").innerText = "🔁 REJECTED AUTO";
  beep();
}

if (status === "NORMAL_ORDER") {
  document.getElementById("warning").innerText = "✅ Normal order";
  beep();
}

if (status === "NOT_FOUND") {
  document.getElementById("warning").innerText = "❌ Tidak ditemukan";
  errorBeep();
}
        beep();
        render();
      }

    );

  } catch (err) {
    console.log(err);
    alert("Camera gagal dibuka!");
  }

};
