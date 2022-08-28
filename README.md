# ZomboidBot

This is intended to be a library for creating a bot for a Project Zomboid server. Right now it uses a Raknet library to send and receive raw bytes to and from a Project Zomboid server, but soon it will provide better functions and events for dealing with requests and responses. I'm targeting the no_steam version of the Dedicated Server, with the steam version to follow.

Packets working:

* Login

## Current Workflow

PacketTypes.java contains the set of all packets with IDs, access level, and operations to perform when sending or receiving them. Supporting a packet means sending the correct information with the packet ID. For example, the Login packet expects three strings: Username, Password, and Game Version (ex. 41.73).

Right now I only handle sending packets to the server. Packets that are received are just printed to console. Each packet will each need to be handled individually.