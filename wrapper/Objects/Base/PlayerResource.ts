import PlayerData from "../../Base/PlayerData"
import PlayerTeamData from "../../Base/PlayerTeamData"
import { WrapperClass } from "../../Decorators"
import { EntityPropertiesNode } from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import Entity from "../Base/Entity"
import { Players } from "./Player"

@WrapperClass("CDOTA_PlayerResource")
export default class CPlayerResource extends Entity {
	public PlayerTeamData: Nullable<PlayerTeamData>[] = []
	public PlayerData: Nullable<PlayerData>[] = []

	public GetPlayerTeamDataByPlayerID(playerID: number) {
		return this.PlayerTeamData[playerID]
	}
	public GetPlayerDataByPlayerID(playerID: number) {
		return this.PlayerData[playerID]
	}
}

import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
RegisterFieldHandler(CPlayerResource, "m_vecPlayerTeamData", async (resource, new_val) => {
	resource.PlayerTeamData = (new_val as EntityPropertiesNode[]).map(map => new PlayerTeamData(map))
	for (const player of Players)
		await player.UpdateHero(resource)
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
