import EntityManager, { EntityPropertyType } from "../../Managers/EntityManager"
import Entity from "../Base/Entity"
import Player from "../Base/Player"
import EventsSDK from "../../Managers/EventsSDK"
import PlayerData from "../../Base/PlayerData"
import PlayerTeamData from "../../Base/PlayerTeamData"

export default class CPlayerResource extends Entity {
	public NativeEntity: Nullable<C_DOTA_PlayerResource>
	public AllPlayers_: number[] = []
	public PlayerTeamData: PlayerTeamData[] = []
	public PlayerData: PlayerData[] = []

	public get AllPlayers(): Nullable<Player>[] {
		// loop-optimizer: FORWARD
		return this.AllPlayers_.map(id => EntityManager.EntityByIndex(id)) as Nullable<Player>[]
	}

	public GetPlayerTeamDataByPlayerID(playerID: number): Nullable<PlayerTeamData> {
		return this.PlayerTeamData[playerID]
	}
	public GetPlayerDataByPlayerID(playerID: number): Nullable<PlayerData> {
		return this.PlayerData[playerID]
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_PlayerResource", CPlayerResource)
RegisterFieldHandler(CPlayerResource, "m_playerIDToPlayer", (resource, new_val) => resource.AllPlayers_ = new_val as number[])
RegisterFieldHandler(CPlayerResource, "m_vecPlayerTeamData", (resource, new_val) => {
	// loop-optimizer: FORWARD
	resource.PlayerTeamData = (new_val as Map<string, EntityPropertyType>[]).map(map => new PlayerTeamData(map))
})
RegisterFieldHandler(CPlayerResource, "m_vecPlayerData", (resource, new_val) => {
	// loop-optimizer: FORWARD
	resource.PlayerData = (new_val as Map<string, EntityPropertyType>[]).map(map => new PlayerData(map))
})

export let PlayerResource: Nullable<CPlayerResource>
EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof CPlayerResource)
		PlayerResource = ent
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CPlayerResource)
		PlayerResource = undefined
})
