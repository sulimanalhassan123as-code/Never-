// === Google Custom Search Integration ===
// Replace these placeholders with your actual API key and Search Engine ID:
const API_KEY = "PASTE_YOUR_API_KEY_HERE";
const SEARCH_ENGINE_ID = "PASTE_YOUR_SEARCH_ENGINE_ID_HERE";

const form = document.getElementById("search-form");
const queryInput = document.getElementById("query");
const resultsDiv = document.getElementById("results");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = queryInput.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = "<p>Searching...</p>";

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`
    );

    if (!response.ok) throw new Error("Search request failed");

    const data = await response.json();
    displayResults(data.items);
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = "<p>Something went wrong. Check your API key or CX.</p>";
  }
});

function displayResults(items) {
  if (!items || items.length === 0) {
    resultsDiv.innerHTML = "<p>No results found.</p>";
    return;
  }

  resultsDiv.innerHTML = items
    .map(
      (item) => `
      <div class="result-item">
        <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
        <p>${item.snippet}</p>
        <a class="link" href="${item.link}" target="_blank">${item.link}</a>
      </div>
    `
    )
    .join("<hr>");
}
