// Tiny local site used only by the harness, so the mutant mechanism is tested without the real Conduit.
// /page renders a title from an embedded __NEXT_DATA__ block (like a server-rendered Next.js page)
// and a subtitle fetched from /api/data (like a client-side API call).
import { createServer } from 'node:http';

const PORT = Number(process.env.HARNESS_PORT ?? 4599);

const page = `<!doctype html>
<html><body>
<h1 id="title"></h1>
<p id="subtitle">loading</p>
<button id="go">Go</button>
<script id="__NEXT_DATA__" type="application/json">{"props":{"title":"Hello"}}</script>
<script>
  document.getElementById('title').textContent =
    JSON.parse(document.getElementById('__NEXT_DATA__').textContent).props.title;
  fetch('/api/data').then(r => r.json()).then(d => {
    document.getElementById('subtitle').textContent = d.subtitle;
  });
</script>
</body></html>`;

createServer((req, res) => {
  if (req.url === '/page') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(page);
  } else if (req.url === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ subtitle: 'World', extra: 1 }));
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(PORT);
