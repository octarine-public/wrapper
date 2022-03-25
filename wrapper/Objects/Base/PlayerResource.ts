import PlayerData from "../../Base/PlayerData"
import PlayerTeamData from "../../Base/PlayerTeamData"
import { WrapperClass } from "../../Decorators"
import { EntityPropertiesNode } from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import Entity from "../Base/Entity"
import { Players } from "./Player"

@WrapperClass("CDOTA_PlayerResource")
export default class CPlayerResource extends Entity {
	public PlayerTeamData: PlayerTeamData[] = []
	public PlayerData: PlayerData[] = []

	public GetPlayerTeamDataByPlayerID(playerID: number): Nullable<PlayerTeamData> {
		return this.PlayerTeamData[playerID]
	}
	public GetPlayerDataByPlayerID(playerID: number): Nullable<PlayerData> {
		return this.PlayerData[playerID]
	}
}

import { RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(CPlayerResource, "m_vecPlayerTeamData", (resource, new_val) => {
	resource.PlayerTeamData = (new_val as EntityPropertiesNode[]).map(map => new PlayerTeamData(map))
	Players.forEach(player => player.UpdateHero())
})
RegisterFieldHandler(CPlayerResource, "m_vecPlayerData", (resource, new_val) => {
	resource.PlayerData = (new_val as EntityPropertiesNode[]).map(map => new PlayerData(map))
})

export let PlayerResource: Nullable<CPlayerResource>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CPlayerResource)
		PlayerResource = ent
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CPlayerResource)
		PlayerResource = undefined
})
