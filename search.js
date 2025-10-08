// netlify/functions/search.js
import fetch from 'node-fetch';

export async function handler(event, context) {
  const API_KEY = process.env.GOOGLE_API_KEY;
  const CX = process.env.GOOGLE_CX;

  const query = event.queryStringParameters?.q || '';
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing query parameter 'q'" })
    };
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&num=10`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }
    const data = await res.json();
    const items = (data.items || []).map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink
    }));
    return {
      statusCode: 200,
      body: JSON.stringify({
        query,
        totalResults: data.searchInformation?.totalResults || "0",
        items
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
}
