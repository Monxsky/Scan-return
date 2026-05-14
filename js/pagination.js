const limit = 100;

async function setupPagination() {

  const { count } = await supabase
    .from("manifest")
    .select("*", { count: "exact", head: true });

  const totalPages = Math.ceil(count / limit);

  let buttons = "";

  for(let i = 1; i <= totalPages; i++) {

    buttons += `
      <button onclick="loadPage(${i})">
        ${i}
      </button>
    `;
  }

  document.getElementById("pagination").innerHTML = buttons;
}
