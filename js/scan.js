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

// ganti mode
function setMode(m) {
  enableSound();
  mode = m;
  document.getElementById("mode").innerText = m;
}

// render list
function render() {
  const list = document.getElementById("list");
    console.log(list);
  list.innerHTML = "";

  data.forEach((item, i) => {
    list.innerHTML += `
      <div class="item">
        ${item.resi}
        <small>${item.ekspedisi}</small>
        <button onclick="removeItem(${i})">Hapus</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = data.length;
}

// hapus item
function removeItem(i) {
  rejectedCache.delete(data[i].resi);
  data.splice(i, 1);
  render();
}

// clear semua
function clearAll() {
  if (confirm("Hapus semua data?")) {
    data = [];
    rejectedCache.clear();
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

    ekspedisi: item.ekspedisi,

    status: null,

    scan_type: null,

    sync_status: "PENDING",

    sync_at: null,

    sync_error: null,

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

    // 1. Insert scan_awb

if (!response.ok) {
    throw new Error("Gagal insert scan_awb");
}
    alert("Data berhasil dikirim!");

    data = [];
    rejectedCache.clear();
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
    async (decodedText) => {

    decodedText = decodedText.trim();

    console.log("SCAN:", decodedText);
    console.log("HAS CACHE?", rejectedCache.has(decodedText));
    console.log("CACHE:", [...rejectedCache]);
      
    if (isProcessing) return;

    isProcessing = true;

    try {

        if (rejectedCache.has(decodedText)) {

            errorBeep();
            showWarning("⚠ Resi sudah discan");
            return;

        }

        rejectedCache.add(decodedText);

        const ekspedisi = detectExpedisi(decodedText);

        data.push({
            resi: decodedText,
            ekspedisi
        });

        render();

        beep();

        showWarning("✅ Scan berhasil");

    } catch (err) {

        console.error(err);

        errorBeep();

        showWarning("⚠ Terjadi error");

    } finally {

        isProcessing = false;

    }

}
);

} catch (err) {

    console.log(err);
    alert("Camera gagal dibuka!");

}
  }
