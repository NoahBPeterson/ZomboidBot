const fs = require('fs');
const { ZomboidClient } = require('./Zomboid.js');

let options = JSON.parse(fs.readFileSync("options.json"));

const zomboidClient = new ZomboidClient(options.server_ip, options.server_port, options.game_version);

zomboidClient.on("Login", (data) => console.log(data));
zomboidClient.client.on("pong", (extra) => console.log("Pong: "+ JSON.stringify(extra)));

zomboidClient.client.ping();
zomboidClient.Login("Username1", "Password1");