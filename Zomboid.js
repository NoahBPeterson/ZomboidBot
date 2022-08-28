const { Client, PacketPriority, PacketReliability } = require('raknet-native');
const { EventEmitter } = require('events');
const { BufferMessage } = require('./BufferMessage.js');
const { PacketType } = require('./PacketType.js');

class ZomboidClient extends EventEmitter
{
    constructor (hostname, port, version)
    {
      super()
      const client = new Client(hostname, parseInt(port));
      this.client = client;
      this.connected = false;
      this.connectionTries = 0;
      this.version = version;

      client.on("disconnect", (data) => 
      {
        console.log("Disconnected: "+data.address+" "+data.guid+" "+data.reason);
        this.connected = false;
      });
      client.on("connect", (data) => 
      {
          console.log("Connected: "+data.address+" "+data.guid);
          this.connected = true;
      });
      client.on("encapsulated", (data) => console.log("Encapsulated: "+data.buffer+" "+data.address+" "+data.guid));
    }

    Login(username = "", password = "")
    {
      if (this.connected)
      {
        var callback = (data) => 
        {
          if (data.buffer == null) return;
          var stringConversion = ""+data.buffer;
          if (stringConversion.includes("spawnpoints"))
          {
            this.emit('Login', "Successfully logged in with username "+username+".");
            temp_event.off("encapsulated", callback);
          }
        };
        var temp_event = this.client.on("encapsulated", callback);
        var messageBuffer = new BufferMessage().SetPacketType(PacketType.Login).WriteString(username).WriteString(password).WriteString(this.version);
        this.client.send(messageBuffer.GetMessage(), PacketPriority.HIGH_PRIORITY, PacketReliability.RELIABLE_ORDERED, false);
      } 
      else
      {
        this.client.connect();
        this.client.once('connect', () => 
        {
          this.connected = true;
          this.Login(username, password)
        });
      }
      return this;
    }
}

module.exports = { ZomboidClient }
