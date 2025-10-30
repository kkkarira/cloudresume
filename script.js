const API_BASE = "https://8i5opez31e.execute-api.us-east-1.amazonaws.com/Lambda_Dynamodb_interface_PROD";

// Read-only GET to fetch current count
async function fetchVisitCount() {
  try {
    const response = await fetch(`${API_BASE}`, { method: "GET" });
    if (!response.ok) throw new Error("Network response not ok");
    const data = await response.json();
    // If API Gateway returns {"body":"{...}"} parse it
    const parsed = typeof data.body === "string" ? JSON.parse(data.body) : data;
    document.getElementById("visit-counter").textContent = parsed.visit_count ?? "N/A";
  } catch (err) {
    console.error("Error fetching visit count:", err);
    document.getElementById("visit-counter").textContent = "N/A";
  }
}

// POST once to increment on a real visit
async function postIncrementOnce() {
  try {
    // basic per-browser idempotency using localStorage
    const KEY = "cloudresume_counted_v1";
    if (localStorage.getItem(KEY)) {
      // already counted in this browser/session
      return;
    }

    // Do POST to increment
    const response = await fetch(API_BASE, { method: "POST" });
    if (!response.ok) {
      console.warn("POST increment returned non-OK status", response.status);
      return;
    }

    // mark as counted in localStorage (prevents duplicate POSTs from this browser)
    localStorage.setItem(KEY, Date.now().toString());
  } catch (err) {
    console.error("Error posting visit increment:", err);
  }
}

// On load: ensure we POST exactly once per browser, and always GET the count.
window.addEventListener("load", async () => {
  // perform a one-time POST (non-blocking)
  postIncrementOnce();

  // fetch and show immediately
  await fetchVisitCount();

  // auto-refresh every 5 seconds (read-only)
  setInterval(fetchVisitCount, 5000);
});
