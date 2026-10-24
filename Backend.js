
  // Rameshchendramali google sheet - 7WDarpanTemplet {P}
const API_URL = "https://script.google.com/macros/s/AKfycbyHs7-4-tfbttfD06EYD2IRy6dgeqcSb3Y5GCJbIcLAdmkZaBcFQ8qNYFtfk7odxA48/exec";

async function loadData() {
  const container = document.getElementById("cardContainer");
  const loader = document.getElementById("loader");

  loader.style.display = "block";
  // container.innerHTML =
  //   "<p style='position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%); text-align:center;color:#e65100;font-size:24px;font-weight:bold;padding:20px;'>Updating...</p>";


container.innerHTML = `
  <div style="
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: max-content;
    max-width: 90vw;
    box-sizing: border-box;
    padding: 22px 30px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.20);
    text-align: center;
    color: #e65100;
    font-size: clamp(28px, 8vw, 40px);
    font-weight: bold;
    z-index: 999999;
  ">
    Updating...
  </div>
`;


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





