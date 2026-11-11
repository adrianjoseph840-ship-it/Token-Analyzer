"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT) || 3000;
const publicFiles = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/style.css", ["style.css", "text/css; charset=utf-8"]],
  ["/script.js", ["script.js", "text/javascript; charset=utf-8"]]
]);

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host || host}`).pathname;
  const asset = publicFiles.get(pathname);

  if (!asset) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("404 - Resource not found");
    return;
  }

  const [filename, contentType] = asset;
  fs.readFile(path.join(__dirname, filename), (error, contents) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("500 - Unable to load resource");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    });
    response.end(contents);
  });
});

server.listen(port, host, () => {
  console.log(`Token Analyzer is running at http://${host}:${port}`);
});
