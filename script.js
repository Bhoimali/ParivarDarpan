  // <script>







// function refreshCards() {
//   document.getElementById("cardContainer").innerHTML =
//     "<p style='text-align:center;color:#e65100;'>Updating...</p>";

//   google.script.run.withSuccessHandler((data) => {
//     renderCards(data);
//   }).getSheetData();
// }








function refreshCards() {
  const container = document.getElementById("cardContainer");
  const loader = document.getElementById("loader");

  // Loader दिखाओ
  loader.style.display = "block";
  container.innerHTML = "<p style='text-align:center;color:#e65100;'>Updating...</p>";
  container.style.opacity = "0.4";

  google.script.run.withSuccessHandler((data) => {
    container.innerHTML = ""; // ✅ पहले पुराना Updating text हटाओ
    renderCards(data); // डेटा reload होगा ✅

    // Loader हटाओ
    loader.style.display = "none";
    container.style.opacity = "1";

  }).getSheetData();
}












    let allCardsData = [];



// column display se hatanee keliye //
function renderCards(dataObj) {
  const headers = dataObj.headers.filter(h => 
    h !== "ID" && h !== "PID" && h !== "Sex" && h !== "Village" && 
    h !== "Distric" && h !== "Chokala" && h !== "DOB" && 
    h !== "Email" && h !== "Photo" && h !== "Address" && h !== "Image"  && h !== "Link"
  ); 

  const data = dataObj.json;
  const container = document.getElementById("cardContainer");
  let grouped = {};
  data.forEach(row => {
    if (!grouped[row.PID]) grouped[row.PID] = [];
    grouped[row.PID].push(row);
  });

  allCardsData = [];
  let srNo = 1;
  Object.keys(grouped).forEach(id => {   
    const rows = grouped[id];
    const firstRow = rows[0];
    allCardsData.push({ id, firstRow });
    let photoHTML = firstRow.Photo 
      ? `<img src="${firstRow.Photo}" alt="Photo">` 
      : `<img src="https://via.placeholder.com/90" alt="No Photo">`;
    const topHeader = `
      <div class="top-header">
        <img src="https://https://res.cloudinary.com/uvnoet8d/image/upload/v1790671878/new_logo_bhoimalisamaj.png">
        <h2 class="decorative-title-bhoi">भोईमाली समाज राजसमंद</h2>
        <div class="serial"> ${srNo}</div>
      </div>
    `;
    const cardHeader = `
      <div class="card-header">
        <div class="card-col" style="flex:1.05; padding-right:40px; display:flex; flex-direction:column; align-items:flex-end;">
        <div style="text-align:left;">
          <p><b>ID: ${id} </b></p>
           <h3>${firstRow.नाम}</h3>
         <p><b>पिताश्री: ${firstRow.पिताश्री}</b></p>
          
          <p><b>गौत्र: ${firstRow.गौत्र}</b></p>
          <p><b>सम्पर्कसुत्र: ${firstRow.सम्पर्कसुत्र}</b></p>
        </div>
         </div>

<div class="card-col" style="flex:0.5; display:flex; justify-content:center; align-items:center;">
  ${photoHTML}
</div>

        
        <div class="card-col" style="flex:1; text-align:left; padding-left:30px;">
          <p><b>गांव: ${firstRow.Village}</b></p>
          <p><b>चौखला: ${firstRow.Chokala}</b></p>
          <p><b>जिला: ${firstRow.Distric}</b></p>
          <p><b>Email: ${firstRow.Email}</b></p>
        </div>
      </div>
    `;
    let tableHTML = `<table><tr>`;
    headers.forEach(h => tableHTML += `<th>${h}</th>`);
    tableHTML += `</tr>`;
    rows.forEach(r => {
      tableHTML += `<tr>`;
      headers.forEach(h => tableHTML += `<td title="${r[h]}">${r[h]}</td>`); 
      tableHTML += `</tr>`;
    });
    tableHTML += `</table>`;

    // 🔽 Dropdowns + Print Button
    const printControls = `
      <div class="print-section">
        <label>Color:</label>
        <select class="print-select" id="color-${id}">
          <option value="color">Color</option>
          <option value="grayscale">Black & White</option>
        </select>
        <label>Page:</label>
        <select class="print-select" id="orient-${id}">
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
        <button class="print-btn" onclick="printCard('card-${id}')">🖨️ Print / PDF</button>
      </div>
    `;

    const cardHTML = `
      <div class="id-card" id="card-${id}">
        ${topHeader}
        ${cardHeader}
        ${tableHTML}
        ${printControls}
      </div>
    `;
    container.innerHTML += cardHTML;
    srNo++;
  });
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




// ✅ Updated Print Function
function printCard(cardId) {
  const colorMode = document.getElementById(`color-${cardId.replace("card-","")}`).value;
  const orientation = document.getElementById(`orient-${cardId.replace("card-","")}`).value;
  const card = document.getElementById(cardId).outerHTML;

  const w = window.open('', '', 'width=1000,height=1400');
  w.document.write(`
    <html><head><title>Print Preview</title>
    <style>
      @page { size: ${orientation} Letter; margin: 10mm; }
      body {
        margin: 0; font-family: Arial, sans-serif;
        display: flex; justify-content: center; align-items: center; height: 100%;
        background: white;
      }
      .print-wrapper { display: flex; justify-content: center; align-items: center; width: 100%; }
      .id-card {
        background: ${colorMode === "color" ? "linear-gradient(145deg,#fff3e0,#ffcc80)" : "#fff"};
        border-radius: 15px; padding: 15px; width: 90%; border: 1px solid #e65100;
        filter: ${colorMode === "color" ? "none" : "grayscale(100%)"};
      }
      .top-header {
        display:flex;justify-content:space-between;align-items:center;
        background:${colorMode === "color" ? "linear-gradient(135deg,#ff9800,#e65100)" : "#000"};
        color:#fff;border-radius:10px;padding:8px 15px;margin-bottom:12px;
      }
      .top-header img{width:50px;height:50px;border-radius:50%;border:2px solid #fff;}
      .top-header h2{font-size:33px;flex:1;text-align:center;margin:0;}
      .serial{font-weight:bold;font-size:32px;}
      .card-header{display:flex;justify-content:space-between;gap:10px;margin-bottom:15px;flex-wrap:wrap;}
      .card-col{flex:1;padding:5px;}
      .card-col img{width:90px;height:90px;border-radius:50%;border:3px solid #e65100;object-fit:cover;margin:auto;display:block;}
      .card-col h3{margin:0;font-size:16px;font-weight:bold;color:#d84315;}
      .card-col p{margin:2px 0;font-size:13px;}
      table{width:100%;border-collapse:collapse;text-align:center;}
      th,td{border:1px solid #bf360c;padding:6px;font-size:13px;text-align:center;}
      th{background:${colorMode === "color" ? "#ff6f00" : "#444"};color:#fff;}
      .print-section{display:none;}
      *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}
    </style>
    </head>
    <body onload="window.print()">
      <div class="print-wrapper">${card}</div>
    </body></html>
  `);
  w.document.close();
}
  // </script>  
