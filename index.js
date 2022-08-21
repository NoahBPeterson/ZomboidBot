const fs = require('fs');

let options = JSON.parse(fs.readFileSync("options.json"));

console.log(options.ip);