
  // Rameshchendramali google sheet - 7WDarpanTemplet {P}
const API_URL = "https://script.google.com/macros/s/AKfycbygdjisVyNgqSm1X5gwobdMjhhHLWgCTlu5A07msgTXVf_0wFcZ_x8o-kT2LPcsUtxj/exec";

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





