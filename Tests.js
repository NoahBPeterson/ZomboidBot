const {BufferMessage} = require("./BufferMessage.js");
const {PacketType} = require("./PacketType.js");

let packetErrorMessage = "Packet bytes did not write correctly to the buffer.";
let byteErrorMessage = "BufferMessage did not read/write a byte correctly! ";
let shortErrorMessage = "BufferMessage did not read/write a short-integer correctly! ";
let intErrorMessage = "BufferMessage did not read/write an integer correctly! ";
let longErrorMessage = "BufferMessage did not read/write a long correctly! ";
let stringErrorMessage = "BufferMessage did not read/write a string correctly! ";

let testBufferMessage = new BufferMessage();
console.assert(
    Buffer.from([134, 0, 142]).compare(testBufferMessage.Clear().WriteShort(PacketType.AcceptedFactionInvite.id).GetMessage()) == 0,
    packetErrorMessage+JSON.stringify(testBufferMessage));
console.assert(
    Buffer.from([134, 0, 143]).compare(testBufferMessage.Clear().WriteShort(PacketType.AcceptedFactionInvite.id).GetMessage()) != 0,
    packetErrorMessage+JSON.stringify(testBufferMessage));
console.assert(
    Buffer.from([134, 125, 2]).compare(testBufferMessage.Clear().WriteShort(PacketType.RadioPostSilenceEvent.id).GetMessage()) == 0,
    packetErrorMessage+JSON.stringify(testBufferMessage));

/// Test a mix of reading/writing Short, Int, String, and Long.
testBufferMessage.Clear();
var string = "testMessageLength";
var string2 = "testingMessagingLengthening";
var string3 = "tML";
testBufferMessage
    .WriteShort(42)
    .WriteShort(10752)
    .WriteInt(100_000)
    .WriteString(string)
    .WriteString(string2)
    .WriteString(string3)
    .WriteLong(2_147_483_638);

var readShort = testBufferMessage.ReadShort();
var readShort2 = testBufferMessage.ReadShort();
var readInt = testBufferMessage.ReadInt();
var readString = testBufferMessage.ReadString();
var readString2 = testBufferMessage.ReadString();
var readString3 = testBufferMessage.ReadString();
var readLong = testBufferMessage.ReadLong();
console.assert(readShort == 42, shortErrorMessage + JSON.stringify(readShort));
console.assert(readShort2 == 10752, shortErrorMessage + JSON.stringify(readShort2));
console.assert(readInt == 100_000, intErrorMessage + JSON.stringify(readInt));
console.assert(readString.includes(string), stringErrorMessage+ JSON.stringify(readString));
console.assert(readString2.includes(string2), stringErrorMessage+ JSON.stringify(readString2));
console.assert(readString3.includes(string3), stringErrorMessage+ JSON.stringify(readString3));
console.assert(readLong == 2_147_483_638, longErrorMessage + readLong);

/// Test reading/writing 8-byte longs.
var testBufferMessageLong = new BufferMessage();
testBufferMessageLong
    .WriteLong(1_000_000)
    .WriteLong(500_000)
    .WriteLong(4);
var longs = [testBufferMessageLong.ReadLong(), testBufferMessageLong.ReadLong(), testBufferMessageLong.ReadLong()];
console.assert(longs[0] == 1_000_000, longErrorMessage + JSON.stringify(longs[0]));
console.assert(longs[1] == 500_000, longErrorMessage + JSON.stringify(longs[1]));
console.assert(longs[2] == 4, longErrorMessage + JSON.stringify(longs[2]));

/// Test reading/writing 4-byte integers.
var testBufferMessageInt = new BufferMessage();
testBufferMessageInt
    .WriteInt(1_000_000)
    .WriteInt(500_000)
    .WriteInt(4);
var integers = [testBufferMessageInt.ReadInt(), testBufferMessageInt.ReadInt(), testBufferMessageInt.ReadInt()];
console.assert(integers[0] == 1_000_000, intErrorMessage + JSON.stringify(integers[0]));
console.assert(integers[1] == 500_000, intErrorMessage + JSON.stringify(integers[1]));
console.assert(integers[2] == 4, intErrorMessage + JSON.stringify(integers[2]));

/// Test reading/writing 2-byte shorts.
var testBufferMessageShort = new BufferMessage();
testBufferMessageShort
    .WriteShort(30_000)
    .WriteShort(256)
    .WriteShort(30);
var shorts = [testBufferMessageShort.ReadShort(), testBufferMessageShort.ReadShort(), testBufferMessageShort.ReadShort()];
console.assert(shorts[0] == 30_000, shortErrorMessage + JSON.stringify(shorts[0]));
console.assert(shorts[1] == 256, shortErrorMessage + JSON.stringify(shorts[1]));
console.assert(shorts[2] == 30, shortErrorMessage + JSON.stringify(shorts[2]));

/// Test reading/writing 1-byte numbers.
var testBufferMessageByte = new BufferMessage();
testBufferMessageByte
    .WriteByte(120)
    .WriteByte(-120)
    .WriteByte(10);
var bytes = [testBufferMessageByte.ReadByte(), testBufferMessageByte.ReadByte(), testBufferMessageByte.ReadByte()];
console.assert(bytes[0] == 120, byteErrorMessage + JSON.stringify(bytes[0]));
console.assert(bytes[1] == -120, byteErrorMessage + JSON.stringify(bytes[1]));
console.assert(bytes[2] == 10, byteErrorMessage + JSON.stringify(bytes[2]));

/// Test reading/writing strings.
var testBufferMessageString = new BufferMessage();
testBufferMessageString
    .WriteString("lengthOne")
    .WriteString("longerLengthString")
    .WriteString("longestStringOfThemAll");
var strings = [testBufferMessageString.ReadString(), testBufferMessageString.ReadString(), testBufferMessageString.ReadString()];
console.assert(strings[0] == "lengthOne", stringErrorMessage + JSON.stringify(strings[0]));
console.assert(strings[1] == "longerLengthString", stringErrorMessage + JSON.stringify(strings[1]));
console.assert(strings[2] == "longestStringOfThemAll", stringErrorMessage + JSON.stringify(strings[2]));


// console.log(JSON.stringify(testBufferMessage));

console.log("Finished running tests.");