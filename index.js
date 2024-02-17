const http = require("http");
const data = require("./data");
const port = process.env.PORT || 3000;
const server = http.createServer(data);

console.log("Server running at http://localhost:3000/");
console.log("try http://localhost:3000/api/dictionary/english/hello");
server.listen(port);
