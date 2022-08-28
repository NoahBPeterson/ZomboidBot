const { Buffer } = require('buffer');

class BufferMessage
{
    constructor()
    {
        this.messageBuffer = new Buffer.from([0x86]);
    }

    Clear()
    {
        this.messageBuffer = new Buffer.from([0x86])
        return this;
    }

    GetMessage()
    {
        return this.messageBuffer;
    }

    SetPacketType(PacketType = PacketType)
    {
        this.WriteShort(PacketType.id);
        return this;
    }

    WriteShort(short = 0)
    {
        console.assert(short < 32768 && short >= -32768); // [-2^15, (2^15)-1]
        let byteArray = [];
        if (short < 256)
        {
            byteArray = [0, short];
        } else
        {
            let upperByte = short >> 8;
            let lowerByte = short % 256;
            byteArray = [upperByte, lowerByte];
        }

        this.messageBuffer = Buffer.concat([this.messageBuffer, Buffer.from(byteArray)]);
        return this;
    }

    WriteString(string = "")
    {
        if (string.length == 0 || string == null) throw Error("Cannot write an empty or null string.");
        this.WriteShort(string.length);
        this.messageBuffer = Buffer.concat([this.messageBuffer, Buffer.from(string)]);
        return this;
    }
}


module.exports = { BufferMessage }