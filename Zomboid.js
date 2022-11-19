const { Client, PacketPriority, PacketReliability } = require('raknet-native');
const { EventEmitter } = require('events');
const { BufferMessage } = require('./network/BufferMessage.js');
const { PacketType } = require('./network/PacketType.js');
const { GameClient } = require('./GameClient.js');

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
      this.GameClient = new GameClient();

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
      client.on("encapsulated", (data) => this.HandlePacket(new BufferMessage(data.buffer))); 
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

    HandlePacket(buffer = BufferMessage)
    {
      //console.log("Encapsulated: "+buffer.GetMessage())
      let packetType = buffer.ReadShort();
      switch (packetType)
      {
        case PacketType.SpawnRegion.getId(): // SpawnRegion => Received immediately on Login.
          GameClient.ReceiveSpawnRegion(buffer);
          break;
        case PacketType.ConnectionDetails.getId(): // ConnectionDetails => ?
          console.log(JSON.stringify(buffer.GetMessage()));
          break;
        case PacketType.RequestData.getId(): // Request
          console.log(PacketType.RequestData.name+" "+JSON.stringify(buffer.GetMessage()));
          break;
        default:
          console.log("Received a packet without a handler! ID is "+packetType);
          break;
      }
    }
}

module.exports = { ZomboidClient }