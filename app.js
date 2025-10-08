// public/js/app.js
const form = document.getElementById('searchForm');
const resultsEl = document.getElementById('results');
const input = document.getElementById('q');

function escapeHtml(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderLoading(q){
  resultsEl.innerHTML = `
    <div class="result-card">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="spinner" aria-hidden="true">⏳</div>
        <div>Searching for "<strong>${escapeHtml(q)}</strong>"...</div>
      </div>
    </div>
  `;
}

function renderResults(data){
  if(!data || !data.items || data.items.length===0){
    resultsEl.innerHTML = `<div class="result-card"><div>No results found for "<strong>${escapeHtml(data?.query||'')}</strong>".</div></div>`;
    return;
  }
  resultsEl.innerHTML = data.items.map(it=>`
    <article class="result-card">
      <a class="result-link" href="${escapeHtml(it.link)}" target="_blank" rel="noopener">
        <div class="result-domain">${escapeHtml(it.displayLink||'')}</div>
        <h3 class="result-title">${escapeHtml(it.title)}</h3>
      </a>
      <p class="result-snippet">${escapeHtml(it.snippet||'')}</p>
    </article>
  `).join('');
}

async function doSearch(q){
  renderLoading(q);
  try{
    const res = await fetch(`/.netlify/functions/search?q=${encodeURIComponent(q)}`);
    if(!res.ok){
      const txt = await res.text();
      resultsEl.innerHTML = `<div class="result-card">Error: ${escapeHtml(txt)}</div>`;
      return;
    }
    const data = await res.json();
    renderResults(data);
  }catch(err){
    resultsEl.innerHTML = `<div class="result-card">Network error. Try again later.</div>`;
  }
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const q = input.value.trim();
  if(!q) return;
  doSearch(q);
});

// Optional: allow clicking result domain to open in new tab (handled by anchor)
// Optional: support "I'm feeling lucky" later
