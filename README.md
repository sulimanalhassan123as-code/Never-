# My Search Engine (Netlify-ready)

This project is a small search frontend that proxies requests to the **Google Custom Search JSON API**
via a Netlify Function so your `GOOGLE_API_KEY` and `GOOGLE_CX` remain hidden.

## Setup

1. Create a Google Cloud API key and enable Custom Search JSON API.
2. Create a Programmable Search Engine and copy the Search Engine ID (CX).
3. Push this repo to GitHub and connect it to Netlify.
4. In Netlify site settings, add environment variables:
   - `GOOGLE_API_KEY`
   - `GOOGLE_CX`
5. Deploy (Netlify will build and deploy the `public/` folder and functions).

## Quick test
- Open the site, type a query, press Enter, and results should appear.

## Notes
- Do not commit your API key to source control.
- Consider enabling caching and rate-limiting in production.
