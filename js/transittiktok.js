async function insertTransit(data) {

  const response =
    await fetch(
      `${SUPABASE_URL}/rest/v1/transit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify(data)
      }
    );

  return response.ok;
}

async function transitExists(noResi) {

  const response =
    await fetch(
      `${SUPABASE_URL}/rest/v1/transit?no_resi=eq.${noResi}&select=id`,
      {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

  const data =
    await response.json();

  return data.length > 0;
}

function getDeadline(printDate){

  const date =
    new Date(printDate);

  date.setDate(
    date.getDate() + 1
  );

  return date
    .toISOString()
    .split("T")[0];
}

async function loadTransit(){

  const { data, error } =
    await client
      .from("transit")
      .select("*")
      .order(
        "tanggal_print",
        { ascending:false }
      );

  return data;
}

async function countTransit(){

  const {
    count,
    error
  } = await client
      .from("transit")
      .select("*",{
        count:"exact",
        head:true
      });

  return count;
}

function getTransitAge(
  tanggalPrint
){

  const print =
    new Date(
      tanggalPrint
    );

  const now =
    new Date();

  const diff =
    now - print;

  return Math.floor(
    diff /
    (1000*60*60*24)
  );
}

function getTransitStatus(
  tanggalPrint
){

  const age =
    getTransitAge(
      tanggalPrint
    );

  if(age === 0)
    return "normal";

  if(age === 1)
    return "warning";

  return "overdue";
}

async function selesaiTransit(
  noResi
){

  await client
    .from("transit")
    .update({
      status:"Selesai"
    })
    .eq(
      "no_resi",
      noResi
    );
}