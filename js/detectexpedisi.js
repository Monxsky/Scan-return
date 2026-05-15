// import { expedisiRules }
// from "./expedisi.js";

// export function detectExpedisi(resi) {

//   resi = resi.toUpperCase();

//   for (const item of expedisiRules) {

//     if (item.test(resi)) {
//       return item.nama;
//     }

//   }

//   return "Lainnya";
// }
function detectExpedisi(resi) {

  if (!resi)
    return "Unknown";

  resi = resi
    .trim()
    .toUpperCase();

  for (const item of expedisiRules) {

    if (item.test(resi)) {
      return item.nama;
    }

  }

  return "Lainnya";
}

window.detectExpedisi =
detectExpedisi;
