import { expedisiRules }
from "./expedisi.js";

export function detectExpedisi(resi) {

  resi = resi.toUpperCase();

  for (const item of expedisiRules) {

    if (item.test(resi)) {
      return item.nama;
    }

  }

  return "Lainnya";
}
