



function refreshCards() {
  const container = document.getElementById("cardContainer");
  const loader = document.getElementById("loader");

  // वर्तमान स्क्रॉल पोजीशन सुरक्षित रखें
  const savedScrollY = window.scrollY;

  if (loader) loader.style.display = "block";
  if (container) container.style.opacity = "0.4";

  google.script.run
    .withSuccessHandler((data) => {
      renderCards(data);

      if (loader) loader.style.display = "none";
      if (container) container.style.opacity = "1";

      // रिफ्रेश के बाद उसी जगह वापस जाएँ
      requestAnimationFrame(() => {
        window.scrollTo({
          top: savedScrollY,
          behavior: "instant"
        });
      });
    })
    .withFailureHandler((error) => {
      console.error("Refresh Error:", error);

      if (loader) loader.style.display = "none";
      if (container) container.style.opacity = "1";

      alert("डेटा रिफ्रेश नहीं हो सका। कृपया पुनः प्रयास करें।");
    })
    .getSheetData();
}








let allCardsData = [];


// =========================================
// RENDER CARDS
// =========================================

function renderCards(dataObj) {

  // =========================================
  // COLUMN DISPLAY SE HATANE KE LIYE
  // =========================================

  const headers = dataObj.headers.filter(h =>
    h !== "ID" &&
    h !== "PID" &&
    h !== "Sex" &&
    h !== "Village" &&
    h !== "Distric" &&
    h !== "Chokala" &&
    h !== "State" &&
    h !== "DOB" &&
    h !== "Email" &&
    h !== "Photo" &&
    h !== "Address" &&
    h !== "Image" &&
    h !== "Pub-Mo" &&
    h !== "Pub-Ph" &&
    h !== "OurInfo" &&
    h !== "Pub-Web" &&
    h !== "Link"
  );

  const data = dataObj.json;

  const container =
    document.getElementById("cardContainer");

let grouped = {};

data.forEach(row => {

  if (!grouped[row.PID]) {
    grouped[row.PID] = [];
  }

  grouped[row.PID].push(row);

});

allCardsData = [];

let srNo = 1;

// पूरा HTML पहले memory में बनाएं
let allHTML = "";

Object.keys(grouped).forEach(id => {

  const rows = grouped[id];
  const firstRow = rows[0];
  
  // Comun Sheet W Column - Card Privacy
  // W = Column 23 (1-based)
  // JSON object mein key header ke naam par depend karegi

 
  // =========================================
  // PRIVACY: W = Pub-Web, X = Pub-Mo, Y = Pub-Ph
  // =========================================

  const webPrivacy = String(
    firstRow["Pub-Web"] || firstRow["W"] || ""
  ).trim().toLowerCase();

  const mobilePrivacy = String(
    firstRow["Pub-Mo"] || firstRow["X"] || ""
  ).trim().toLowerCase();

  const photoPrivacy = String(
    firstRow["Pub-Ph"] || firstRow["Y"] || ""
  ).trim().toLowerCase();

  const showFullCard = webPrivacy === "yes";
  const showMobile = showFullCard && mobilePrivacy === "yes";
  const showPhoto = showFullCard && photoPrivacy === "yes";

  // Pub-Web = No होने पर सभी कार्ड विवरण छिपेंगे
  // function hideCardData(value) {
  //   if (!showFullCard) return "••••••";
  //   return value ?? "";
  // }


  

function hideCardData(value) {
  const text = String(value ?? "").trim();

  if (!text) return "";
  if (text.length <= 5) return text;

  return text.slice(0, 2) +
         "•••••" +
         text.slice(-3);
}


  const privateData = formatPrivateData(firstRow);

  allCardsData.push({
    id,
    firstRow
  });


  // =========================================
  // PHOTO PRIVACY - Pub-Ph
  //
  // Yes = PHOTO CLEAR
  // No  = PHOTO BLUR
  // =========================================

 
let photoHTML = "";

if (firstRow.Photo) {
  const photoStyle = showPhoto ? "" : "filter:blur(5px);";

  photoHTML = `
    <img
      src="${firstRow.Photo}"
      alt="Photo"
      draggable="false"
      oncontextmenu="return false"
      ondragstart="return false"
      style="
        ${photoStyle}
        width:90px;
        height:90px;
        object-fit:cover;
        border-radius:50%;
        border:3px solid #e65100;
        user-select:none;
        -webkit-user-select:none;
        -webkit-touch-callout:none;
        pointer-events:auto;
      "
    >
  `;
} else {
  photoHTML = `
    <img
      src="https://via.placeholder.com/90"
      alt="No Photo"
      draggable="false"
      oncontextmenu="return false"
      style="width:90px;height:90px;object-fit:cover;border-radius:50%;"
    >
  `;
}



  // =========================================
  // TOP HEADER
  // =========================================

  const topHeader = `
    <div class="top-header">

      <img
        src="https://res.cloudinary.com/uvnoet8d/image/upload/q_auto:best,f_auto,w_450,h_450,c_fit/new_logo_bhoimalisamaj.png"
        alt="भोईमाली समाज लोगो"
      >

      <h2 class="decorative-title-bhoi">
        भोईमाली समाज राजसमंद
      </h2>

      <div class="serial">${srNo}</div>

    </div>
  `;


  // =========================================
  // CARD HEADER
  // =========================================


const cardHeader = `
  <div class="card-header">

    <div
      class="card-col"
      style="
        flex:1.05;
        padding-right:40px;
        display:flex;
        flex-direction:column;
        align-items:flex-end;
      "
    >
      <div style="text-align:left;">

        <p><b>ID: ${id}</b></p>

        <h3>${firstRow.नाम || ""}</h3>

        <p><b>पिताश्री: ${
          showFullCard
            ? (firstRow.पिताश्री || "")
            : hideCardData(firstRow.पिताश्री)
        }</b></p>

        <p><b>गौत्र: ${
          showFullCard
            ? (firstRow.गौत्र || "")
            : hideCardData(firstRow.गौत्र)
        }</b></p>

        <p><b>सम्पर्कसुत्र: ${privateData.mobile}</b></p>

      </div>
    </div>

    <div
      class="card-col"
      style="
        flex:0.5;
        display:flex;
        justify-content:center;
        align-items:center;
      "
    >
      ${photoHTML}
    </div>

    <div
      class="card-col"
      style="
        flex:1;
        text-align:left;
        padding-left:30px;
      "
    >

      <p><b>गांव: ${
        showFullCard
          ? (firstRow.Village || "")
          : hideCardData(firstRow.Village)
      }</b></p>

      <p><b>चौखला: ${
        showFullCard
          ? (firstRow.Chokala || "")
          : hideCardData(firstRow.Chokala)
      }</b></p>

      <p><b>जिला: ${
        showFullCard
          ? (firstRow.Distric || "")
          : hideCardData(firstRow.Distric)
      }</b></p>

      <p><b>Email: ${privateData.email}</b></p>

      <p><b>राज्य: ${
        showFullCard
          ? (firstRow.State || "")
          : hideCardData(firstRow.State)
      }</b></p>

    </div>

  </div>
`;



  // =========================================
  // TABLE
  // =========================================

  let tableHTML = `<table><tr>`;

  headers.forEach(h => {

    tableHTML += `<th>${h}</th>`;

  });

  tableHTML += `</tr>`;



   rows.forEach(r => {

  tableHTML += `<tr>`;

  headers.forEach(h => {

    
   let value = r[h] ?? "";

   if (
  h.trim() === "सम्पर्कसुत्र" ||
  h.trim() === "सम्पर्क सूत्र"
) {

  // Pub-Web = No होने पर मोबाइल मास्क करें
  if (!showFullCard) {
    value = maskMobile(value);
  } else {
    // Pub-Web = Yes होने पर Pub-Mo भी जाँचें
    value = formatPrivateData(r).mobile;
  }

} else if (h.trim() === "Email") {

  value = formatPrivateData(r).email;

} else if (!showFullCard) {

  value = hideCardData(value);

}


    
    tableHTML += `
      <td title="${String(value).replace(/"/g, '&quot;')}">
        ${value}
      </td>
    `;

  });

  tableHTML += `</tr>`;

 });

  tableHTML += `</table>`;


  // =========================================
  // PRINT CONTROLS
  // =========================================

  const printControls = `
    <div class="print-section">

      <label>Color:</label>

      <select
        class="print-select"
        id="color-${id}"
      >
        <option value="color">
          Color
        </option>

        <option value="grayscale">
          Black & White
        </option>

      </select>


      <label>Page:</label>

      <select
        class="print-select"
        id="orient-${id}"
      >
        <option value="portrait">
          Portrait
        </option>

        <option value="landscape">
          Landscape
        </option>

      </select>


     
<button
  class="print-btn"
  onclick="printCard('card-${id}')"
>
  🖨️ Print / PDF
</button>

<button
  class="print-btn"
  onclick="refreshCards()"
>
  🔄 Refresh
</button>


    </div>
  `;


  
// =========================================
// COMPLETE CARD + DISCLAIMER
// =========================================

allHTML += `
  <div
    class="id-card"
    id="card-${id}"
  >

    ${topHeader}

    ${cardHeader}

    ${tableHTML}

    <!-- अस्वीकरण -->
    <div class="card-disclaimer">
      अस्वीकरण: इस कार्ड में दी गई जानकारी केवल सामान्य परिचय एवं सामाजिक उपयोग के लिए है।<br>
  इसे किसी भी न्यायालय, सरकारी विभाग अथवा अन्य स्थान पर साक्ष्य के रूप में प्रस्तुत नहीं किया जा सकता।
    </div>

    ${printControls}

  </div>
`;


  srNo++;

});


// =========================================
// DOM केवल एक बार UPDATE
// =========================================

container.innerHTML = allHTML;

// Filters
createFilterOptions();
applyFilters();
}






(function protectCardImages() {

  const container = document.getElementById("cardContainer");
  if (!container) return;

  // Right-click / context menu रोकें
  ["contextmenu", "dragstart"].forEach(function(eventName) {
    container.addEventListener(eventName, function(e) {
      if (e.target.closest("img")) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  // मोबाइल पर फोटो का long-press menu रोकने में मदद
  container.addEventListener("touchstart", function(e) {
    if (e.target.closest("img")) {
      e.target.closest("img").style.webkitTouchCallout = "none";
    }
  }, { passive: true });

})();








function createFilterOptions() {

  const stateSet = new Set();
  const districtSet = new Set();
  const chokalaSet = new Set();
  const villageSet = new Set();
  const gotrSet = new Set();

  // केवल firstRow से options बनेंगे
  allCardsData.forEach(item => {

    const row = item.firstRow;

    addValue(stateSet, row.State);
    addValue(stateSet, row.state);
    addValue(stateSet, row.राज्य);

    addValue(districtSet, row.Distric);
    addValue(districtSet, row.District);
    addValue(districtSet, row.district);
    addValue(districtSet, row.जिला);

    addValue(chokalaSet, row.Chokala);
    addValue(chokalaSet, row.chokala);
    addValue(chokalaSet, row.चौखला);

    addValue(villageSet, row.Village);
    addValue(villageSet, row.village);
    addValue(villageSet, row.गांव);

    addValue(gotrSet, row.Gotr);
    addValue(gotrSet, row.गौत्र);

  });

  fillSelect("stateFilter", stateSet, "सभी राज्य");
  fillSelect("districtFilter", districtSet, "सभी जिले");
  fillSelect("chokalaFilter", chokalaSet, "सभी चौखला");
  fillSelect("villageFilter", villageSet, "सभी गांव");
  fillSelect("gotrFilter", gotrSet, "सभी गौत्र");
}


function addValue(set, value) {

  if (
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ""
  ) {
    set.add(String(value).trim());
  }

}


function fillSelect(id, values, defaultText) {

  const select = document.getElementById(id);

  if (!select) return;

  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = defaultText;

  select.appendChild(defaultOption);

  [...values]
    .sort((a, b) => a.localeCompare(b, "hi"))
    .forEach(value => {

      const option = document.createElement("option");

      option.value = value;
      option.textContent = value;

      select.appendChild(option);

    });

}




function applyFilters() {

  const state = document.getElementById("stateFilter").value;
  const district = document.getElementById("districtFilter").value;
  const chokala = document.getElementById("chokalaFilter").value;
  const village = document.getElementById("villageFilter").value;
  const gotr = document.getElementById("gotrFilter").value;

  let familyCount = 0;

  allCardsData.forEach(item => {

    const id = item.id;
    const row = item.firstRow;

    const card = document.getElementById(`card-${id}`);

    if (!card) return;

    const rowState =
      row.State ||
      row.state ||
      row.राज्य ||
      "";

    const rowDistrict =
      row.Distric ||
      row.District ||
      row.district ||
      row.जिला ||
      "";

    const rowChokala =
      row.Chokala ||
      row.chokala ||
      row.चौखला ||
      "";

    const rowVillage =
      row.Village ||
      row.village ||
      row.गांव ||
      "";

    const rowGotr =
      row.Gotr ||
      row.गौत्र ||
      "";

    const matchState =
      !state || String(rowState).trim() === state;

    const matchDistrict =
      !district || String(rowDistrict).trim() === district;

    const matchChokala =
      !chokala || String(rowChokala).trim() === chokala;

    const matchVillage =
      !village || String(rowVillage).trim() === village;

    const matchGotr =
      !gotr || String(rowGotr).trim() === gotr;

    if (
      matchState &&
      matchDistrict &&
      matchChokala &&
      matchVillage &&
      matchGotr
    ) {

      card.style.display = "";

      // एक Card = एक परिवार
      familyCount++;

    } else {

      card.style.display = "none";

    }

  });

  // Count दिखाओ
  const countBox = document.getElementById("filterFamilyCount");

  if (countBox) {
    countBox.textContent = `कुल परिवार: ${familyCount}`;
  }

}






function filterCards() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  allCardsData.forEach(item => {
    const { id, firstRow } = item;
    const card = document.getElementById(`card-${id}`);
    const text = Object.values(firstRow).join(" ").toLowerCase();
    card.style.display = text.includes(query) ? "block" : "none";
  });
}





function printCard(cardId) {
  try {
    const id = cardId.replace("card-", "");
    const colorSelect = document.getElementById("color-" + id);
    const orientSelect = document.getElementById("orient-" + id);
    const cardElement = document.getElementById(cardId);

    if (!cardElement) {
      alert("कार्ड नहीं मिला।");
      return;
    }

    const colorMode = colorSelect ? colorSelect.value : "color";
    const orientation = orientSelect ? orientSelect.value : "portrait";

    // केवल चुने हुए कार्ड का HTML
    const cardHTML = cardElement.outerHTML;

    // Print के लिए पूरा HTML दस्तावेज
    const printHTML = `
<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bhoimali-${id}</title>
<style>
  @page {
    size: A4 ${orientation};
    margin: 8mm;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background: #fff;
    color: #000;
  }

  .id-card {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 10px;
    border: 1px solid #e65100;
    border-radius: 10px;
    background: ${colorMode === "color"
      ? "linear-gradient(145deg,#fff3e0,#ffcc80)"
      : "#fff"};
    filter: ${colorMode === "color"
      ? "none"
      : "grayscale(100%)"};
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 8px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: ${colorMode === "color"
      ? "linear-gradient(135deg,#ff9800,#e65100)"
      : "#000"};
    color: #fff;
  }

  .top-header img {
    width: 45px;
    height: 45px;
    object-fit: contain;
  }

  .top-header h2 {
    flex: 1;
    margin: 0;
    font-size: 22px;
    text-align: center;
  }

  .serial {
    font-size: 20px;
    font-weight: bold;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
  }

  .card-col {
    flex: 1;
    min-width: 0;
    padding: 4px;
    overflow-wrap: anywhere;
  }

  .card-col img {
    max-width: 90px;
    height: 90px;
    object-fit: cover;
  }

  .card-col h3 {
    margin: 0;
    font-size: 14px;
    color: #d84315;
  }

  .card-col p {
    margin: 3px 0;
    font-size: 11px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }

  th, td {
    border: 1px solid #bf360c;
    padding: 4px;
    font-size: 10px;
    text-align: center;
    overflow-wrap: anywhere;
  }

  th {
    background: ${colorMode === "color" ? "#ff6f00" : "#444"};
    color: #fff;
  }

  .print-section {
    display: none !important;
  }

  .card-disclaimer {
    display: block;
    margin: 8px auto 0;
    padding: 5px;
    border: 1px solid #777;
    font-size: 9px;
    line-height: 1.4;
    text-align: center;
    color: #000;
    background: #fff;
  }

  @media print {
    .id-card {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
</style>
</head>
<body>
${cardHTML}
</body>
</html>`;

    // Android ऐप में native Android Print सेवा
    if (
      window.AndroidPrint &&
      typeof window.AndroidPrint.printHtml === "function"
    ) {
      window.AndroidPrint.printHtml(printHTML, "Bhoimali-" + id);
      return;
    }

    // ब्राउज़र में fallback
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("प्रिंट विंडो नहीं खुली। ब्राउज़र की पॉप-अप सेटिंग जाँचें।");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(printHTML);
    printWindow.document.close();

    printWindow.onload = function () {
      setTimeout(function () {
        printWindow.focus();
        printWindow.print();
      }, 500);
    };

  } catch (error) {
    console.error("Print/PDF Error:", error);
    alert("प्रिंट/PDF में समस्या आई: " + error.message);
  }
}




// =========================================
// PRIVATE DATA FORMAT
//
// Pub-Mo:
// Yes = पूरा Mobile + पूरा Email
// No  = Mobile Mask + Email Mask
//
// Mobile No example:
// Yes → 919876543210
// No  → 91***1234
// =========================================

function maskMobile(value) {
  const mobile = String(value || "").trim();
  const digits = mobile.replace(/\D/g, "");

  if (digits.length <= 5) return "••••••";

  return digits.slice(0, 2) +
         "•••••" +
         digits.slice(-3);
}

function maskEmail(value) {
  const email = String(value || "").trim();
  const atPos = email.lastIndexOf("@");

  if (atPos <= 0) return "••••••";

  const name = email.slice(0, atPos);
  const domain = email.slice(atPos);

  if (name.length <= 5) {
    return name.slice(0, 2) +
           "•••••" +
           domain;
  }

  return name.slice(0, 2) +
         "•••••" +
         name.slice(-3) +
         domain;
}




function formatPrivateData(row) {

  const webPrivacy = String(
    row["Pub-Web"] || row["W"] || ""
  ).trim().toLowerCase();

  const mobilePrivacy = String(
    row["Pub-Mo"] || row["X"] || ""
  ).trim().toLowerCase();

  // const mobile = String(
  //   row.सम्पर्कसुत्र || ""
  // ).trim();


  const mobile = String(
  row.सम्पर्कसुत्र ||
  row["सम्पर्कसुत्र"] ||
  row["सम्पर्क सूत्र"] ||
  row["Mobile"] ||
  row["मोबाइल"] ||
  ""
).trim();

  const email = String(
    row.Email || ""
  ).trim();

  // मोबाइल: पहले 2 और आखिरी 3 अंक
  function maskMobile(value) {
    const digits = String(value || "").replace(/\D/g, "");

    if (digits.length <= 5) return "••••••";

    return digits.slice(0, 2) +
           "•••••" +
           digits.slice(-3);
  }

  // Gmail: पहले 2 और आखिरी 3 अक्षर
  function maskEmail(value) {
    const atPos = value.lastIndexOf("@");

    if (atPos <= 0) return "••••••";

    const name = value.slice(0, atPos);
    const domain = value.slice(atPos);

    if (name.length <= 5) {
      return name.slice(0, 2) +
             "•••••" +
             domain;
    }

    return name.slice(0, 2) +
           "•••••" +
           name.slice(-3) +
           domain;
  }

  // Pub-Web = No: मोबाइल और Gmail भी मास्क रहें
  if (webPrivacy !== "yes") {
    return {
      mobile: maskMobile(mobile),
      email: maskEmail(email)
    };
  }

  // Pub-Mo = No: मोबाइल और Gmail मास्क रहें
  if (mobilePrivacy !== "yes") {
    return {
      mobile: maskMobile(mobile),
      email: maskEmail(email)
    };
  }

  // दोनों अनुमति Yes: पूरा विवरण
  return {
    mobile: mobile,
    email: email
  };
}




