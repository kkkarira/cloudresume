const apiUrl = "https://8i5opez31e.execute-api.us-east-1.amazonaws.com/Lambda_Dynamodb_interface_PROD";

async function fetchVisitCount(increment = false) {
  try {
    const url = increment ? apiUrl : `${apiUrl}?action=get`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const parsedBody = typeof data.body === "string" ? JSON.parse(data.body) : data;

    document.getElementById("visit-counter").textContent = parsedBody.visit_count;
  } catch (error) {
    console.error("Error fetching visit count:", error);
    document.getElementById("visit-counter").textContent = "N/A";
  }
}

// Increment once per visit
window.onload = () => fetchVisitCount(true);

// Auto-refresh (no increment)
setInterval(() => fetchVisitCount(false), 5000);
