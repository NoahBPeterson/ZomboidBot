const {BufferMessage} = require("./BufferMessage.js");
const {PacketType} = require("./PacketType.js");

let testBufferMessage = new BufferMessage();
console.assert(
    Buffer.from([134, 0, 142]).compare(testBufferMessage.Clear().WriteShort(PacketType.AcceptedFactionInvite.id).GetMessage()) == 0,
    "Packet bytes did not write correctly to the buffer.");
console.assert(
    Buffer.from([134, 0, 143]).compare(testBufferMessage.Clear().WriteShort(PacketType.AcceptedFactionInvite.id).GetMessage()) != 0,
    "Packet bytes did not write correctly to the buffer.");
console.assert(
    Buffer.from([134, 125, 2]).compare(testBufferMessage.Clear().WriteShort(PacketType.RadioPostSilenceEvent.id).GetMessage()) == 0,
    "Packet bytes did not write correctly to the buffer.");

console.log("Finished running tests.");