const apiBase = "https://8i5opez31e.execute-api.us-east-1.amazonaws.com/Lambda_Dynamodb_interface_PROD";
const counterEl = document.getElementById("visit-counter");

async function fetchVisitCount(increment = false) {
  try {
    const url = increment ? apiBase : `${apiBase}?action=get`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const parsedBody = typeof data.body === "string" ? JSON.parse(data.body) : data;

    counterEl.textContent = parsedBody.visit_count;
  } catch (error) {
    console.error("Error fetching visit count:", error);
    counterEl.textContent = "N/A";
  }
}

// Increment once on first load
window.onload = () => fetchVisitCount(true);

// Refresh every 10 seconds without incrementing
setInterval(() => fetchVisitCount(false), 10000);
