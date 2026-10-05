
  // Rameshchendramali google sheet - 7WDarpanTemplet {P}
const API_URL = "https://script.google.com/macros/s/AKfycbyHs7-4-tfbttfD06EYD2IRy6dgeqcSb3Y5GCJbIcLAdmkZaBcFQ8qNYFtfk7odxA48/exec";

async function loadData() {
  const container = document.getElementById("cardContainer");
  const loader = document.getElementById("loader");

  loader.style.display = "block";
  container.innerHTML =
    "<p style='text-align:center;color:#e65100;'>Updating...</p>";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Server response error");
    }

    const data = await response.json();

    container.innerHTML = "";
    renderCards(data);

  } catch (error) {
    console.error(error);

    container.innerHTML =
      "<p style='text-align:center;color:red;'>Data load नहीं हुआ</p>";

  } finally {
    loader.style.display = "none";
  }
}

function refreshCards() {
  loadData();
}

document.addEventListener("DOMContentLoaded", loadData);





