// expedisi.js

// export const expedisiRules = [
window.expedisiRules = [
  // ======================
  // J&T EXPRESS
  // ======================
  {
    nama: "J&T",

    aliases: [
      "JNT",
      "J&T EXPRESS"
    ],

    test: (resi) => {

      return (
        resi.startsWith("JX") ||
        resi.startsWith("JP") ||
        resi.startsWith("JT") ||
        resi.startsWith("JNT")
      );

    }
  },

  // ======================
  // SHOPEE EXPRESS
  // ======================
  {
    nama: "Shopee Express",

    aliases: [
      "SPX",
      "SPX EXPRESS"
    ],

    test: (resi) => {

      return (
        resi.startsWith("SPX") ||
        resi.startsWith("SPXID") ||
        resi.startsWith("SP") ||
        resi.startsWith("ID")
      );

    }
  },

  // ======================
  // SICEPAT
  // ======================
  {
    nama: "SiCepat",

    aliases: [
      "SICEPAT"
    ],

    test: (resi) => {

      return (

        /^\d+$/.test(resi) &&
        resi.length >= 10

      );

    }
  },

  // ======================
  // ANTERAJA
  // ======================
  {
    nama: "AnterAja",

    aliases: [
      "ANTERAJA"
    ],

    test: (resi) => {

      return (

        resi.startsWith("100") ||
        resi.startsWith("AJA")

      );

    }
  },

  // ======================
  // JNE
  // ======================
  {
    nama: "JNE",

    aliases: [
      "JNE EXPRESS"
    ],

    test: (resi) => {

      return (

        resi.startsWith("CM") ||
        resi.startsWith("JNE") ||
        resi.startsWith("JTJ")

      );

    }
  },

  // ======================
  // NINJA XPRESS
  // ======================
  {
    nama: "Ninja Xpress",

    aliases: [
      "NINJA"
    ],

    test: (resi) => {

      return (

        resi.startsWith("NJV") ||
        resi.startsWith("NINJA")

      );

    }
  },

  // ======================
  // ID EXPRESS
  // ======================
  {
    nama: "ID Express",

    aliases: [
      "IDEXPRESS"
    ],

    test: (resi) => {

      return (

        resi.startsWith("IDEX") &&
        /\d/.test(resi)

      );

    }
  },

  // ======================
  // POS INDONESIA
  // ======================
  {
    nama: "POS Indonesia",

    aliases: [
      "POS"
    ],

    test: (resi) => {

      return (

        /^P[A-Z0-9]+ID$/.test(resi)

      );

    }
  },

  // ======================
  // LEX / LAZADA
  // ======================
  {
    nama: "LEX",

    aliases: [
      "LAZADA EXPRESS"
    ],

    test: (resi) => {

      return (

        resi.startsWith("LEX")

      );

    }
  },

  // ======================
  // SAP EXPRESS
  // ======================
  {
    nama: "SAP Express",

    aliases: [
      "SAP"
    ],

    test: (resi) => {

      return (

        resi.startsWith("SAP")

      );

    }
  },

  // ======================
  // WAHANA
  // ======================
  {
    nama: "Wahana",

    aliases: [
      "WAHANA EXPRESS"
    ],

    test: (resi) => {

      return (

        resi.startsWith("WHN") ||
        resi.startsWith("WAH")

      );

    }
  },

  // ======================
  // TIKI
  // ======================
  {
    nama: "TIKI",

    aliases: [
      "TIKI JNE"
    ],

    test: (resi) => {

      return (

        resi.startsWith("TKI") ||
        resi.startsWith("TIKI")

      );

    }
  },

  // ======================
  // JDL / JD.ID
  // ======================
  {
    nama: "JDL",

    aliases: [
      "JD LOGISTIC"
    ],

    test: (resi) => {

      return (

        resi.startsWith("JD")

      );

    }
  },

  // ======================
  // GO-SEND
  // ======================
  {
    nama: "GoSend",

    aliases: [
      "GOSEND"
    ],

    test: (resi) => {

      return (

        resi.startsWith("GS") ||
        resi.startsWith("GOSEND")

      );

    }
  },

  // ======================
  // GRAB EXPRESS
  // ======================
  {
    nama: "GrabExpress",

    aliases: [
      "GRAB"
    ],

    test: (resi) => {

      return (

        resi.startsWith("GRAB") ||
        resi.startsWith("GX")

      );

    }
  },

  // ======================
  // BORZO
  // ======================
  {
    nama: "Borzo",

    aliases: [
      "MRSPEEDY"
    ],

    test: (resi) => {

      return (

        resi.startsWith("BRZ") ||
        resi.startsWith("BORZO")

      );

    }
  },

  // ======================
  // DELIVEREE
  // ======================
  {
    nama: "Deliveree",

    aliases: [
      "DELIVEREE"
    ],

    test: (resi) => {

      return (

        resi.startsWith("DLV")

      );

    }
  },

  // ======================
  // PAXEL
  // ======================
  {
    nama: "Paxel",

    aliases: [
      "PAXEL"
    ],

    test: (resi) => {

      return (

        resi.startsWith("PXL") ||
        resi.startsWith("PAXEL")

      );

    }
  },

  // ======================
  // SENTRAL CARGO
  // ======================
  {
    nama: "Sentral Cargo",

    aliases: [
      "SENTRAL"
    ],

    test: (resi) => {

      return (

        resi.startsWith("SCG")

      );

    }
  },

  // ======================
  // RPX
  // ======================
  {
    nama: "RPX",

    aliases: [
      "RPX HOLDING"
    ],

    test: (resi) => {

      return (

        resi.startsWith("RPX")

      );

    }
  },

  // ======================
  // JX EXPRESS
  // ======================
  {
    nama: "JX Express",

    aliases: [
      "JX"
    ],

    test: (resi) => {

      return (

        resi.startsWith("JXE")

      );

    }
  },

  // ======================
  // FIRST LOGISTICS
  // ======================
  {
    nama: "First Logistics",

    aliases: [
      "FIRST LOG"
    ],

    test: (resi) => {

      return (

        resi.startsWith("FL")

      );

    }
  },

  // ======================
  // LION PARCEL
  // ======================
  {
    nama: "Lion Parcel",

    aliases: [
      "LION"
    ],

    test: (resi) => {

      return (

        resi.startsWith("LP") ||
        resi.startsWith("LION")

      );

    }
  },

  // ======================
  // INDAH LOGISTIK
  // ======================
  {
    nama: "Indah Logistik",

    aliases: [
      "INDAH"
    ],

    test: (resi) => {

      return (

        resi.startsWith("IL") ||
        resi.startsWith("INDAH")

      );

    }
  },

  // ======================
  // KURIR TOKOPEDIA
  // ======================
  {
    nama: "Tokopedia Courier",

    aliases: [
      "TOKOPEDIA"
    ],

    test: (resi) => {

      return (

        resi.startsWith("TKP") ||
        resi.startsWith("TOKO")

      );

    }
  }

];
