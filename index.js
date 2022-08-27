const { Client, PacketPriority, PacketReliability } = require('raknet-native')
const { Buffer } = require('buffer')
const fs = require('fs');

let options = JSON.parse(fs.readFileSync("options.json"));

const client = new Client(options.server_ip, parseInt(options.server_port));
client.connect();

client.on("pong", (extra) => console.log("Pong: "+ JSON.stringify(extra)));
client.ping();
client.on("disconnect", (data) => console.log("Disconnected: "+data.address+" "+data.guid+" "+data.reason));
client.on("connect", (data) => 
{
    console.log("Connected: "+data.address+" "+data.guid);

    let buffer = Buffer.from([0x86, 0, 0x02]);
    buffer = Buffer.concat([buffer, Buffer.from([0x00, 0x09]), Buffer.from('username1'), Buffer.from([0x00, 0x09]), Buffer.from('password2'), Buffer.from([0x00, 0x05]), Buffer.from('41.73')])
    console.log(JSON.stringify(buffer));
    client.send(buffer, PacketPriority.HIGH_PRIORITY, PacketReliability.RELIABLE_ORDERED, false);
});
client.on("encapsulated", (data) => console.log("Encapsulated: "+data.buffer+" "+data.address+" "+data.guid));
