const port = Number(process.argv[2] || "9090") >>> 0;
const public = process.argv[3] || "build";

const express = require("express");
const path = require("path");
const app = express();

const root = path.join(__dirname, "..");
const hostPath = path.join(root, public);

app.use(express.static(hostPath));
app.listen(port);

console.log(`Listening on ${port}.`);
console.log(`Hosting from "${path.relative(root, hostPath)}".`);
console.log("Press Ctrl+C to stop the server.");
