const { KahluaTable } = require("./KahluaTable");
const { BufferMessage } = require("./network/BufferMessage");

class GameClient
{
    static Instance;
    constructor()
    {
        if (GameClient.Instance == null)
            GameClient.Instance = this;
    }

    static ReceiveSpawnRegion(buffer = BufferMessage)
    {
        let n = buffer.ReadInt();
        let table = new KahluaTable();
        table.Load(buffer, 193)
        if (GameClient.Instance.ServerSpawnRegions == null)
            GameClient.Instance.ServerSpawnRegions = new KahluaTable();
        
        //GameClient.Instance.ServerSpawnRegions.load(buffer, 194);
        GameClient.Instance.ServerSpawnRegions.RawSet(n, table);
        //console.log(JSON.stringify(GameClient.Instance.ServerSpawnRegions.delegate));
        //console.log(GameClient.Instance.ServerSpawnRegions.delegate.get(1).delegate.get('points').delegate.get('chef').delegate);
    }
}

module.exports = { GameClient }