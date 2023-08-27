const http = require('http');
const data = require('./data');
const path = require('path');
const port = process.env.PORT || 3000;
const server = http.createServer(data);

server.listen(port);