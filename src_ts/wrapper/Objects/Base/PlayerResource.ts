import EntityManager, { EntityPropertyType } from "../../Managers/EntityManager"
import Entity from "../Base/Entity"
import Player from "../Base/Player"
import EventsSDK from "../../Managers/EventsSDK"
import PlayerData from "../../Base/PlayerData"
import PlayerTeamData from "../../Base/PlayerTeamData"
import { WrapperClass } from "../../Decorators"

@WrapperClass("C_DOTA_PlayerResource")
export default class CPlayerResource extends Entity {
	public PlayerTeamData: PlayerTeamData[] = []
	public PlayerData: PlayerData[] = []

	public get AllPlayers(): Nullable<Player>[] {
		let ar: Nullable<Player>[] = []
		EntityManager.GetEntitiesByClass(Player).forEach(pl => ar[pl.PlayerID] = pl)
		return ar
	}

	public GetPlayerTeamDataByPlayerID(playerID: number): Nullable<PlayerTeamData> {
		return this.PlayerTeamData[playerID]
	}
	public GetPlayerDataByPlayerID(playerID: number): Nullable<PlayerData> {
		return this.PlayerData[playerID]
	}
}

import { RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(CPlayerResource, "m_vecPlayerTeamData", (resource, new_val) => {
	resource.PlayerTeamData = (new_val as Map<string, EntityPropertyType>[]).map(map => new PlayerTeamData(map))
})
RegisterFieldHandler(CPlayerResource, "m_vecPlayerData", (resource, new_val) => {
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
