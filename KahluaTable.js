/*
=License=
Kahlua is distributed under the MIT licence which is the same as standard Lua
which means you can pretty much use it in any way you want.
However, I would very much appreciate bug reports, bug fixes, optimizations
or simply any good idea that might improve Kahlua.
- https://github.com/krka/kahlua2
*/

const { BufferMessage } = require("./network/BufferMessage");

class KahluaTable
{
    constructor(delegate)
    {
        if (delegate != null && delegate instanceof Map)
        {
            this.delegate = delegate;
        }
        else
        {
            this.delegate = new Map();
        }
    }

    Load(buffer = BufferMessage, n)
    {
        //console.log("1111111111");
        console.assert(buffer.GetMessage().length != 0, "Tried to load from an empty buffer!"+JSON.stringify(buffer));
        console.assert(n > 0, "Tried to load <= 0 bytes from the buffer!"+JSON.stringify(n));
        let n2 = buffer.ReadInt();
        //console.log("n2: "+n2);
        this.Wipe();
        if (n >= 25)
        {
            for (let i = 0; i < n2; ++i)
            {
                let byte = buffer.ReadByte();
                let object1 = this.Load_Object(buffer, n, byte);
                let byte2 = buffer.ReadByte();
                let object2 = this.Load_Object(buffer, n, byte2);
                // console.log("byte1: "+byte);
                // console.log("byte2: "+byte2);
                // console.log("object1: "+JSON.stringify(object1));
                // console.log("object2: "+JSON.stringify(object2) + object2 + object2.toString());
                this.RawSet(object1, object2);
            }
        }
        else
        {
            for (let i = 0; i < n2; ++i) {
                let byte = buffer.ReadByte();
                let string = buffer.ReadString();
                let object = this.Load_Object(byteBuffer, n, byte);
                // console.log("byte: "+byte);
                // console.log("object: "+JSON.stringify(object));
                this.RawSet(string, object);
            }
        }
        return this;
    }

    Load_Object(buffer = BufferMessage, n, byte)
    {
        //console.log("2");
        //console.assert(byte instanceof Number, "Byte must be a number. " +JSON.stringify(byte));
        console.assert(byte >= 0 && byte < 4, "Invalid lua table type (must be 0,1,2,3): "+byte);
        switch(byte)
        {
            case 0:
                return buffer.ReadString();
            case 1:
                return buffer.ReadDouble();
            case 3:
                return buffer.ReadByte();
            case 2:
                return new KahluaTable().Load(buffer, n);
        }
    }

    // Very bare-bones from KahluaTableImpl.java
    RawSet(object1, object2)
    {
        if (object2 == null && this.delegate != null)
        {
            console.log("Deleting object1: "+JSON.stringify(object1));
            this.delegate.delete(object1);
            return;
        }
        this.delegate.set(object1, object2);
        return this;
    }

    Wipe()
    {
        if (this.delegate.size != 0)
            console.log("Wiping Kahlua map of size "+this.delegate.size);
        this.delegate = new Map();
    }
}

module.exports = { KahluaTable };