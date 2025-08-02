const http = require("http");
const data = require("./data");
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

const server = http.createServer(data);

console.log(`Server running at http://${host}:${port}`);
console.log("Try /api/dictionary/en/hello");
console.log("Or use / to test the API with UI");

server.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});
