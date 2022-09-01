const { Buffer } = require('buffer');

class BufferMessage
{
    constructor(buffer)
    {
        if (buffer == null)
        {
            this.messageBuffer = new Buffer.from([0x86]);
            this.offset = 1;
        }
        else
        {
            this.messageBuffer = buffer;
            if (this.messageBuffer[0] == 134)
                this.offset = 1;    
        }
    }

    Clear()
    {
        this.messageBuffer = new Buffer.from([0x86]);
        this.offset = 1;
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

    ReadByte(offset = -1)
    {
        var byte = 0;
        if (offset == -1)
        {
            console.assert(this.offset <= (this.messageBuffer.byteLength - 1), "Tried to read 1 byte from message buffer where there isn't 1 byte.")
            byte = this.messageBuffer.readInt8(this.offset);
            this.offset += 1;
        }
        else
        {
            console.assert(offset <= (this.messageBuffer.byteLength - 1), "Tried to read 1 byte from message buffer where there isn't 1 byte.")
            byte = this.messageBuffer.readInt8(offset);
        }
        return byte;
    }

    ReadShort(offset = -1)
    {
        var short = 0;
        if (offset == -1)
        {
            console.assert(this.offset <= (this.messageBuffer.byteLength - 2), "Tried to read 2 bytes from message buffer where there isn't 2 bytes.")
            short = this.messageBuffer.readInt16BE(this.offset);
            this.offset += 2;
        }
        else
        {
            console.assert(offset <= (this.messageBuffer.byteLength - 2), "Tried to read 2 bytes from message buffer where there isn't 2 bytes.")
            short = this.messageBuffer.readInt16BE(offset);
        }
        return short;
    }

    ReadInt(offset = -1)
    {
        var int = 0;
        if (offset == -1)
        {
            console.assert(this.offset <= (this.messageBuffer.byteLength - 4), "Tried to read 4 bytes from message buffer where there isn't 4 bytes.")
            int = this.messageBuffer.readInt32BE(this.offset);
            this.offset += 4;
        }
        else
        {
            console.assert(offset <= (this.messageBuffer.byteLength - 4), "Tried to read 4 bytes from message buffer where there isn't 4 bytes.")
            int = this.messageBuffer.readInt32BE(offset);
        }
        return int;
    }

    ReadDouble(offset = -1)
    {
        var double = 0;
        if (offset == -1)
        {
            console.assert(this.offset <= (this.messageBuffer.byteLength - 8), "Tried to read 8 bytes from message buffer where there isn't 8 bytes.")
            double = this.messageBuffer.readDoubleBE(this.offset);
            this.offset += 8;
        }
        else
        {
            console.assert(offset <= (this.messageBuffer.byteLength - 8), "Tried to read 8 bytes from message buffer where there isn't 8 bytes.")
            double = this.messageBuffer.readDoubleBE(offset);
        }
        return double;
    }

    ReadLong(offset = -1)
    {
        var long = 0;
        if (offset == -1)
        {
            console.assert(this.offset <= (this.messageBuffer.byteLength - 8), "Tried to read 8 bytes from message buffer where there isn't 8 bytes.")
            this.ReadInt(); // Throwaway. We don't really handle numbers larger than 2^31, but we have to be able to send 8 byte integers.
            long = this.ReadInt();
        }
        else
        {
            console.assert(offset <= (this.messageBuffer.byteLength - 8), "Tried to read 8 bytes from message buffer where there isn't 8 bytes.")
            long = this.ReadInt(offset+4);
        }
        return long;
    }

    ReadString(offset = -1)
    {
        var string = "";
        if (offset == -1)
        {
            var stringLength = this.ReadShort();
            string = this.messageBuffer.toString('utf8', this.offset, this.offset + stringLength);
            this.offset += stringLength;
        }
        else
        {
            var stringLength = this.ReadShort(offset);
            string = this.messageBuffer.toString('utf8', offset, offset+1+stringLength);
        }
        return string;
    }

    WriteByte(byte = 0)
    {
        console.assert(byte < 128 && byte >= -128); // [-2^7, (2^7)-1]
        var buffer = Buffer.alloc(1);
        buffer.writeIntBE(byte, 0, 1);
        this.messageBuffer = Buffer.concat([this.messageBuffer, buffer]);
        return this;
    }

    WriteShort(short = 0)
    {
        console.assert(short < 32768 && short >= -32768); // [-2^15, (2^15)-1]
        var buffer = Buffer.alloc(2);
        buffer.writeIntBE(short, 0, 2);
        this.messageBuffer = Buffer.concat([this.messageBuffer, buffer]);
        return this;
    }

    WriteInt(int = 0)
    {
        console.assert(int < 2147483648 && int >= -2147483648); // [-2^31, (2^31)-1]
        var buffer = Buffer.alloc(4);
        buffer.writeIntBE(int, 0, 4);
        this.messageBuffer = Buffer.concat([this.messageBuffer, buffer]);
        return this;
    }

    WriteDouble(double = 0)
    {
        console.assert(double < Number.MAX_VALUE && double >= Number.MIN_VALUE); // [-2^31, (2^31)-1]
        var buffer = Buffer.alloc(8);
        buffer.writeDoubleBE(double, 0, 8);
        this.messageBuffer = Buffer.concat([this.messageBuffer, buffer]);
        return this;
    }

    WriteLong(long = 0)
    {
        console.assert(long < 2147483648 && long >= -2147483648); // [-2^31, (2^31)-1]
        this.WriteInt(0).WriteInt(long);
        return this;
    }

    WriteString(string = "")
    {
        if (string.length == 0 || string == null) throw Error("Cannot write an empty or null string.");
        this.WriteShort(string.length);
        var stringBuffer = Buffer.from(string);
        this.messageBuffer = Buffer.concat([this.messageBuffer, stringBuffer]);
        return this;
    }
}

module.exports = { BufferMessage }